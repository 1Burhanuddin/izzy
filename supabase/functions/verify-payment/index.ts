
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body and extract sessionId
    const { sessionId } = await req.json();
    
    if (!sessionId) {
      return new Response(
        JSON.stringify({ error: "Session ID is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    console.log(`Verifying payment for session: ${sessionId}`);
    
    // Get authorization header
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Use service role key to bypass RLS
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const supabaseClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY") || "");
    
    // Validate user token
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      console.error("User authentication error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    // Initialize Stripe with secret key
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("Missing Stripe secret key");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });
    
    console.log("Retrieving Stripe session...");
    
    // Retrieve session from Stripe
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      console.log("Stripe session retrieved:", JSON.stringify({
        id: session.id,
        payment_status: session.payment_status,
        customer: session.customer
      }));
      
      // Check payment status
      if (session.payment_status === "paid") {
        // Update order status in database
        console.log("Payment is paid, updating order status...");
        
        const { data: orders, error: orderQueryError } = await supabaseAdmin
          .from("orders")
          .select("*")
          .eq("transaction_id", sessionId)
          .maybeSingle();
          
        if (orderQueryError) {
          console.error("Error querying order:", orderQueryError);
          throw orderQueryError;
        }
        
        if (!orders) {
          console.error("No order found with transaction ID:", sessionId);
          return new Response(
            JSON.stringify({ error: "Order not found" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 404 }
          );
        }
        
        console.log(`Updating order ${orders.id} to processing status`);
        const { error: updateError } = await supabaseAdmin
          .from("orders")
          .update({ 
            status: "processing", 
            payment_status: "completed",
            updated_at: new Date().toISOString()
          })
          .eq("id", orders.id);
          
        if (updateError) {
          console.error("Error updating order:", updateError);
          throw updateError;
        }
        
        console.log("Order successfully updated");
        return new Response(
          JSON.stringify({ 
            success: true, 
            paid: true, 
            orderId: orders.id
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      } else {
        console.log(`Payment not completed. Status: ${session.payment_status}`);
        return new Response(
          JSON.stringify({ 
            success: true, 
            paid: false, 
            status: session.payment_status 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }
    } catch (stripeError) {
      console.error("Stripe error:", stripeError);
      return new Response(
        JSON.stringify({ error: `Stripe error: ${stripeError.message}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

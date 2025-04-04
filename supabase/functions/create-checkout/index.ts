
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
    const { cartItems, shippingAddress, paymentMethod } = await req.json();
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Authorization header is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    
    // Validate user token
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    const user = userData.user;
    
    // Check if we have necessary data
    if (!cartItems || !cartItems.length || !shippingAddress) {
      return new Response(
        JSON.stringify({ error: "Invalid request data" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Initialize Stripe with secret key from environment variables
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });
    
    // Format line items for Stripe
    const lineItems = cartItems.map((item: any) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.product.name,
          images: item.product.image ? [item.product.image] : [],
          description: `Category: ${item.product.category}`,
        },
        unit_amount: Math.round(item.product.price * 100), // Stripe uses cents/paise
      },
      quantity: item.quantity,
    }));
    
    // Check if we have an existing customer or create one
    let customerId;
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const newCustomer = await stripe.customers.create({
        email: user.email,
        name: shippingAddress.name,
        phone: shippingAddress.phone,
        address: {
          line1: shippingAddress.address,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.pincode,
          country: "IN", // Assuming India
        },
      });
      customerId = newCustomer.id;
    }
    
    // Create Stripe checkout session
    const origin = req.headers.get("origin") || "http://localhost:5173";
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout?canceled=true`,
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      metadata: {
        user_id: user.id,
        paymentMethod: paymentMethod,
      },
    });
    
    // Store pre-order in database
    const { data: order, error: orderError } = await supabaseClient
      .from("orders")
      .insert({
        user_id: user.id,
        total_amount: cartItems.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0),
        payment_method: "stripe",
        shipping_address: shippingAddress,
        status: "pending",
        payment_status: "pending",
        transaction_id: session.id
      })
      .select()
      .single();
      
    if (orderError) {
      console.error("Error creating order:", orderError);
      throw orderError;
    }
    
    // Store order items
    const orderItems = cartItems.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price
    }));
    
    const { error: itemsError } = await supabaseClient
      .from("order_items")
      .insert(orderItems);
      
    if (itemsError) {
      console.error("Error creating order items:", itemsError);
      throw itemsError;
    }
    
    // Return checkout URL
    return new Response(
      JSON.stringify({ 
        success: true, 
        url: session.url,
        orderId: order.id,
        sessionId: session.id
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
    
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

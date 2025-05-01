
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Minimum amount required by Stripe in INR (approximately ₹50)
const MINIMUM_AMOUNT_INR = 50;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received checkout request");
    const { cartItems, shippingAddress, paymentMethod } = await req.json();
    const authHeader = req.headers.get("Authorization");
    
    if (!authHeader) {
      console.error("Missing Authorization header");
      return new Response(
        JSON.stringify({ error: "Authorization header is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }
    
    console.log("Creating checkout session with payment method:", paymentMethod);
    
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
    
    // Use the service role key to bypass RLS policies
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
    
    const user = userData.user;
    console.log("Authenticated user:", user.id);
    
    // Check if we have necessary data
    if (!cartItems || !cartItems.length || !shippingAddress) {
      console.error("Invalid request data", { cartItems: !!cartItems, hasItems: !!cartItems?.length, shippingAddress: !!shippingAddress });
      return new Response(
        JSON.stringify({ error: "Invalid request data" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Initialize Stripe with secret key from environment variables
    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("Missing Stripe secret key");
      return new Response(
        JSON.stringify({ error: "Server configuration error: Missing Stripe secret key" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    console.log("Initializing Stripe with secret key");
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });
    
    // Format line items for Stripe
    const lineItems = cartItems.map((item: any) => {
      // Create line item with basic product data
      const lineItem = {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.product.name,
            description: `Category: ${item.product.category}`,
          },
          unit_amount: Math.round(item.product.price * 100), // Stripe uses cents/paise
        },
        quantity: item.quantity,
      };
      
      // Only add image if it exists and is not too long
      if (item.product.image) {
        // Check if the image URL is valid and not too long
        try {
          const imageUrl = new URL(item.product.image);
          if (item.product.image.length <= 2000) { // Using 2000 to be safe (below Stripe's 2048 limit)
            lineItem.price_data.product_data.images = [item.product.image];
          } else {
            console.log(`Image URL too long (${item.product.image.length} chars), skipping for product: ${item.product.name}`);
          }
        } catch (e) {
          console.log(`Invalid image URL for product ${item.product.name}, skipping`);
        }
      }
      
      return lineItem;
    });
    
    console.log("Line items prepared:", lineItems.length);
    
    // Calculate the total amount
    const totalAmount = cartItems.reduce((sum: number, item: any) => sum + (item.product.price * item.quantity), 0);
    console.log("Total amount:", totalAmount);
    
    // Check if total amount meets Stripe's minimum requirement
    if (totalAmount < MINIMUM_AMOUNT_INR) {
      console.error(`Total amount (₹${totalAmount}) is less than the minimum required by Stripe (₹${MINIMUM_AMOUNT_INR})`);
      return new Response(
        JSON.stringify({ 
          error: `The minimum order amount is ₹${MINIMUM_AMOUNT_INR}. Please add more items to your cart.`,
          code: "amount_too_small" 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
    
    // Check if we have an existing customer or create one
    let customerId;
    try {
      console.log("Looking up customer with email:", user.email);
      const customers = await stripe.customers.list({ email: user.email, limit: 1 });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
        console.log("Found existing Stripe customer:", customerId);
      } else {
        console.log("Creating new Stripe customer for:", user.email);
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
        console.log("Created new Stripe customer:", customerId);
      }
    } catch (stripeError) {
      console.error("Stripe customer error:", stripeError);
      return new Response(
        JSON.stringify({ error: `Stripe customer error: ${stripeError.message}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
    
    // Create Stripe checkout session
    try {
      const origin = req.headers.get("origin") || "http://localhost:5173";
      console.log("Creating Stripe checkout session. Origin:", origin);
      
      // Make sure success_url includes the entire path and is properly encoded
      const absoluteSuccessUrl = `${origin}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`;
      console.log("Success URL:", absoluteSuccessUrl);
      
      const sessionParams = {
        customer: customerId,
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: absoluteSuccessUrl,
        cancel_url: `${origin}/checkout?canceled=true`,
        metadata: {
          user_id: user.id,
          paymentMethod: paymentMethod,
        },
        // Allow both test and real cards based on the Stripe API key mode
        payment_method_options: {
          card: {
            statement_descriptor_suffix: 'Izzy Store',
          }
        }
      };
      
      console.log("Stripe session params:", JSON.stringify({
        customer: customerId,
        mode: sessionParams.mode,
        success_url: sessionParams.success_url,
        cancel_url: sessionParams.cancel_url,
        line_items_count: lineItems.length
      }));
      
      const session = await stripe.checkout.sessions.create(sessionParams);
      
      console.log("Stripe session created:", session.id);
      
      // Store pre-order in database - using admin client to bypass RLS
      const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: totalAmount,
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
        throw new Error(`Database error: ${orderError.message}`);
      }
      
      console.log("Order created:", order.id);
      
      // Store order items - using admin client to bypass RLS
      const orderItems = cartItems.map((item: any) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product.price
      }));
      
      const { error: itemsError } = await supabaseAdmin
        .from("order_items")
        .insert(orderItems);
        
      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        throw new Error(`Database error: ${itemsError.message}`);
      }
      
      // Save the order ID to localStorage via response - will be picked up by client
      const responseData = { 
        success: true, 
        url: session.url,
        orderId: order.id,
        sessionId: session.id
      };
      
      console.log("Returning checkout response:", JSON.stringify({
        success: responseData.success,
        orderId: responseData.orderId,
        sessionId: responseData.sessionId,
        hasUrl: !!responseData.url
      }));
      
      return new Response(
        JSON.stringify(responseData),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    } catch (stripeError: any) {
      console.error("Stripe session error:", stripeError);
      return new Response(
        JSON.stringify({ error: `Stripe checkout error: ${stripeError.message}` }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

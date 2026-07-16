import { NextResponse } from "next/server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const PRICE_ID = process.env.STRIPE_PRICE_ID;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function POST() {
  if (!STRIPE_SECRET_KEY || !PRICE_ID) {
    return NextResponse.json(
      { error: "Stripe não configurado. Defina STRIPE_SECRET_KEY e STRIPE_PRICE_ID no .env.local" },
      { status: 500 },
    );
  }

  const Stripe = await import("stripe");
  const stripe = new Stripe.default(STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${BASE_URL}/?premium=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${BASE_URL}/?premium=cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar sessão de pagamento" },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");

  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json({ premium: false, error: "Stripe não configurado" });
  }

  if (!sessionId) {
    return NextResponse.json({ premium: false, error: "session_id ausente" });
  }

  const Stripe = await import("stripe");
  const stripe = new Stripe.default(STRIPE_SECRET_KEY);

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === "paid") {
      return NextResponse.json({ premium: true });
    }

    return NextResponse.json({ premium: false });
  } catch {
    return NextResponse.json({ premium: false, error: "Erro ao verificar sessão" });
  }
}

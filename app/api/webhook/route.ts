import { NextRequest, NextResponse } from "next/server";

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  if (!STRIPE_SECRET_KEY || !WEBHOOK_SECRET) {
    return NextResponse.json(
      {
        error:
          "Webhook não configurado. Defina STRIPE_WEBHOOK_SECRET no .env.local",
      },
      { status: 500 },
    );
  }

  const { default: Stripe } = await import("stripe");
  const stripe = new Stripe(STRIPE_SECRET_KEY);

  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Assinatura ausente" },
      { status: 400 },
    );
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent>;
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    return NextResponse.json(
      { error: `Assinatura inválida: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log(
      `[Stripe Webhook] Pagamento confirmado — email: ${session.customer_details?.email}, session: ${session.id}`,
    );
  }

  return NextResponse.json({ received: true });
}

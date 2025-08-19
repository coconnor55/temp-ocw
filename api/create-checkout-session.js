import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Add STRIPE_SECRET_KEY to Vercel env vars

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId } = req.body;
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: 'your_stripe_price_id', quantity: 1 }], // From Stripe dashboard
      success_url: `${req.headers.origin}/editor?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/`,
      client_reference_id: userId,
    });
    res.status(200).json({ url: session.url });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

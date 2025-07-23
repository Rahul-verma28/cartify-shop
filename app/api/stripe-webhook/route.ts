import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { buffer } from "micro"
import connectDB from "@/lib/db"
import Order from "@/schemas/Order"
import Product from "@/schemas/Product"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's body parser for webhooks
  },
}

export async function POST(req: NextRequest) {
  const buf = await buffer(req)
  const sig = req.headers.get("stripe-signature")

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf, sig!, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  await connectDB()

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session
      const orderId = session.metadata?.orderId

      if (orderId) {
        try {
          const order = await Order.findById(orderId)

          if (order && order.status === "pending") {
            order.status = "paid"
            await order.save()

            // Decrement product inventory
            for (const item of order.items) {
              await Product?.findByIdAndUpdate(item.product, { $inc: { inventory: -item.quantity } })
            }
            console.log(`Order ${orderId} marked as paid and inventory updated.`)
          }
        } catch (error) {
          console.error(`Error processing order ${orderId} from webhook:`, error)
          return NextResponse.json({ error: "Failed to process order" }, { status: 500 })
        }
      }
      break
    // Handle other event types if needed
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}

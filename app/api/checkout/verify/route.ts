import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import connectDB from "@/lib/db"
import Order from "@/schemas/Order"
import Product from "@/schemas/Product"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("session_id")

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
    }

    await connectDB()

    const session = await stripe.checkout.sessions.retrieve(sessionId)

    if (session.payment_status === "paid") {
      const orderId = session.metadata?.orderId

      if (orderId) {
        const order = await Order.findById(orderId)

        if (order && order.status === "pending") {
          order.status = "paid"
          await order.save()

          // Optionally, decrement product inventory
          for (const item of order.items) {
            await Product?.findByIdAndUpdate(item.product, { $inc: { inventory: -item.quantity } })
          }
        }
        return NextResponse.json({ success: true, orderId: orderId })
      }
    }

    return NextResponse.json({ success: false, error: "Payment not successful or order not found" }, { status: 400 })
  } catch (error) {
    console.error("Error verifying checkout session:", error)
    return NextResponse.json({ success: false, error: "Failed to verify payment" }, { status: 500 })
  }
}

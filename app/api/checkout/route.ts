import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import Stripe from "stripe"
import connectDB from "@/lib/mongoDB"
import Order from "@/lib/models/Order"
import { authOptions } from "@/lib/auth"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const { items, shippingAddress, total } = await request.json()

    // Create order in database
    const order = new Order({
      user: session.user.id,
      items,
      total,
      shippingAddress,
      paymentMethod: "stripe",
      status: "pending",
    })

    await order.save()

    // Create Stripe checkout session
    // const stripeSession = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   line_items: items.map((item: any) => ({
    //     price_data: {
    //       currency: "usd",
    //       product_data: {
    //         name: item.product?.title || "Product",
    //       },
    //       unit_amount: Math.round(item.price * 100),
    //     },
    //     quantity: item.quantity,
    //   })),
    //   mode: "payment",
    //   success_url: `${process.env.NEXTAUTH_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: `${process.env.NEXTAUTH_URL}/checkout/cancel`,
    //   metadata: {
    //     orderId: order._id.toString(),
    //   },
    // })

    // Update order with Stripe session ID
    // order.stripeSessionId = stripeSession.id
    // await order.save()

    // return NextResponse.json({ sessionId: stripeSession.id })
    return NextResponse.json({ message: "Order created successfully" })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}

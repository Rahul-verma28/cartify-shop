import mongoose, { Schema, type Document } from "mongoose"

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId
  items: {
    product: mongoose.Types.ObjectId
    quantity: number
    price: number
  }[]
  total: number
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled"
  shippingAddress: {
    fullName: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  paymentMethod: string
  stripeSessionId?: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      fullName: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    stripeSessionId: String,
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)

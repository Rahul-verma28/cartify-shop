import mongoose, { Schema, type Document } from "mongoose"

export interface ICollection extends Document {
  title: string
  slug: string
  description?: string
  image: string
  products: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const CollectionSchema = new Schema<ICollection>(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  },
)

CollectionSchema.index({ title: "text", description: "text" })

export default mongoose.models.Collection || mongoose.model<ICollection>("Collection", CollectionSchema)

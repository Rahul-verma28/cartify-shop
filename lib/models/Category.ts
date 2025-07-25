import mongoose, { Schema, type Document } from "mongoose"

export interface ICategory extends Document {
  title: string
  slug: string
  description?: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
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
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema)

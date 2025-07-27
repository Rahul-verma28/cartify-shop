"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { StarIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid"
import { motion } from "framer-motion"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import type { Review } from "@/lib/types"

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: Readonly<ProductReviewsProps>) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  })
  const [submitting, setSubmitting] = useState(false)

  const getButtonText = () => {
    if (editingReview) {
      return "Update Review";
    }
    return "Submit Review";
  };

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews`)
      const data = await response.json()
      setReviews(data.reviews || [])
    } catch (error) {
      console.error("Error fetching reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast.error("Please sign in to leave a review")
      return
    }

    setSubmitting(true)

    try {
      const method = editingReview ? "PUT" : "POST"
      const body = editingReview 
        ? { reviewId: editingReview._id, ...newReview }
        : newReview

      const response = await fetch(`/api/products/${productId}/reviews`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast.success(editingReview ? "Review updated successfully!" : "Review submitted successfully!")
        setNewReview({ rating: 5, comment: "" })
        setShowReviewForm(false)
        setEditingReview(null)
        fetchReviews()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to submit review")
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Error submitting review")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditReview = (review: Review) => {
    setEditingReview(review)
    setNewReview({
      rating: review?.rating,
      comment: review?.comment,
    })
    setShowReviewForm(true)
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/products/${productId}/reviews?reviewId=${reviewId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Review deleted successfully!")
        fetchReviews()
      } else {
        const data = await response.json()
        toast.error(data.error || "Failed to delete review")
      }
    } catch (error) {
      console.error("Error deleting review:", error)
      toast.error("Error deleting review")
    }
  }

  const handleCancelEdit = () => {
    setEditingReview(null)
    setNewReview({ rating: 5, comment: "" })
    setShowReviewForm(false)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h3>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={`loading-${productId}-${index}`} className="bg-gray-200 dark:bg-gray-800 h-24 rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews ({reviews?.length})</h3>
        {session && (
          <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn-primary">
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleSubmitReview}
          className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingReview ? "Edit Your Review" : "Write Your Review"}
          </h4>

          <div className="mb-4">
            <label htmlFor="rating" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Rating</label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewReview({ ...newReview, rating: star })}
                  className="text-2xl"
                >
                  {star <= newReview.rating ? (
                    <StarSolidIcon className="h-6 w-6 text-yellow-400" />
                  ) : (
                    <StarIcon className="h-6 w-6 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Comment</label>
            <textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              rows={4}
              className="input-field"
              placeholder="Share your experience with this product?..."
              required
            />
          </div>

          <div className="flex space-x-4">
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? "Saving..." : getButtonText()}
            </button>
            <button type="button" onClick={handleCancelEdit} className="btn-secondary">
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews?.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300 text-center py-8">
            No reviews yet. Be the first to review this product!
          </p>
        ) : (
          reviews?.map((review) => (
            <motion.div
              key={review?._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{review?.user?.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-900 dark:text-white">{review?.user?.name}</h5>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {[...Array(5)].map((_, starIndex) => (
                          <StarIcon
                            key={`star-${review?._id}-${starIndex}`}
                            className={`h-4 w-4 ${
                              starIndex < review?.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(review?.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Edit/Delete buttons for own reviews */}
                {session?.user?.id === review?.user?._id && (
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditReview(review)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Review</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this review? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteReview(review?._id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300">{review?.comment}</p>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

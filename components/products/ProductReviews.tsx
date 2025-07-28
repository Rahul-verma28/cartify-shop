// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useSession } from "next-auth/react"
// import { StarIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline"
// import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid"
// import { motion } from "framer-motion"
// import { toast } from "sonner"
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Button } from "@/components/ui/button"
// import type { Review } from "@/lib/types"

// interface ProductReviewsProps {
//   productId: string
// }

// export default function ProductReviews({ productId }: Readonly<ProductReviewsProps>) {
//   const { data: session } = useSession()
//   const [reviews, setReviews] = useState<Review[]>([])
//   const [loading, setLoading] = useState(true)
//   const [showReviewForm, setShowReviewForm] = useState(false)
//   const [editingReview, setEditingReview] = useState<Review | null>(null)
//   const [newReview, setNewReview] = useState({
//     rating: 5,
//     comment: "",
//   })
//   const [submitting, setSubmitting] = useState(false)

//   const getButtonText = () => {
//     if (editingReview) {
//       return "Update Review";
//     }
//     return "Submit Review";
//   };

//   useEffect(() => {
//     fetchReviews()
//   }, [productId])

//   const fetchReviews = async () => {
//     try {
//       const response = await fetch(`/api/products/${productId}/reviews`)
//       const data = await response.json()
//       setReviews(data.reviews || [])
//     } catch (error) {
//       console.error("Error fetching reviews:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleSubmitReview = async (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!session) {
//       toast.error("Please sign in to leave a review")
//       return
//     }

//     setSubmitting(true)

//     try {
//       const method = editingReview ? "PUT" : "POST"
//       const body = editingReview 
//         ? { reviewId: editingReview._id, ...newReview }
//         : newReview

//       const response = await fetch(`/api/products/${productId}/reviews`, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       })

//       if (response.ok) {
//         toast.success(editingReview ? "Review updated successfully!" : "Review submitted successfully!")
//         setNewReview({ rating: 5, comment: "" })
//         setShowReviewForm(false)
//         setEditingReview(null)
//         fetchReviews()
//       } else {
//         const data = await response.json()
//         toast.error(data.error || "Failed to submit review")
//       }
//     } catch (error) {
//       console.error("Error submitting review:", error)
//       toast.error("Error submitting review")
//     } finally {
//       setSubmitting(false)
//     }
//   }

//   const handleEditReview = (review: Review) => {
//     setEditingReview(review)
//     setNewReview({
//       rating: review?.rating,
//       comment: review?.comment,
//     })
//     setShowReviewForm(true)
//   }

//   const handleDeleteReview = async (reviewId: string) => {
//     try {
//       const response = await fetch(`/api/products/${productId}/reviews?reviewId=${reviewId}`, {
//         method: "DELETE",
//       })

//       if (response.ok) {
//         toast.success("Review deleted successfully!")
//         fetchReviews()
//       } else {
//         const data = await response.json()
//         toast.error(data.error || "Failed to delete review")
//       }
//     } catch (error) {
//       console.error("Error deleting review:", error)
//       toast.error("Error deleting review")
//     }
//   }

//   const handleCancelEdit = () => {
//     setEditingReview(null)
//     setNewReview({ rating: 5, comment: "" })
//     setShowReviewForm(false)
//   }

//   if (loading) {
//     return (
//       <div className="space-y-4">
//         <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews</h3>
//         <div className="animate-pulse space-y-4">
//           {[...Array(3)].map((_, index) => (
//             <div key={`loading-${productId}-${index}`} className="bg-gray-200 dark:bg-gray-800 h-24 rounded-lg"></div>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Reviews ({reviews?.length})</h3>
//         {session && (
//           <button onClick={() => setShowReviewForm(!showReviewForm)} className="btn-primary">
//             Write a Review
//           </button>
//         )}
//       </div>

//       {/* Review Form */}
//       {showReviewForm && (
//         <motion.form
//           initial={{ opacity: 0, height: 0 }}
//           animate={{ opacity: 1, height: "auto" }}
//           exit={{ opacity: 0, height: 0 }}
//           onSubmit={handleSubmitReview}
//           className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
//         >
//           <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
//             {editingReview ? "Edit Your Review" : "Write Your Review"}
//           </h4>

//           <div className="mb-4">
//             <label htmlFor="rating" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Rating</label>
//             <div className="flex space-x-1">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   type="button"
//                   onClick={() => setNewReview({ ...newReview, rating: star })}
//                   className="text-2xl"
//                 >
//                   {star <= newReview.rating ? (
//                     <StarSolidIcon className="h-6 w-6 text-yellow-400" />
//                   ) : (
//                     <StarIcon className="h-6 w-6 text-gray-300" />
//                   )}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="mb-4">
//             <label htmlFor="comment" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">Comment</label>
//             <textarea
//               id="comment"
//               value={newReview.comment}
//               onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
//               rows={4}
//               className="input-field"
//               placeholder="Share your experience with this product?..."
//               required
//             />
//           </div>

//           <div className="flex space-x-4">
//             <button type="submit" disabled={submitting} className="btn-primary">
//               {submitting ? "Saving..." : getButtonText()}
//             </button>
//             <button type="button" onClick={handleCancelEdit} className="btn-secondary">
//               Cancel
//             </button>
//           </div>
//         </motion.form>
//       )}

//       {/* Reviews List */}
//       <div className="space-y-4">
//         {reviews?.length === 0 ? (
//           <p className="text-gray-600 dark:text-gray-300 text-center py-8">
//             No reviews yet. Be the first to review this product!
//           </p>
//         ) : (
//           reviews?.map((review) => (
//             <motion.div
//               key={review?._id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700"
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center space-x-4">
//                   <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
//                     <span className="text-white font-semibold">{review?.user?.name.charAt(0).toUpperCase()}</span>
//                   </div>
//                   <div>
//                     <h5 className="font-semibold text-gray-900 dark:text-white">{review?.user?.name}</h5>
//                     <div className="flex items-center space-x-2">
//                       <div className="flex">
//                         {[...Array(5)].map((_, starIndex) => (
//                           <StarIcon
//                             key={`star-${review?._id}-${starIndex}`}
//                             className={`h-4 w-4 ${
//                               starIndex < review?.rating ? "text-yellow-400 fill-current" : "text-gray-300"
//                             }`}
//                           />
//                         ))}
//                       </div>
//                       <span className="text-sm text-gray-600 dark:text-gray-400">
//                         {new Date(review?.createdAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Edit/Delete buttons for own reviews */}
//                 {session?.user?.id === review?.user?._id && (
//                   <div className="flex space-x-2">
//                     <Button
//                       variant="ghost"
//                       size="sm"
//                       onClick={() => handleEditReview(review)}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       <PencilIcon className="h-4 w-4" />
//                     </Button>
//                     <AlertDialog>
//                       <AlertDialogTrigger asChild>
//                         <Button
//                           variant="ghost"
//                           size="sm"
//                           className="text-red-600 hover:text-red-800"
//                         >
//                           <TrashIcon className="h-4 w-4" />
//                         </Button>
//                       </AlertDialogTrigger>
//                       <AlertDialogContent>
//                         <AlertDialogHeader>
//                           <AlertDialogTitle>Delete Review</AlertDialogTitle>
//                           <AlertDialogDescription>
//                             Are you sure you want to delete this review? This action cannot be undone.
//                           </AlertDialogDescription>
//                         </AlertDialogHeader>
//                         <AlertDialogFooter>
//                           <AlertDialogCancel>Cancel</AlertDialogCancel>
//                           <AlertDialogAction
//                             onClick={() => handleDeleteReview(review?._id)}
//                             className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//                           >
//                             Delete
//                           </AlertDialogAction>
//                         </AlertDialogFooter>
//                       </AlertDialogContent>
//                     </AlertDialog>
//                   </div>
//                 )}
//               </div>
//               <p className="text-gray-700 dark:text-gray-300">{review?.comment}</p>
//             </motion.div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }






"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Star, ThumbsUp, ThumbsDown, Flag, User, Calendar, CheckCircle, PencilIcon, TrashIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import type { Review } from "@/lib/types"

interface ProductReviewsProps {
  productId: string
}

// Rating Stars Component
function RatingStars({ rating, size = "md" }: { rating: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`${sizeClasses[size]} ${
            index < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      ))}
    </div>
  )
}

export default function ProductReviews({ productId }: Readonly<ProductReviewsProps>) {
  const { data: session } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState("newest")

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => Math.floor(review.rating) === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter((review) => Math.floor(review.rating) === rating).length / reviews.length) * 100
      : 0,
  }))

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      console.log("Fetching reviews for productId:", productId) // Debug log
      const response = await fetch(`/api/products/${productId}/reviews`)
      
      if (!response.ok) {
        console.error("Response not ok:", response.status, response.statusText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("Fetched reviews data:", data) // Debug log
      setReviews(data.reviews || [])
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast.error("Failed to load reviews")
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

    if (newReview.rating === 0) {
      toast.error("Please select a rating")
      return
    }

    if (!newReview.comment.trim()) {
      toast.error("Please write a comment")
      return
    }

    setSubmitting(true)

    try {
      const method = editingReview ? "PUT" : "POST"
      const body = editingReview 
        ? { reviewId: editingReview._id, ...newReview }
        : newReview

      console.log("Submitting review:", { method, body, productId }) // Debug log

      const response = await fetch(`/api/products/${productId}/reviews`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      console.log("Submit response:", data) // Debug log

      if (response.ok) {
        toast.success(editingReview ? "Review updated successfully!" : "Review submitted successfully!")
        setNewReview({ rating: 0, comment: "" })
        setShowReviewForm(false)
        setEditingReview(null)
        await fetchReviews() // Refresh reviews
      } else {
        console.error("Submit error:", data)
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
      rating: review?.rating || 5,
      comment: review?.comment || "",
    })
    setShowReviewForm(true)
  }

  const handleDeleteReview = async (reviewId: string) => {
    if (!reviewId) {
      toast.error("Invalid review ID")
      return
    }

    try {
      console.log("Deleting review:", reviewId) // Debug log
      const response = await fetch(`/api/products/${productId}/reviews?reviewId=${reviewId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Review deleted successfully!")
        await fetchReviews() // Refresh reviews
      } else {
        const data = await response.json()
        console.error("Delete error:", data)
        toast.error(data.error || "Failed to delete review")
      }
    } catch (error) {
      console.error("Error deleting review:", error)
      toast.error("Error deleting review")
    }
  }

  const handleCancelEdit = () => {
    setEditingReview(null)
    setNewReview({ rating: 0, comment: "" })
    setShowReviewForm(false)
  }

  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={`loading-${productId}-${index}`} className="bg-gray-200 dark:bg-gray-800 h-24 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  // Fix the user avatar display
  const getUserInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : "U"
  }

  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        {/* Reviews Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>

          {/* Rating Summary */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Overall Rating */}
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <span className="text-4xl font-bold mr-4">{averageRating.toFixed(1)}</span>
                    <div>
                      <RatingStars rating={averageRating} size="lg" />
                      <p className="text-sm text-muted-foreground mt-1">Based on {reviews.length} reviews</p>
                    </div>
                  </div>
                </div>

                {/* Rating Distribution */}
                <div className="space-y-2">
                  {ratingDistribution.map(({ rating, count, percentage }) => (
                    <div key={rating} className="flex items-center space-x-3">
                      <span className="text-sm w-8">{rating} ★</span>
                      <Progress value={percentage} className="flex-1 h-2" />
                      <span className="text-sm text-muted-foreground w-8">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {editingReview ? "Edit Review" : "Write a Review"}
              </Button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-background"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Review Form */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    {editingReview ? "Edit Your Review" : "Write Your Review"}
                  </h3>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Rating Input */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Rating</label>
                      <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button 
                            key={rating} 
                            type="button"
                            onClick={() => setNewReview({ ...newReview, rating })} 
                            className="p-1"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                rating <= newReview.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Comment Input */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Review</label>
                      <Textarea
                        placeholder="Share your experience with this product..."
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        rows={4}
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center space-x-3">
                      <Button
                        type="submit"
                        disabled={submitting || newReview.rating === 0 || newReview.comment.trim() === ""}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {submitting ? "Saving..." : (editingReview ? "Update Review" : "Submit Review")}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline" 
                        onClick={() => {
                          setShowReviewForm(false)
                          setEditingReview(null)
                          setNewReview({ rating: 0, comment: "" })
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
              <p className="text-muted-foreground mb-6">Be the first to share your experience with this product.</p>
              <Button
                onClick={() => setShowReviewForm(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Write the First Review
              </Button>
            </motion.div>
          ) : (
            reviews?.map((review, index) => (
              <motion.div
                key={review?._id || `review-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-blue-500 text-white">
                          {getUserInitials(review?.user?.name || "User")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        {/* Review Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-semibold">{review?.user?.name || "Anonymous User"}</h4>
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified Purchase
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(review?.createdAt || new Date()).toLocaleDateString()}</span>
                          </div>
                        </div>

                        {/* Rating */}
                        <div className="mb-3">
                          <RatingStars rating={review?.rating || 0} size="sm" />
                        </div>

                        {/* Review Content */}
                        <p className="text-muted-foreground mb-4 leading-relaxed">{review?.comment}</p>

                        {/* Review Actions */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              Helpful
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              Not Helpful
                            </Button>
                            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                              <Flag className="w-4 h-4 mr-2" />
                              Report
                            </Button>
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
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Load More Reviews */}
        {reviews.length > 5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-center mt-8"
          >
            <Button variant="outline" size="lg">
              Load More Reviews
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}

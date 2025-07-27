"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Trash, Star, Search, MessageSquare, AlertTriangle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { toast } from "sonner"
import type { Review } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null)
  const reviewsPerPage = 10

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/admin/reviews")
      const data = await response.json()
      setReviews(data.reviews || [])
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast.error("Failed to fetch reviews")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setReviews(reviews?.filter((r) => r._id !== reviewId))
        toast.success("Review deleted successfully")
      } else {
        toast.error("Failed to delete review")
      }
    } catch (error) {
      toast.error("Error deleting review")
    } finally {
      setReviewToDelete(null)
    }
  }

  const filteredReviews = reviews?.filter((review) => {
    const matchesSearch =
      review?.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review?.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review?.product?.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Calculate review stats
  const totalReviews = filteredReviews.length
  const averageRating = filteredReviews.length 
    ? (filteredReviews.reduce((sum, review) => sum + review?.rating, 0) / filteredReviews.length).toFixed(1)
    : "0.0"
  const fiveStarReviews = filteredReviews.filter(review => review?.rating === 5).length
  const criticalReviews = filteredReviews.filter(review => review?.rating <= 2).length

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview)
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage)

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-lg" />
          ))}
        </div>
        
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 }
    }
  }

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring" as "spring", stiffness: 100, damping: 15 }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    }
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Product Reviews</h1>
        <p className="text-gray-600 dark:text-gray-400">Moderate and manage customer feedback</p>
      </motion.div>

      {/* Review Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reviews</p>
                  <h3 className="text-2xl font-bold">{totalReviews}</h3>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                  <h3 className="text-2xl font-bold flex items-center">
                    {averageRating} <Star className="h-5 w-5 ml-1 text-yellow-400 fill-yellow-400" />
                  </h3>
                </div>
                <div className="p-2 bg-yellow-500/10 rounded-full">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">5-Star Reviews</p>
                  <h3 className="text-2xl font-bold">{fiveStarReviews}</h3>
                </div>
                <div className="p-2 bg-green-500/10 rounded-full">
                  <Star className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Reviews</p>
                  <h3 className="text-2xl font-bold">{criticalReviews}</h3>
                </div>
                <div className="p-2 bg-red-500/10 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="flex items-center py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 w-full"
          />
        </div>
      </motion.div>

      {/* Reviews Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="w-[300px]">Comment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <AnimatePresence>
                <motion.tbody
                  variants={tableVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {currentReviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No reviews found
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentReviews.map((review) => (
                      <motion.tr
                        key={review?._id}
                        variants={rowVariants}
                        exit="exit"
                        className="group"
                        layout
                      >
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-800">
                              <Image
                                src={review?.product?.images[0] || "/placeholder.svg"}
                                alt={review?.product?.title || "Product"}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="ml-3 font-medium truncate max-w-[150px]">
                              <Link href={`/products/${review?.product?.slug}`} className="hover:text-primary">
                                {review?.product?.title || "Unknown Product"}
                              </Link>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell className="font-medium">
                          {review?.user?.name || "Anonymous"}
                        </TableCell>
                        
                        <TableCell>
                          {renderStars(review?.rating)}
                        </TableCell>
                        
                        <TableCell className="max-w-[300px]">
                          <p className="text-muted-foreground truncate" title={review?.comment}>
                            {review?.comment}
                          </p>
                        </TableCell>
                        
                        <TableCell className="text-muted-foreground">
                          {new Date(review?.createdAt).toLocaleDateString()}
                        </TableCell>
                        
                        <TableCell>
                          <AlertDialog open={reviewToDelete === review?._id} onOpenChange={(open) => !open && setReviewToDelete(null)}>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-950"
                                onClick={() => setReviewToDelete(review?._id)}
                              >
                                <Trash className="h-4 w-4" />
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
                                  className="bg-red-600 text-white hover:bg-red-700"
                                  onClick={() => reviewToDelete && handleDeleteReview(reviewToDelete)}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </motion.tbody>
              </AnimatePresence>
            </Table>
          </div>

          {/* Pagination with animation */}
          <AnimatePresence>
            {filteredReviews.length > 0 && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="py-4 px-6 border-t border-gray-200 dark:border-gray-700"
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                      />
                    </PaginationItem>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setCurrentPage(pageNum)}
                            isActive={currentPage === pageNum}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                          <PaginationLink
                            onClick={() => setCurrentPage(totalPages)}
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      </>
                    )}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} 
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  )
}

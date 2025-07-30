"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EmailSentForPasswordReset() {
  const router = useRouter()

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Password Reset Email Sent</CardTitle>
          <CardDescription className="text-center">We&apos;ve sent a password reset link to your email</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Mail className="w-16 h-16 text-blue-500 mb-4" />
          <p className="text-center mb-4">
            Please check your email and click on the password reset link to set a new password.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/auth/signin")}>Back to Signin</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
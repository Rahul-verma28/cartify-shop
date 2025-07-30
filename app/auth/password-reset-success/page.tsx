"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";

export default function PasswordResetSuccess() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => router.push("/auth/signin"), 10000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-950">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
        />
        <Card className=" w-[400px] shadow-xl border-0">
          <CardHeader className="pb-2">
            <div className="flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4 animate-bounce" />
              <CardTitle className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300">
                Password Reset Successful
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-400">
                Your password has been successfully reset
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <Alert className="mt-2 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
              <AlertDescription className="text-green-800 dark:text-green-200">
                Your password has been changed. You can now log in with your new
                password.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-gray-500 mt-6 text-center">
              You will be redirected to the signin page in{" "}
              <span className="font-semibold text-blue-600">10 seconds</span>...
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={() => router.push("/auth/signin")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              size="lg"
            >
              Go to Signin
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

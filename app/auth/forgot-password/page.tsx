"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MailCheck } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ForgetPassword() {
  const [email, setEmail] = useState<string>("");
  const [pending, setPending] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);

    if (!email || email === "") {
      toast.error("Please enter your email");
      setPending(false);
      return;
    }

    try {
      const res = await axios.post("/api/forget_password", { email });

      if (res.status === 200) {
        router.push("/auth/password-reset-email-sent");
        return;
      }
    } catch (error) {
      let msg = "Something went wrong";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.error || msg;
      }
      toast.error(msg);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br dark:from-gray-900 dark:to-blue-950">
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
        <Card className="w-[400px] shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-blue-700 dark:text-blue-300">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email to reset your password
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  autoComplete="email"
                />
              </div>
            </CardContent>
            <CardFooter className="mt-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                disabled={pending}
                size="lg"
              >
                {pending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Sending...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}

"use client";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs";
import { type OAuthStrategy } from "@clerk/types";

const floatAnimation = `
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
`;
const LoginUi = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useSignIn();
  const signInWith = (strategy: OAuthStrategy) => {
    return signIn?.authenticateWithRedirect({
      strategy,
      redirectUrl: "/sign-up/sso-callback",
      redirectUrlComplete: "/",
    });
  };
  return (
    <>
      <style jsx>{floatAnimation}</style>
      <div className="flex min-h-screen w-full">
        <div className="flex flex-1 items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-[440px] space-y-8">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="animate-float h-8 w-8 rounded-full bg-blue-600" />
                <span className="text-xl font-semibold">Saas kit</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  Log in to your Account
                </h1>
                <p className="text-gray-500">
                  Welcome back! Select method to log in:
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              <Button
                variant="outline"
                className="h-12"
                onClick={() => signInWith("oauth_google")}
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="h-12">
                <svg
                  className="mr-2 h-5 w-5 text-[#1877F2]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9.945 22v-8.834H7V9.485h2.945V6.54c0-3.043 1.926-4.54 4.64-4.54 1.3 0 2.418.097 2.744.14v3.18h-1.883c-1.476 0-1.82.703-1.82 1.732v2.433h3.68l-.736 3.68h-2.944L13.685 22" />
                </svg>
                Facebook
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  or continue with email
                </span>
              </div>
            </div>
            <form className="space-y-4">
              <div className="space-y-2">
                <Input
                  className="h-12"
                  id="email"
                  placeholder="Email"
                  type="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    className="h-12 pr-10"
                    id="password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    required
                  />
                  <Button
                    className="absolute right-0 top-0 h-12 w-12 px-0"
                    type="button"
                    variant="ghost"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  className="text-sm text-blue-600 hover:text-blue-500"
                  href="#"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button
                className="h-12 w-full bg-blue-600 hover:bg-blue-500"
                type="submit"
              >
                Log in
              </Button>
            </form>
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link className="text-blue-600 hover:text-blue-500" href="#">
                Create an account
              </Link>
            </div>
          </div>
        </div>
        <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-blue-600 p-12 text-white lg:flex">
          <div className="z-10 max-w-lg space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">
                Connect with every application.
              </h2>
              <p className="text-xl text-white/80">
                Everything you need in an easily customizable dashboard.
              </p>
            </div>
            <div className="flex gap-2">
              <div className="h-3 w-3 rounded-full bg-white" />
              <div className="h-3 w-3 rounded-full bg-white/30" />
              <div className="h-3 w-3 rounded-full bg-white/30" />
            </div>
          </div>
          {/* Abstract UI with emojis */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="grid grid-cols-4 gap-8 text-6xl opacity-20">
              {[
                "🚀",
                "💡",
                "🎨",
                "🔧",
                "📊",
                "🔍",
                "🏆",
                "💼",
                "📱",
                "💻",
                "🌐",
                "📈",
                "🔔",
                "📅",
                "📁",
                "🔐",
              ].map((emoji, index) => (
                <div
                  key={index}
                  className="animate-float"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {emoji}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginUi;

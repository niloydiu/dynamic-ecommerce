"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSignIn } from "../hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export function SignInForm() {
  const router = useRouter()
  const { signIn } = useSignIn()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const result = await signIn({ email, password })

    if (!result.success) {
      setError(result.error?.message || "Failed to sign in")
      setIsLoading(false)
      return
    }

    // Redirect to home or intended page
    router.push("/")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      {error && <ErrorAlert title="Sign In Failed" message={error} onDismiss={() => setError(null)} />}

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
          autoComplete="current-password"
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link href="/auth/sign-up" className="text-primary hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </form>
  )
}

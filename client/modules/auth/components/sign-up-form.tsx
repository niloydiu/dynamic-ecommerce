"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSignUp } from "../hooks"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ErrorAlert } from "@/components/ui/error-alert"
import { Loader2 } from "lucide-react"
import Link from "next/link"

export function SignUpForm() {
  const router = useRouter()
  const { signUp } = useSignUp()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Client-side validation
    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    const result = await signUp(formData)

    if (!result.success) {
      setError(result.error?.message || "Failed to create account")
      setIsLoading(false)
      return
    }

    // Redirect to home or intended page
    router.push("/")
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-sm">
      {error && <ErrorAlert title="Sign Up Failed" message={error} onDismiss={() => setError(null)} />}

      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isLoading}
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={isLoading}
          autoComplete="new-password"
          minLength={8}
        />
        <p className="text-xs text-muted-foreground">At least 8 characters</p>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label htmlFor="passwordConfirm">Confirm Password</Label>
        <Input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          placeholder="••••••••"
          value={formData.passwordConfirm}
          onChange={handleChange}
          required
          disabled={isLoading}
          autoComplete="new-password"
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      {/* Sign In Link */}
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/sign-in" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </p>
    </form>
  )
}

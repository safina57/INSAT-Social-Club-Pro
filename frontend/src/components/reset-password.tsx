"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Eye, EyeOff, Loader2, Check, AlertCircle } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { cn } from "../lib/utils"
import Aurora from "./ui/Aurora"

export default function ResetPassword() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [token, setToken] = useState("")
  const [generalError, setGeneralError] = useState("")
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [formErrors, setFormErrors] = useState({
    password: "",
    confirmPassword: "",
    token: "",
  })
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search)
    const resetToken = urlParams.get("token") || ""

    if (!resetToken) {
      setFormErrors((prev) => ({ ...prev, token: "Invalid reset link. No token found." }))
    } else {
      setToken(resetToken)
    }
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }

    // Clear general error when typing
    if (generalError) {
      setGeneralError("")
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...formErrors }

    if (!token) {
      newErrors.token = "Invalid reset link"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
      valid = false
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      valid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    setFormErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setGeneralError("")

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL
      const response = await fetch(`${backendUrl}/auth/reset-password?token=${encodeURIComponent(token)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: formData.password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (data.code === "INVALID_TOKEN") {
          setFormErrors((prev) => ({ ...prev, token: "Invalid or expired token" }))
        } else if (data.code === "TOKEN_EXPIRED") {
          setFormErrors((prev) => ({ ...prev, token: "This reset link has expired. Please request a new one." }))
        } else if (data.code === "WEAK_PASSWORD") {
          setFormErrors((prev) => ({ ...prev, password: "Password is too weak. Please use a stronger password." }))
        } else {
          setGeneralError(data.message || "Failed to reset password")
        }
        throw new Error(data.message || "Failed to reset password")
      }

      setIsSuccess(true)
    } catch (error) {
      console.error("Reset password failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen w-full flex-col auth-gradient">
        <div className="absolute inset-0 -z-10">
          <Aurora colorStops={["#00FFB2", "#00C9FF", "#007C91", "#003B49"]} blend={0.5} amplitude={0.5} speed={0.25} />
        </div>

        <div className="container flex flex-col items-center justify-center px-4 py-10 md:h-screen md:px-0">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
            <div className="flex flex-col items-center space-y-6 text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-green-500/20 animate-pulse"></div>
                <Check className="h-16 w-16 text-green-500 relative z-10" />
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-white">Password reset successfully!</h1>

              <p className="text-sm leading-relaxed text-green-200">
                Your password has been updated. You can now sign in with your new password.
              </p>
            </div>

            <div className="grid gap-4">
              <Button
                onClick={() => (window.location.href = "/signin")}
                className="h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:translate-y-[-2px]"
              >
                <Check className="mr-2 h-4 w-4" />
                Go to Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col auth-gradient">
      <div className="absolute inset-0 -z-10">
        <Aurora colorStops={["#00FFB2", "#00C9FF", "#007C91", "#003B49"]} blend={0.5} amplitude={0.5} speed={0.25} />
      </div>

      <div className="container flex flex-col items-center justify-center px-4 py-10 md:h-screen md:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">Reset your password</h1>
            <p className="text-sm text-muted-foreground">Enter your new password below</p>
          </div>

          {/* Token error message */}
          {formErrors.token && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-200">{formErrors.token}</p>
            </div>
          )}

          {/* General error message */}
          {generalError && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-200">{generalError}</p>
            </div>
          )}

          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password" className="text-sm font-medium text-white">
                    New Password
                  </Label>
                  <div className="relative glow-effect">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      className={cn(
                        "input-transition h-11 bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10 text-white pr-10 placeholder:text-muted-foreground/70",
                        formErrors.password && "border-red-500",
                      )}
                      placeholder="Enter your new password"
                      disabled={!!formErrors.token}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={!!formErrors.token}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                  {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                    Confirm New Password
                  </Label>
                  <div className="relative glow-effect">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={cn(
                        "input-transition h-11 bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10 text-white pr-10 placeholder:text-muted-foreground/70",
                        formErrors.confirmPassword && "border-red-500",
                      )}
                      placeholder="Confirm your new password"
                      disabled={!!formErrors.token}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={!!formErrors.token}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                  {formErrors.confirmPassword && <p className="text-xs text-red-500">{formErrors.confirmPassword}</p>}
                </div>

                <Button
                  type="submit"
                  className="h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:translate-y-[-2px]"
                  disabled={isLoading || !!formErrors.token}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                  Reset Password
                </Button>
              </div>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">Remember your password?</span>
              </div>
            </div>

            <a
              href="/signin"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-secondary/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

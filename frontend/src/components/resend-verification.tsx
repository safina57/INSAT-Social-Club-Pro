"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ArrowLeft, Mail, Loader2, Check, AlertCircle } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { cn } from "../lib/utils"
import Aurora from "./ui/Aurora"

export default function ResendVerification() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [generalError, setGeneralError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState("")

  // Check if email was passed in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const emailParam = urlParams.get("email")

    if (emailParam) {
      setEmail(emailParam)
      // Clean up the URL without refreshing the page
      window.history.replaceState({}, document.title, window.location.pathname)
    }
  }, [])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (emailError) {
      setEmailError("")
    }
    if (generalError) {
      setGeneralError("")
    }
  }

  const validateEmail = () => {
    if (!email) {
      setEmailError("Email is required")
      return false
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateEmail()) return

    setIsLoading(true)
    setGeneralError("")

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL
      const response = await fetch(`${backendUrl}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (data.code === "EMAIL_NOT_FOUND") {
          setEmailError("No account found with this email address")
        } else if (data.code === "EMAIL_ALREADY_VERIFIED") {
          setGeneralError("This email is already verified. Please sign in.")
        } else if (data.code === "RATE_LIMITED") {
          setGeneralError("Too many requests. Please try again later.")
        } else {
          setGeneralError(data.message || "Failed to send verification email")
        }
        throw new Error(data.message || "Failed to send verification email")
      }

      setIsSuccess(true)
      setMessage(data.message || "Verification email sent successfully!")
    } catch (error) {
      console.error("Resend verification failed:", error)
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

              <h1 className="text-3xl font-bold tracking-tight text-white">Email sent successfully!</h1>

              <p className="text-sm leading-relaxed text-green-200">
                {message} Please check your inbox and follow the verification link.
              </p>
            </div>

            <div className="grid gap-4">
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

  return (
    <div className="flex min-h-screen w-full flex-col auth-gradient">
      <div className="absolute inset-0 -z-10">
        <Aurora colorStops={["#00FFB2", "#00C9FF", "#007C91", "#003B49"]} blend={0.5} amplitude={0.5} speed={0.25} />
      </div>

      <div className="container flex flex-col items-center justify-center px-4 py-10 md:h-screen md:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">Resend verification email</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a new verification link
            </p>
          </div>

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
                  <Label htmlFor="email" className="text-sm font-medium text-white">
                    Email
                  </Label>
                  <div className="relative glow-effect">
                    <Input
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      value={email}
                      onChange={handleEmailChange}
                      className={cn(
                        "input-transition h-11 bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10 text-white placeholder:text-muted-foreground/70",
                        emailError && "border-red-500",
                      )}
                    />
                  </div>
                  {emailError && <p className="text-xs text-red-500">{emailError}</p>}
                </div>

                <Button
                  type="submit"
                  className="h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:translate-y-[-2px]"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
                  Send verification email
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

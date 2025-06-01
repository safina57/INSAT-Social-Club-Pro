"use client"
import { useState, useEffect, useRef } from "react"
import { Check, X, Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Aurora from "@/components/ui/Aurora"

type VerificationStatus = "loading" | "success" | "error"

export default function EmailVerification() {
  const [status, setStatus] = useState<VerificationStatus>("loading")
  const [message, setMessage] = useState("")
  const [countdown, setCountdown] = useState(5)


  const hasVerifiedRef = useRef(false)
  useEffect(() => {
    if (hasVerifiedRef.current) return 
    hasVerifiedRef.current = true 

    const verifyEmail = async () => {
      try {
        // Extract token from URL
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get("token")

        if (!token) {
          setStatus("error")
          setMessage("Invalid verification link. No token found.")
          return
        }

        // Send verification request to backend
        const backendUrl = import.meta.env.VITE_BACKEND_URL
        console.log("Verifying email with token:", token)
        const response = await fetch(`${backendUrl}/auth/verify-email?token=${encodeURIComponent(token)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        console.log("Verification response:", response)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || "Verification failed")
        }

        const data = await response.json()
        setStatus("success")
        setMessage(data.message || "Email verified successfully!")
      } catch (error) {
        console.error("Verification failed:", error)
        setStatus("error")
        setMessage(error instanceof Error ? error.message : "Verification failed. Please try again.")
      }
    }

    verifyEmail()
  }, [])

  // Countdown and redirect for success
  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (status === "success" && countdown === 0) {
      window.location.href = "/signin"
    }
  }, [status, countdown])

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-16 w-16 animate-spin text-primary" />
      case "success":
        return (
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-pulse"></div>
            <Check className="h-16 w-16 text-green-500 relative z-10" />
          </div>
        )
      case "error":
        return (
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse"></div>
            <X className="h-16 w-16 text-red-500 relative z-10" />
          </div>
        )
    }
  }

  const getStatusTitle = () => {
    switch (status) {
      case "loading":
        return "Verifying your email..."
      case "success":
        return "Email verified successfully!"
      case "error":
        return "Verification failed"
    }
  }

  const getStatusMessage = () => {
    switch (status) {
      case "loading":
        return "Please wait while we verify your email address."
      case "success":
        return `${message} You will be redirected to the login page in ${countdown} seconds.`
      case "error":
        return message
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col auth-gradient">
      {/* Aurora background (behind everything) */}
      <div className="absolute inset-0 -z-10">
        <Aurora colorStops={["#00FFB2", "#00C9FF", "#007C91", "#003B49"]} blend={0.5} amplitude={0.5} speed={0.25} />
      </div>

      <div className="container flex flex-col items-center justify-center px-4 py-10 md:h-screen md:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col items-center space-y-6 text-center">
            {/* Status Icon */}
            <div className="flex items-center justify-center">{getStatusIcon()}</div>

            {/* Title */}
            <h1 className="text-3xl font-bold tracking-tight text-white">{getStatusTitle()}</h1>

            {/* Message */}
            <div className="space-y-4">
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  status === "success"
                    ? "text-green-200"
                    : status === "error"
                      ? "text-red-200"
                      : "text-muted-foreground",
                )}
              >
                {getStatusMessage()}
              </p>

              {/* Progress bar for success countdown */}
              {status === "success" && (
                <div className="w-full bg-secondary/30 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid gap-4">
            {status === "error" && (
              <Button
                onClick={() => window.location.href = "/send-verification-email"}
                className="h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:translate-y-[-2px]"
              >
                <Loader2 className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            )}

            {status === "success" && (
              <Button
                onClick={() => (window.location.href = "/signin")}
                className="h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:translate-y-[-2px]"
              >
                <Check className="mr-2 h-4 w-4" />
                Go to Login Now
              </Button>
            )}

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

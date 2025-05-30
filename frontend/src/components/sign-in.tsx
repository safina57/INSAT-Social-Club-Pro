"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import Aurora from "@/components/ui/Aurora"

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...formErrors }

    if (!formData.email) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    }

    setFormErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // Here you would normally authenticate with your backend
      console.log("Sign in successful", formData)
      // Redirect or show success message
    } catch (error) {
      console.error("Sign in failed", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col auth-gradient">
    {/* Aurora background (behind everything) */}
    <div className="absolute inset-0 -z-10">
      <Aurora
        colorStops={["#00FFB2", "#00C9FF", "#007C91", "#003B49"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.25}
      />
    </div>
      <div className="container flex flex-col items-center justify-center px-4 py-10 md:h-screen md:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">Welcome back</h1>
            <p className="text-sm text-muted-foreground">Sign in to your INSAT PRO CLUB account</p>
          </div>
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
                      value={formData.email}
                      onChange={handleChange}
                      className={cn(
                        "input-transition h-11 bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10 text-white placeholder:text-muted-foreground/70",
                        formErrors.email && "border-red-500",
                      )}
                    />
                  </div>
                  {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium text-white">
                      Password
                    </Label>
                    <a
                      href="/forgot-password"
                      className="text-xs text-primary hover:text-primary/90 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
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
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                  {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
                </div>
                <Button
                  type="submit"
                  className="h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:translate-y-[-2px]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowRight className="mr-2 h-4 w-4" />
                  )}
                  Sign In
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">New to INSAT PRO CLUB?</span>
              </div>
            </div>
            <a
              href="/signup"
              className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-secondary/50 backdrop-blur-sm px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-secondary/70 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
            >
              Create an account
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

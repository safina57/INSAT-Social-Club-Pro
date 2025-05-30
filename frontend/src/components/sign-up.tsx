"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, Check, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import Aurora from "@/components/ui/Aurora"

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear errors when typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, terms: checked }))
    if (checked) {
      setFormErrors((prev) => ({ ...prev, terms: "" }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...formErrors }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      valid = false
    }

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

    if (!formData.terms) {
      newErrors.terms = "You must agree to the terms and conditions"
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
      // Here you would normally register with your backend
      console.log("Sign up successful", formData)
      // Redirect or show success message
    } catch (error) {
      console.error("Sign up failed", error)
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
            amplitude={0.5}
            speed={0.25}
          />
        </div>
      <div className="container flex flex-col items-center justify-center px-4 py-10 md:h-screen md:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">Create an account</h1>
            <p className="text-sm text-muted-foreground">Join the exclusive INSAT PRO CLUB network</p>
          </div>
          <div className="grid gap-6">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-sm font-medium text-white">
                    Full Name
                  </Label>
                  <div className="relative glow-effect">
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      type="text"
                      autoCapitalize="words"
                      autoComplete="name"
                      autoCorrect="off"
                      value={formData.name}
                      onChange={handleChange}
                      className={cn(
                        "input-transition h-11 bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10 text-white placeholder:text-muted-foreground/70",
                        formErrors.name && "border-red-500",
                      )}
                    />
                  </div>
                  {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
                </div>
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
                  <Label htmlFor="password" className="text-sm font-medium text-white">
                    Password
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
                <div className="grid gap-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                    Confirm Password
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
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-white"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                  {formErrors.confirmPassword && <p className="text-xs text-red-500">{formErrors.confirmPassword}</p>}
                </div>
                <div className="flex items-start space-x-2 pt-2">
                  <Checkbox
                    id="terms"
                    checked={formData.terms}
                    onCheckedChange={handleCheckboxChange}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:text-primary/90 transition-colors">
                        terms of service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:text-primary/90 transition-colors">
                        privacy policy
                      </a>
                    </label>
                    {formErrors.terms && <p className="text-xs text-red-500">{formErrors.terms}</p>}
                  </div>
                </div>
                <Button
                  type="submit"
                  className="h-11 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:translate-y-[-2px]"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                  Create Account
                </Button>
              </div>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">Already have an account?</span>
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

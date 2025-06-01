"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { cn } from "../lib/utils";
import Aurora from "./ui/Aurora";
import { useAppDispatch } from "../state/store";
import { setUser } from "../state";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({
    email: "",
    password: "",
  });
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { login } = useAuth();
  // Check for verification notification from signup
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verificationSent = urlParams.get("verification_sent");
    const email = urlParams.get("email");

    if (verificationSent === "true" && email) {
      setSuccessMessage(
        `A verification email has been sent to ${email}. Please check your inbox and verify your email before signing in.`
      );
      // Pre-fill the email field
      setFormData((prev) => ({ ...prev, email }));

      // Clean up the URL without refreshing the page
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear errors when typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear general error when typing
    if (generalError) {
      setGeneralError("");
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setGeneralError("");

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle specific error cases
        if (data.message && data.message.toLowerCase().includes("verified")) {
          window.location.href = "/send-verification-email";
          return;
        } else {
          setGeneralError(data.message || "Login failed. Please try again.");
        }
        throw new Error(data.message || "Login failed");
      }

      await login(data.access_token);

      var isAdmin = false;
      // Fetch current user data and set it in Redux
      try {
        const userResponse = await fetch(`${backendUrl}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.access_token}`,
          },
          body: JSON.stringify({
            query: `
              query Currentuser {
                currentuser {
                  id
                  username
                  email
                  role
                }
              }
            `,
          }),
        });

        const userData = await userResponse.json();

        if (userData.data?.currentuser) {
          // Set user data in Redux
          dispatch(setUser(userData.data.currentuser));
          if (userData.data.currentuser.role === "ADMIN") {
            isAdmin = true;
          }
        }
      } catch (userError) {
        console.error("Failed to fetch user data:", userError);
        // Still proceed to home page even if user fetch fails
      }

      // Redirect to home page
      console.log(isAdmin);
      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/home");
      }
    } catch (error) {
      console.error("Sign in failed", error);
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your INSAT PRO CLUB account
            </p>
          </div>

          {/* Success message */}
          {successMessage && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-md flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <p className="text-sm text-green-200">{successMessage}</p>
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
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-white"
                  >
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
                        formErrors.email && "border-red-500"
                      )}
                    />
                  </div>
                  {formErrors.email && (
                    <p className="text-xs text-red-500">{formErrors.email}</p>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-white"
                    >
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
                        formErrors.password && "border-red-500"
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-11 w-11 text-muted-foreground hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                  </div>
                  {formErrors.password && (
                    <p className="text-xs text-red-500">
                      {formErrors.password}
                    </p>
                  )}
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
                <span className="bg-background px-2 text-muted-foreground">
                  New to INSAT PRO CLUB?
                </span>
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
  );
}

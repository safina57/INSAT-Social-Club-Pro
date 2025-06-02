import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Building2, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Header } from "@/components/common/header";
import { CREATE_COMPANY } from "@/graphql/queries/company";

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Company name must be at least 2 characters.",
    })
    .max(100, {
      message: "Company name must not exceed 100 characters.",
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(1000, {
      message: "Description must not exceed 1000 characters.",
    }),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateCompanyPage() {
  const navigate = useNavigate();
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/signin");
      return;
    }
    setUserToken(token);
  }, [navigate]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
    },
  });

  const [createCompany, { loading }] = useMutation(CREATE_COMPANY, {
    context: {
      headers: {
        Authorization: userToken ? `Bearer ${userToken}` : "",
      },
    },
    onCompleted: (data) => {
      setIsSuccess(true);
      toast.success("Company created successfully!", {
        description: `${data.createCompany.name} has been created.`,
      });

      // Redirect to company detail page after a short delay
      setTimeout(() => {
        navigate(`/companies/${data.createCompany.id}`);
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error creating company", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await createCompany({
        variables: {
          input: {
            name: values.name,
            description: values.description,
            website: values.website || undefined,
          },
        },
      });
    } catch (error) {
      console.error("Create company error:", error);
    }
  }

  if (!userToken) {
    return (
      <div className="min-h-screen w-full aurora-gradient">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">
            Please sign in to create a company.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full aurora-gradient">
      <Header />
      <div className="container mx-auto px-4 py-8 content-z-index">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/companies")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Companies
          </Button>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-background/40 backdrop-blur-md border-white/10">
                  <CardContent className="p-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      Company Created Successfully!
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Your company has been created and you've been added as an
                      admin. Redirecting to company page...
                    </p>
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm text-muted-foreground">
                        Redirecting...
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-background/40 backdrop-blur-md border-white/10">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">
                          Create New Company
                        </CardTitle>
                        <CardDescription>
                          Add your company to the INSAT PRO CLUB network and
                          start posting jobs.
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Name *</FormLabel>
                              <FormControl>
                                <div className="relative glow-effect">
                                  <Input
                                    placeholder="Enter your company name"
                                    className="bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                This will be displayed publicly on your company
                                profile.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Description *</FormLabel>
                              <FormControl>
                                <div className="relative glow-effect">
                                  <Textarea
                                    placeholder="Tell us about your company, its mission, values, and what makes it unique..."
                                    className="min-h-[120px] bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10 resize-none"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                Provide a detailed description of your company
                                (10-1000 characters).
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="website"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Website</FormLabel>
                              <FormControl>
                                <div className="relative glow-effect">
                                  <Input
                                    placeholder="https://www.yourcompany.com"
                                    className="bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                Optional: Add your company website URL.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="bg-secondary/20 rounded-lg p-4 border border-white/10">
                          <h4 className="font-medium mb-2">
                            What happens next?
                          </h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>
                              • You'll be automatically added as a company admin
                            </li>
                            <li>
                              • You can start posting job openings immediately
                            </li>
                            <li>
                              • Other users can discover and apply to your jobs
                            </li>
                            <li>
                              • You can invite team members to help manage the
                              company
                            </li>
                          </ul>
                        </div>

                        <div className="flex gap-4 pt-4">
                          <Button
                            variant="outline"
                            className="flex-1"
                            disabled={loading}
                            onClick={() => navigate("/companies")}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="flex-1 glow-on-hover"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating...
                              </>
                            ) : (
                              <>
                                <Building2 className="mr-2 h-4 w-4" />
                                Create Company
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

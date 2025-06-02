import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
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
import {
  ArrowLeft,
  Building2,
  Loader2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { Header } from "@/components/common/header";
import {
  CHECK_COMPANY_PERMISSIONS,
  GET_COMPANY_BY_ID,
  UPDATE_COMPANY,
} from "@/graphql/queries/company";

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

interface Company {
  id: string;
  name: string;
  description: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

interface CompanyData {
  getCompanyById: Company;
}

export default function EditCompanyPage({
  params,
}: {
  params: { id?: string };
}) {
  const { id } = params;
  const navigate = useNavigate();
  const [userToken, setUserToken] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!id) {
      navigate("/companies");
      return;
    }
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/signin");
      return;
    }
    setUserToken(token);
  }, [navigate, id]);

  const {
    data,
    loading: companyLoading,
    error,
  } = useQuery<CompanyData>(GET_COMPANY_BY_ID, {
    variables: {
      id: id,
      companyId: id,
    },
    fetchPolicy: "cache-and-network",
    skip: !id,
  });

  const { data: permission, loading: permissionsLoading } = useQuery(
    CHECK_COMPANY_PERMISSIONS,
    {
      variables: { id: id! },
      skip: !userToken || !id,
      context: {
        headers: {
          Authorization: userToken ? `Bearer ${userToken}` : "",
        },
      },
    }
  );
  const isAdmin = permission?.isAdmin || false;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      website: "",
    },
  });

  // Update form when company data loads
  useEffect(() => {
    if (data?.getCompanyById) {
      const company = data.getCompanyById;
      form.reset({
        name: company.name,
        description: company.description,
        website: company.website || "",
      });
    }
  }, [data, form]);

  const [updateCompany, { loading: updateLoading }] = useMutation(
    UPDATE_COMPANY,
    {
      context: {
        headers: {
          Authorization: userToken ? `Bearer ${userToken}` : "",
        },
      },
      onCompleted: (data) => {
        setIsSuccess(true);
        toast({
          title: "Company updated successfully!",
          description: `${data.updateCompany.name} has been updated.`,
        });

        // Redirect to company detail page after a short delay
        setTimeout(() => {
          navigate(`/companies/${id}`);
        }, 2000);
      },
      onError: (error) => {
        toast({
          title: "Error updating company",
          description:
            error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      },
    }
  );

  async function onSubmit(values: FormValues) {
    try {
      await updateCompany({
        variables: {
          id: id!,
          input: {
            name: values.name,
            description: values.description,
            website: values.website || undefined,
          },
        },
      });
    } catch (error) {
      console.error("Update company error:", error);
    }
  }

  const company = data?.getCompanyById;
  console.log("isAdmin", isAdmin);
  const loading = companyLoading || permissionsLoading;

  if (!userToken) {
    return (
      <div className="min-h-screen w-full aurora-gradient">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">
            Please sign in to edit companies.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full aurora-gradient">
        <Header />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen w-full aurora-gradient">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Company Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The company you're trying to edit doesn't exist or has been removed.
          </p>
          <Link to="/companies">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Companies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isAdmin) {
    return (
      <div className="min-h-screen w-full aurora-gradient">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">
            You don't have permission to edit this company. Only company
            managers can make changes.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to={`/companies/${id}`}>
              <Button variant="outline">View Company</Button>
            </Link>
            <Link to="/companies">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Companies
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full aurora-gradient">
      <Header />
      <div className="container mx-auto px-4 py-8 content-z-index">
        <div className="max-w-2xl mx-auto">
          <Link to={`/companies/${id}`}>
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Company
            </Button>
          </Link>

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
                      Company Updated Successfully!
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Your changes have been saved. Redirecting to company
                      page...
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
                        <CardTitle className="text-2xl">Edit Company</CardTitle>
                        <CardDescription>
                          Update your company information and settings.
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

                        <div className="flex gap-4 pt-4">
                          <Link to={`/companies/${id}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full"
                              disabled={updateLoading}
                            >
                              Cancel
                            </Button>
                          </Link>
                          <Button
                            type="submit"
                            className="flex-1 glow-on-hover"
                            disabled={updateLoading}
                          >
                            {updateLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                              </>
                            ) : (
                              <>
                                <Building2 className="mr-2 h-4 w-4" />
                                Update Company
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

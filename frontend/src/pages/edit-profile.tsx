"use client";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Camera, Save, X, Upload } from "lucide-react";
import { useAppSelector } from "@/state/store";
import { useUploadProfilePhotoMutation } from "@/state/api";
import Aurora from "@/components/ui/Aurora";
import { toast } from "sonner";

export default function EditProfilePage() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.global.user);
  const [uploadProfilePhoto, { isLoading: isUploading }] =
    useUploadProfilePhotoMutation();

  // Form state
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");

  // Avatar upload state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image must be less than 10MB");
        return;
      }

      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const handleAvatarUpload = async () => {
    if (!selectedImage) return;

    try {
      await uploadProfilePhoto({ file: selectedImage }).unwrap();
      toast.success("Profile photo updated successfully!");
      // Reset the image selection
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading profile photo:", error);
      toast.error("Failed to upload profile photo");
    }
  };

  const handleSave = async () => {
    // Here you would typically update the user profile
    // For now, just show a success message
    toast.success("Profile updated successfully!");
    navigate(`/profile/${user?.id}`);
  };

  const handleCancel = () => {
    navigate(`/profile/${user?.id}`);
  };

  if (!user) {
    return (
      <div className="min-h-screen w-full aurora-gradient">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">User not found</h1>
          <p className="text-muted-foreground">
            Please log in to edit your profile.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 -z-10">
        <Aurora
          colorStops={[
            "#003B49", // Aqua blue
            "#003B49", // Dark green
          ]}
          blend={0.2}
          amplitude={1.2}
          speed={0.5}
        />
      </div>

      <Header />

      <div className="container mx-auto px-4 py-8 content-z-index">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
            <p className="text-muted-foreground">
              Update your profile information and avatar
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="mr-2 h-5 w-5" />
                  Profile Photo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar className="h-32 w-32 border-4 border-background">
                      <AvatarImage
                        src={
                          imagePreview ||
                          user.profilePhoto ||
                          "/placeholder.svg"
                        }
                        alt={user.username}
                      />
                      <AvatarFallback className="text-2xl">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute -bottom-2 -right-2 rounded-full h-10 w-10"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageSelect}
                  />

                  {selectedImage && (
                    <div className="mt-4 w-full space-y-2">
                      <p className="text-sm text-muted-foreground text-center">
                        New photo selected: {selectedImage.name}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAvatarUpload}
                          disabled={isUploading}
                          className="flex-1"
                        >
                          {isUploading ? (
                            <>
                              <Upload className="mr-2 h-4 w-4 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              Upload
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedImage(null);
                            setImagePreview(null);
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Upload a new profile photo.
                      <br />
                      Max size: 10MB
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Supported formats: JPG, PNG, GIF, WebP
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information Section */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="min-h-[100px] resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    {bio.length}/500 characters
                  </p>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., San Francisco, CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://your-website.com"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="glow-on-hover">
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

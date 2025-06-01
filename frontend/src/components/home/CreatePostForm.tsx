import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, LinkIcon, Trash2 } from "lucide-react";

interface CreatePostFormProps {
  onCreatePost: (content: string, image?: File | null) => void;
}

export default function CreatePostForm({ onCreatePost }: CreatePostFormProps) {
  const [newPostText, setNewPostText] = useState("");
  const [newPostImage, setNewPostImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreatePost = () => {
    if (!newPostText.trim() && !newPostImage) return;

    onCreatePost(newPostText, newPostImage);
    setNewPostText("");
    setNewPostImage(null);
    setImagePreview(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewPostImage(file);
      // Create preview URL for display
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  const removeImage = () => {
    setNewPostImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-xl bg-background/40 backdrop-blur-md p-4 shadow-lg border border-white/10">
      <div className="flex items-start space-x-4">
        <Avatar className="h-10 w-10 border-2 border-primary/50">
          <AvatarImage
            src="/placeholder.svg?height=40&width=40"
            alt="Current User"
          />
          <AvatarFallback>CU</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-4">
          <Textarea
            placeholder="Share something with your network..."
            className="min-h-[100px] bg-background/60 border-white/10 focus:border-primary/50 resize-none transition-all"
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
          />

          {imagePreview && (
            <div className="relative mt-2 rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Post preview"
                className="max-h-[300px] w-full object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-80 hover:opacity-100"
                onClick={removeImage}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Image
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <LinkIcon className="mr-2 h-4 w-4" />
                Link
              </Button>
            </div>
            <Button
              className="glow-on-hover"
              onClick={handleCreatePost}
              disabled={!newPostText.trim() && !newPostImage}
            >
              Post
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

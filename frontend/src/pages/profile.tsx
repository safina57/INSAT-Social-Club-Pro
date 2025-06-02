"use client";

import { useState } from "react";
import { Header } from "@/components/common/header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Aurora from "@/components/ui/Aurora";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { PostsTab } from "@/components/profile/PostsTab";
import { AboutTab } from "@/components/profile/AboutTab";
import { ExperienceTab } from "@/components/profile/ExperienceTab";
import { EducationTab } from "@/components/profile/EducationTab";
import { SkillsTab } from "@/components/profile/SkillsTab";
import { getMockUserData } from "@/data/mockUser";
import { useGetUserByIdQuery } from "@/state/api";

interface ProfilePageProps {
  params: { id: string };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState("posts");
  const { id } = params;
  const { data: user } = useGetUserByIdQuery(id);
  const mockuser = getMockUserData();

  if (!user) {
    return (
      <div className="min-h-screen w-full aurora-gradient">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">User not found</h1>
          <p className="text-muted-foreground">
            The profile you're looking for doesn't exist or has been removed.
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
        <ProfileHeader user={user} />
        <ProfileInfo user={user} />

        {/* Profile Tabs */}
        <Tabs
          defaultValue="posts"
          value={activeTab}
          onValueChange={setActiveTab}
          className="mb-8 mt-8"
        >
          <TabsList className="grid grid-cols-5 md:w-[600px]">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          <div className="mt-8">
            <PostsTab posts={user.posts} user={user} />

            <TabsContent value="about">
              <AboutTab about={mockuser.about} />
            </TabsContent>

            <TabsContent value="experience">
              <ExperienceTab experience={mockuser.experience} />
            </TabsContent>

            <TabsContent value="education">
              <EducationTab education={mockuser.education} />
            </TabsContent>

            <TabsContent value="skills">
              <SkillsTab skills={mockuser.skills} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

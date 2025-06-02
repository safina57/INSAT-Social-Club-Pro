"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@/components/common/header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchIcon, Users, FileText, Hash, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchUsersQuery } from "@/state/api";

type SearchResult = {
  users: ApiUser[];
  posts: Post[];
  tags: Tag[];
};

interface ApiUser {
  id: string;
  username: string;
  email: string;
  role: string;
  profilePhoto?: string;
}

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
}

interface Tag {
  id: string;
  name: string;
  count: number;
}

export default function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [searchDebounce, setSearchDebounce] = useState("");
  const [results, setResults] = useState<SearchResult>({
    users: [],
    posts: [],
    tags: [],
  });
  const [hasSearched, setHasSearched] = useState(false);

  // Get query parameter from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
      setSearchDebounce(queryParam);
      setHasSearched(true);
    }
  }, [location.search]);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL when search query changes
  useEffect(() => {
    if (
      searchQuery.trim() &&
      searchQuery !== new URLSearchParams(location.search).get("q")
    ) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`, {
        replace: true,
      });
    }
  }, [searchQuery, navigate, location.search]);

  // Search users with real API
  const { data: searchUsersData = [], isLoading: isSearchingUsers } =
    useSearchUsersQuery(
      { query: searchDebounce, limit: 20 },
      { skip: searchDebounce.length < 2 }
    );

  // Update results when API data changes
  useEffect(() => {
    if (searchDebounce.length >= 2) {
      setResults((prevResults) => ({
        ...prevResults,
        users: searchUsersData,
      }));
      setHasSearched(true);
    } else {
      setResults({ users: [], posts: [], tags: [] });
      setHasSearched(false);
    }
  }, [searchUsersData, searchDebounce]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getTotalResults = () => {
    return results.users.length + results.posts.length + results.tags.length;
  };

  const getResultsForActiveTab = () => {
    switch (activeTab) {
      case "users":
        return results.users.length;
      case "posts":
        return results.posts.length;
      case "tags":
        return results.tags.length;
      default:
        return getTotalResults();
    }
  };

  return (
    <div className="min-h-screen w-full aurora-gradient">
      <Header />
      <div className="container mx-auto px-4 py-8 content-z-index">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl bg-background/40 backdrop-blur-md p-6 md:p-8 shadow-lg border border-white/10">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Search</h1>
              <p className="text-muted-foreground">
                Find people, posts, and topics across the INSAT PRO CLUB network
              </p>
            </div>

            <form onSubmit={handleSearch} className="relative mb-8">
              <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for people, posts, or tags..."
                className="pl-12 py-6 bg-secondary/50 backdrop-blur-sm border-secondary-foreground/10 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            <Tabs
              defaultValue="all"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-primary/20"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="data-[state=active]:bg-primary/20"
                >
                  <Users className="h-4 w-4 mr-2" />
                  People
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="data-[state=active]:bg-primary/20"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="tags"
                  className="data-[state=active]:bg-primary/20"
                >
                  <Hash className="h-4 w-4 mr-2" />
                  Tags
                </TabsTrigger>
              </TabsList>

              {isSearchingUsers ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Searching...</p>
                </div>
              ) : hasSearched ? (
                getResultsForActiveTab() > 0 ? (
                  <ScrollArea className="h-[calc(100vh-400px)] pr-4">
                    <TabsContent value="all" className="space-y-8 mt-0">
                      {results.users.length > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold flex items-center">
                              <Users className="h-5 w-5 mr-2 text-primary" />
                              People ({results.users.length})
                            </h2>
                            {results.users.length > 4 && (
                              <Button
                                variant="link"
                                onClick={() => setActiveTab("users")}
                                className="text-primary"
                              >
                                View all
                              </Button>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {results.users.slice(0, 4).map((user) => (
                              <UserCard key={user.id} user={user} />
                            ))}
                          </div>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="users" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {results.users.map((user) => (
                          <UserCard key={user.id} user={user} />
                        ))}
                      </div>
                      {results.users.length === 0 && (
                        <EmptyState type="users" query={searchDebounce} />
                      )}
                    </TabsContent>

                    <TabsContent value="posts" className="space-y-4 mt-0">
                      <div className="p-16 text-center text-muted-foreground">
                        <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">
                          Post Search Coming Soon
                        </h3>
                        <p>
                          We're working on adding post search functionality.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="tags" className="mt-0">
                      <div className="p-16 text-center text-muted-foreground">
                        <Hash className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">
                          Tag Search Coming Soon
                        </h3>
                        <p>We're working on adding tag search functionality.</p>
                      </div>
                    </TabsContent>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <SearchIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-xl font-medium mb-2">
                      No results found
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                      We couldn't find any matches for "{searchQuery}". Try
                      different keywords or check your spelling.
                    </p>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <SearchIcon className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Start searching</h3>
                  <p className="text-muted-foreground max-w-md">
                    Enter keywords above to search for people, posts, or tags
                    across the network.
                  </p>
                </div>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function UserCard({ user }: { user: ApiUser }) {
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate(`/profile/${user.id}`);
  };

  // Get user initials for avatar fallback
  const getUserInitials = (username: string) => {
    return username
      .split(" ")
      .map((name) => name[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="rounded-lg bg-secondary/30 border border-white/5 p-4 hover:bg-secondary/40 transition-colors cursor-pointer"
      onClick={handleUserClick}
    >
      <div className="flex items-center">
        <Avatar className="h-12 w-12 border border-white/10">
          <AvatarImage
            src={user.profilePhoto || "/default-avatar.png"}
            alt={user.username}
          />
          <AvatarFallback>{getUserInitials(user.username)}</AvatarFallback>
        </Avatar>
        <div className="ml-3 flex-1 min-w-0">
          <h3 className="font-medium truncate">{user.username}</h3>
          <p className="text-sm text-muted-foreground truncate">{user.role}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          <span>INSAT Member</span>
        </div>
        <Button
          size="sm"
          variant="secondary"
          className="h-8"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            // Handle connect action - could be implemented later
          }}
        >
          Connect
        </Button>
      </div>
    </motion.div>
  );
}

function EmptyState({ type, query }: { type: string; query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
        {type === "users" && (
          <Users className="h-6 w-6 text-muted-foreground" />
        )}
        {type === "posts" && (
          <FileText className="h-6 w-6 text-muted-foreground" />
        )}
        {type === "tags" && <Hash className="h-6 w-6 text-muted-foreground" />}
      </div>
      <h3 className="text-lg font-medium mb-1">No {type} found</h3>
      <p className="text-sm text-muted-foreground">
        We couldn't find any {type} matching "{query}"
      </p>
    </div>
  );
}

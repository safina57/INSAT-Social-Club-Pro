"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/state/store";
import { useSearchUsersQuery } from "@/state/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  Home,
  MessageSquare,
  Search,
  Briefcase,
  Menu,
  X,
  LogOut,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationsPanel } from "./notifications-panel";
import { useNotifications } from "@/context/NotificationsContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = useAppSelector((state) => state.global.user);
  const { unreadCount } = useNotifications();
  const pathname = location.pathname;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchDebounce, setSearchDebounce] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounce(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Search users query
  const { data: searchResults = [], isLoading: isSearching } =
    useSearchUsersQuery(
      { query: searchDebounce, limit: 5 },
      { skip: searchDebounce.length < 2 }
    );

  // Show/hide search results
  useEffect(() => {
    setShowSearchResults(
      searchDebounce.length >= 2 && searchResults.length > 0
    );
  }, [searchDebounce, searchResults]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = [
    { name: "Home", href: "/home", icon: Home },
    { name: "Messages", href: "/messages", icon: MessageSquare },
    { name: "Jobs", href: "/jobs", icon: Briefcase },
    { name: "Companies", href: "/companies", icon: Building }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
      setSearchQuery("");
    }
  };

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
    setShowSearchResults(false);
    setSearchQuery("");
  };

  const handleLogout = () => {
    logout();
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
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <a href="/home" className="flex items-center">
            <span className="hidden font-bold sm:inline-block">
              INSAT PRO CLUB
            </span>
          </a>
        </div>

        <div
          className="hidden md:block flex-1 px-8 max-w-md mx-4"
          ref={searchRef}
        >
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-full bg-secondary/50 pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() =>
                searchDebounce.length >= 2 && setShowSearchResults(true)
              }
            />

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur-md border border-white/10 rounded-md shadow-lg max-h-80 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-3 text-center text-sm text-muted-foreground">
                    Searching...
                  </div>
                ) : (
                  <>
                    {searchResults.length > 0 ? (
                      <>
                        <div className="p-2 border-b border-white/10">
                          <div className="text-xs text-muted-foreground font-medium">
                            Users
                          </div>
                        </div>
                        {searchResults.map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-3 p-3 hover:bg-secondary/30 cursor-pointer transition-colors"
                            onClick={() => handleUserClick(user.id)}
                          >
                            <Avatar className="h-8 w-8 border border-white/10">
                              <AvatarImage
                                src={user.profilePhoto || "/default-avatar.png"}
                                alt={user.username}
                              />
                              <AvatarFallback>
                                {getUserInitials(user.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium truncate">
                                {user.username}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </div>
                            </div>
                            <User className="h-4 w-4 text-muted-foreground" />
                          </div>
                        ))}
                        {searchQuery.length >= 2 && (
                          <div className="p-2 border-t border-white/10">
                            <button
                              onClick={() => {
                                navigate(
                                  `/search?q=${encodeURIComponent(searchQuery)}`
                                );
                                setShowSearchResults(false);
                                setSearchQuery("");
                              }}
                              className="w-full text-left text-sm text-primary hover:text-primary/80 transition-colors"
                            >
                              See all results for "{searchQuery}"
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="p-3 text-center text-sm text-muted-foreground">
                        No users found for "{searchDebounce}"
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </form>
        </div>

        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <a key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "flex flex-col items-center justify-center h-16 px-4 text-xs gap-1",
                    isActive && "bg-secondary/50 text-primary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Button>
              </a>
            );
          })}

          <div className="relative">
            <Button
              variant="ghost"
              className="flex flex-col items-center justify-center h-16 px-4 text-xs gap-1"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              {" "}
              <div className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
              <span>Notifications</span>
            </Button>
            <NotificationsPanel
              isOpen={notificationsOpen}
              onClose={() => setNotificationsOpen(false)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-16 px-2">
                <Avatar className="h-8 w-8 border border-white/10">
                  <AvatarImage
                    src={user?.profilePhoto || "/default-avatar.png"}
                    alt="User"
                  />
                  <AvatarFallback>
                    {user ? getUserInitials(user.username) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-background/95 backdrop-blur-md border-white/10"
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user?.username || "User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-md">
          <div className="container px-4 py-3">
            <div className="relative mb-4" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="w-full bg-secondary/50 pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() =>
                    searchDebounce.length >= 2 && setShowSearchResults(true)
                  }
                />
              </form>

              {/* Mobile Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background/95 backdrop-blur-md border border-white/10 rounded-md shadow-lg max-h-80 overflow-y-auto z-50">
                  {isSearching ? (
                    <div className="p-3 text-center text-sm text-muted-foreground">
                      Searching...
                    </div>
                  ) : (
                    <>
                      {searchResults.length > 0 ? (
                        <>
                          <div className="p-2 border-b border-white/10">
                            <div className="text-xs text-muted-foreground font-medium">
                              Users
                            </div>
                          </div>
                          {searchResults.map((user) => (
                            <div
                              key={user.id}
                              className="flex items-center gap-3 p-3 hover:bg-secondary/30 cursor-pointer transition-colors"
                              onClick={() => {
                                handleUserClick(user.id);
                                setMobileMenuOpen(false);
                              }}
                            >
                              <Avatar className="h-8 w-8 border border-white/10">
                                <AvatarImage
                                  src={
                                    user.profilePhoto || "/default-avatar.png"
                                  }
                                  alt={user.username}
                                />
                                <AvatarFallback>
                                  {getUserInitials(user.username)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {user.username}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {user.email}
                                </div>
                              </div>
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                          ))}
                          {searchQuery.length >= 2 && (
                            <div className="p-2 border-t border-white/10">
                              <button
                                onClick={() => {
                                  navigate(
                                    `/search?q=${encodeURIComponent(
                                      searchQuery
                                    )}`
                                  );
                                  setShowSearchResults(false);
                                  setSearchQuery("");
                                  setMobileMenuOpen(false);
                                }}
                                className="w-full text-left text-sm text-primary hover:text-primary/80 transition-colors"
                              >
                                See all results for "{searchQuery}"
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="p-3 text-center text-sm text-muted-foreground">
                          No users found for "{searchDebounce}"
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            <nav className="grid grid-cols-3 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;

                return (
                  <a key={item.name} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full flex flex-col items-center justify-center py-3 text-xs gap-1",
                        isActive && "bg-secondary/50 text-primary"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Button>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

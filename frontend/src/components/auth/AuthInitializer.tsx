import { useEffect } from "react";
import { useAppDispatch } from "@/state/store";
import { setUser } from "@/state";

/**
 * Component that initializes user authentication state on app load
 * This component should be rendered once in the app to restore user state
 * when the app is refreshed and there's an existing access token
 */
export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        // No token found, user is not authenticated
        return;
      }

      try {
        // Fetch current user data using the stored token
        const backendUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${backendUrl}/graphql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              query Currentuser {
                currentuser {
                  id
                  username
                  email
                  role
                  profilePhoto
                }
              }
            `,
          }),
        });

        if (!response.ok) {
          // Token is invalid or expired, remove it
          localStorage.removeItem("access_token");
          return;
        }

        const userData = await response.json();

        if (userData.data?.currentuser) {
          // Restore user data in Redux store
          dispatch(setUser(userData.data.currentuser));
        } else if (userData.errors) {
          // GraphQL errors, token might be invalid
          console.error("GraphQL errors:", userData.errors);
          localStorage.removeItem("access_token");
        }
      } catch (error) {
        console.error("Failed to initialize user data:", error);
        // Remove invalid token
        localStorage.removeItem("access_token");
      }
    };

    initializeAuth();
  }, [dispatch]);

  // This component doesn't render anything
  return null;
}

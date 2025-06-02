import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { toast } from "sonner";

const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extraOptions: any
) => {
  const token = localStorage.getItem("access_token");

  const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: "include",
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result: any = await baseQuery(args, api, extraOptions);
    if (result.error) {
      if (result.error.status === 401) {
        localStorage.removeItem("access_token");
        toast.error("Session expired. Please log in again.");

        await new Promise((resolve) => setTimeout(resolve, 2000));
        window.location.href = "/login";
      } else {
        const errorData = result.error.data;
        const errorMessage =
          errorData?.message ||
          result.error.status.toString() ||
          "An error occurred";
        toast.error(`Error: ${errorMessage}`);
      }
    }

    const isMutationRequest =
      (args as FetchArgs).method && (args as FetchArgs).method !== "GET";
    if (isMutationRequest) {
      const toastMeta = extraOptions?.meta?.toast;

      if (toastMeta) {
        if (result.error && toastMeta.showError !== false) {
          toast.error(toastMeta.errorMessage || "Something went wrong");
        }

        if (!result.error && toastMeta.showSuccess !== false) {
          toast.success(toastMeta.successMessage || "Success!");
        }
      }
      const successMessage = result.data?.message;
      if (successMessage) toast.success(successMessage);
    }

    if (result.data) {
      result.data = result.data.data;
    } else if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 24
    ) {
      return { data: null };
    }
    return result;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return { error: { status: "FETCH_ERROR", error: errorMessage } };
  }
};

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["Post", "User"],
  endpoints: (builder) => ({
    /*
    =================
    USER ENDPOINTS GRAPHQL
    =================
    */
    getCurrentUser: builder.query({
      query: () => ({
        url: "/graphql",
        method: "POST",
        body: {
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
        },
      }),
      providesTags: (result) =>
        result ? [{ type: "User", id: result.id }] : ["User"],
    }),
    getUserById: builder.query<
      {
        id: string;
        username: string;
        email: string;
        role: string;
        profilePhoto?: string;
        posts: Post[];
      },
      string
    >({
      query: (id) => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: `
            query User($id: ID!) {
              user(id: $id) {
                id  
                username
                email
                role
                profilePhoto
                posts {
                  id
                  content
                  imageUrl
                  createdAt
                  updatedAt
                  likesCount
                  authorId
                  
                  
                }
              }
            }
          `,
          variables: { id },
        },
      }),
      providesTags: (result, id) =>
        result ? [{ type: "User", id: id }] : ["User"],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: { user?: any }) =>
        response.user ?? {
          id: "",
          username: "",
          email: "",
          role: "",
          profilePhoto: undefined,
          posts: [],
        },
    }),

    searchUsers: builder.query<
      Array<{
        id: string;
        username: string;
        email: string;
        role: string;
        profilePhoto?: string;
      }>,
      { query: string; page?: number; limit?: number }
    >({
      query: ({ query, page = 1, limit = 10 }) => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: `
            query SearchUsers($searchQuery: String!, $page: Int!, $limit: Int!) {
              searchUsers(query: $searchQuery, paginationDto: { page: $page, limit: $limit }) {
                id
                username
                email
                role
                profilePhoto
              }
            }
          `,
          variables: { searchQuery: query, page, limit },
        },
      }),
      providesTags: ["User"],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: { searchUsers?: any }) =>
        response.searchUsers ?? [],
    }),

    uploadProfilePhoto: builder.mutation<
      { profilePhoto: string },
      { file: File }
    >({
      query: ({ file }) => {
        const formData = new FormData();
        formData.append(
          "operations",
          JSON.stringify({
            query: `
            mutation UploadProfilePhoto($file: Upload!) {
              uploadProfilePhoto(file: $file) {
                profilePhoto
              }
            }
          `,
            variables: { file: null },
          })
        );
        formData.append("map", JSON.stringify({ "0": ["variables.file"] }));
        formData.append("0", file);
        return {
          url: "/graphql",
          method: "POST",
          body: formData,
          headers: {
            "x-apollo-operation-name": "UploadProfilePhoto",
          },
        };
      },
      invalidatesTags: ["User"],
    }),
    /*
    =================
    POSTS ENDPOINTS GRAPHQL
    =================
    */
    getPosts: builder.query<
      {
        results: Array<{
          id: string;
          content: string;
          imageUrl?: string;
          createdAt: string;
          updatedAt: string;
          likesCount: number;
          isLiked: boolean;
          author: {
            id: string;
            username: string;
            email: string;
            role: string;
          };
          authorId: string;
          comments: Array<{
            id: string;
            content: string;
            createdAt: string;
            updatedAt: string;
            author: {
              id: string;
              username: string;
              email: string;
              role: string;
            };
            authorId: string;
          }>;
        }>;
        meta: {
          total: number;
          page: number;
          lastPage: number;
          limit: number;
        };
      },
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: `
            query Posts($page: Int!, $limit: Int!) {
              posts(paginationDto: { page: $page, limit: $limit }) {
                results {
                  id
                  content
                  imageUrl
                  createdAt
                  updatedAt
                  likesCount
                  isLiked
                  author {
                    id
                    username
                    email
                    role
                    profilePhoto
                  }
                  authorId
                  comments {
                    id
                    content
                    createdAt
                    updatedAt
                    author {
                      id
                      username
                      email
                      role
                      profilePhoto
                    }
                    authorId
                  }
                }
                meta {
                  total
                  page
                  lastPage
                  limit
                }
              }
            }
          `,
          variables: { page, limit },
        },
      }),
      providesTags: ["Post"],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: { posts?: any }) =>
        response.posts ?? {
          results: [],
          meta: { total: 0, page: 1, lastPage: 1, limit: 10 },
        },
    }),

    /*
    =================
    POSTS MUTATIONS
    =================
    */
    createPost: builder.mutation<
      {
        id: string;
        content: string;
        imageUrl?: string;
        createdAt: string;
        updatedAt: string;
        likesCount: number;
        author: {
          id: string;
          username: string;
          email: string;
          role: string;
        };
        authorId: string;
      },
      { content: string; image?: File }
    >({
      query: ({ content, image }) => {
        if (image) {
          // Handle file upload - you might need to adjust this based on your backend's file upload implementation
          const formData = new FormData();

          formData.append(
            "operations",
            JSON.stringify({
              query: `
              mutation CreatePost($createPostInput: CreatePostInput!, $image: Upload) {
                createPost(createPostInput: $createPostInput, image: $image) {
                  id
                }
              }
            `,
              variables: { createPostInput: { content }, image: null },
            })
          );
          formData.append("map", JSON.stringify({ "0": ["variables.image"] }));
          formData.append("0", image);
          console.log("FormData:", formData);
          return {
            url: "/graphql",
            method: "POST",
            body: formData,
            headers: {
              "x-apollo-operation-name": "CreatePost",
            },
          };
        } else {
          return {
            url: "/graphql",
            method: "POST",
            body: {
              query: `
                mutation CreatePost($createPostInput: CreatePostInput!) {
                  createPost(createPostInput: $createPostInput) {
                    id
                    content
                    imageUrl
                    createdAt
                    updatedAt
                    likesCount
                    author {
                      id
                      username
                      email
                      role
                    }
                    authorId
                  }
                }
              `,
              variables: { createPostInput: { content } },
            },
          };
        }
      },
      invalidatesTags: ["Post"],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any) => response.createPost,
    }),

    likePost: builder.mutation<
      {
        id: string;
        content: string;
        imageUrl?: string;
        createdAt: string;
        updatedAt: string;
        likesCount: number;
        author: {
          id: string;
          username: string;
          email: string;
          role: string;
        };
        authorId: string;
      },
      string
    >({
      query: (postId) => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: `
            mutation LikePost($id: ID!) {
              likePost(id: $id) {
                id
                content
                imageUrl
                createdAt
                updatedAt
                likesCount
                author {
                  id
                  username
                  email
                  role
                }
                authorId
              }
            }
          `,
          variables: { id: postId },
        },
      }),
      invalidatesTags: ["Post"],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any) => response.likePost,
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const commonParams = { page: 1, limit: 10 };
        const patches = dispatch(
          api.util.updateQueryData("getPosts", commonParams, (draft) => {
            const post = draft.results.find((p) => p.id === postId);
            if (post) {
              post.likesCount += 1;
              post.isLiked = true;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic update
          patches.undo();
        }
      },
    }),

    unlikePost: builder.mutation<
      {
        id: string;
        content: string;
        imageUrl?: string;
        createdAt: string;
        updatedAt: string;
        likesCount: number;
        author: {
          id: string;
          username: string;
          email: string;
          role: string;
        };
        authorId: string;
      },
      string
    >({
      query: (postId) => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: `
            mutation UnlikePost($id: ID!) {
              unlikePost(id: $id) {
                id
                content
                imageUrl
                createdAt
                updatedAt
                likesCount
                author {
                  id
                  username
                  email
                  role
                }
                authorId
              }
            }
          `,
          variables: { id: postId },
        },
      }),
      invalidatesTags: ["Post"],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (response: any) => response.unlikePost,
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        const commonParams = { page: 1, limit: 10 };
        const patches = dispatch(
          api.util.updateQueryData("getPosts", commonParams, (draft) => {
            const post = draft.results.find((p) => p.id === postId);
            if (post) {
              post.likesCount -= 1;
              post.isLiked = false;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic update
          patches.undo();
        }
      },
    }),

    deletePost: builder.mutation<{ id: string }, string>({
      query: (postId) => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: `
            mutation RemovePost($id: ID!) {
              removePost(id: $id) {
                id
              }
            }
          `,
          variables: { id: postId },
        },
      }),
      invalidatesTags: ["Post"],
    }),

    sharePost: builder.mutation<
      {
        id: string;
      },
      string
    >({
      query: (postId) => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: `
            mutation SharePost($id: ID!) {
              sharePost(id: $id) {
                id
              }
            }
          `,
          variables: { id: postId },
        },
      }),
      invalidatesTags: ["Post"],
    }),

    /*
    =================
    COMMENTS MUTATIONS
    =================
    */
    createComment: builder.mutation<
      {
        id: string;
        content: string;
        createdAt: string;
        updatedAt: string;
        author: {
          id: string;
          username: string;
          email: string;
          role: string;
        };
        authorId: string;
      },
      { content: string; postId: string }
    >({
      query: ({ content, postId }) => ({
        url: "/graphql",
        method: "POST",
        body: {
          query: `
            mutation CreateComment($createCommentInput: CreateCommentInput!) {
              createComment(createCommentInput: $createCommentInput) {
                id
              }
            }
          `,
          variables: { createCommentInput: { content, postId } },
        },
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetCurrentUserQuery,
  useGetUserByIdQuery,
  useSearchUsersQuery,
  useUploadProfilePhotoMutation,
  useGetPostsQuery,
  useCreatePostMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useDeletePostMutation,
  useSharePostMutation,
  useCreateCommentMutation,
} = api;

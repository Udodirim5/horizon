import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import {
  createPost,
  createUserAccount,
  getRecentPosts,
  signInAccount,
  signOutAccount,
} from "../appwrite/api";
import { INewPost, INewUser } from "@/types";
import { useUserContext } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { QUERY_KEYS } from "./queryKeys";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: async (user: INewUser) => {
      const newUser = await createUserAccount(user);
      if (!newUser) {
        throw new Error("User creation failed.");
      }
      return newUser;
    },
    onError: (error) => {
      console.error("Mutation error:", error);
    },
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: async (user: { email: string; password: string }) => {
      const session = await signInAccount(user);
      if (!session) {
        throw new Error("Sign-in failed.");
      }
      return session;
    },
    onError: (error) => {
      console.error("Sign-in error:", error);
    },
  });
};

export const useSignOutAccount = () => {
  const { setUser } = useUserContext(); // ✅ Get setUser from context
  const navigate = useNavigate(); // ✅ Redirect after logout

  return useMutation({
    mutationFn: async () => {
      const session = await signOutAccount();
      if (!session) {
        throw new Error("Sign-out failed.");
      }
      return session;
    },
    onSuccess: () => {
      setUser(null); // ✅ Clear user state immediately
      navigate("/sign-in", { replace: true }); // ✅ Redirect after logout
    },
    onError: (error) => {
      console.error("Sign-out error:", error);
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (post: INewPost) => {
      const newPost = await createPost(post);
      if (!newPost) {
        throw new Error("Post creation failed.");
      }
      return newPost;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GET_RECENT_POSTS] });
    },
    onError: (error) => {
      console.error("Error creating post:", error);
    },
  });
};

// ============================== GET POPULAR POSTS (BY HIGHEST LIKE COUNT)
export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS], 
    queryFn: getRecentPosts}
  );
}


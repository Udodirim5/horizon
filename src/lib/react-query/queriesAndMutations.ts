import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";

import { createUserAccount, signInAccount, signOutAccount } from "../appwrite/api";
import { INewUser } from "@/types";

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
  return useMutation({
    mutationFn: async () => {
      const session = await signOutAccount(); // ✅ Call function correctly
      if (!session) {
        throw new Error("Sign-out failed."); // ✅ Correct error message
      }
      return session;
    },
    onError: (error) => {
      console.error("Sign-out error:", error); // ✅ Correct error logging
    },
  });
};

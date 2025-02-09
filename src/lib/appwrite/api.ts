import { INewUser } from "@/types";
import { ID, Query, AppwriteException } from "appwrite";
import { account, appwriteConfig, avatars, databases } from "./config";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(), 
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw new Error("Failed to create user account.");

    // const avatarUrl = new URL(avatars.getInitials(user.name));
    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDatabase({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
      // imageUrl: string; // Change URL to string
    });

    return newUser;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function saveUserToDatabase(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    // Check if the user already has an active session
    const currentSession = await account.get();

    if (currentSession) {
      await account.deleteSession("current"); // Logout before proceeding
    }
  } catch (error) {
    console.error("Error logging out existing session:", error);
  }

  // Now create a new session
  try {
    const session = await account.createEmailPasswordSession(user.email, user.password);

    return session;
  } catch (error) {
    console.error("Error signing in:", error);
    return null;
  }
}


export async function getCurrentUser() {
  try {
    // Try fetching the current logged-in account
    const currentAccount = await account.get();
    console.log("currentAccount:", currentAccount);

    // Fetch user details from the database
    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || !currentUser.documents.length) {
      console.warn(`No user found for accountId: ${currentAccount.$id}`);
      return null;
    }

    return currentUser.documents[0];
  } catch (error: unknown) {
    if (error instanceof AppwriteException && error.code === 401) {
      console.warn("User is not logged in. Returning null.");
      return null;
    }

    console.error("Error in getCurrentUser:", error);
    return null;
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.error("Error signing out:", error);
    return null;
  }
}


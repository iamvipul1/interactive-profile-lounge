
import { toast } from "sonner";

// You can switch between real API and mock implementation
const USE_MOCK_API = true;
const API_URL = "http://localhost:8000/api";

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

interface ProfileData {
  bio?: string;
  image?: File;
}

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Profile {
  id: number;
  user: User;
  image: string;
  bio: string;
}

// Mock data for local development without backend
const mockUsers: User[] = [];
let currentUser: User | null = null;

// Helper to handle fetch errors
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => {
      return { message: response.statusText };
    });
    throw new Error(error.message || "An error occurred");
  }
  return response.json();
};

// Mock implementation for local development
const mockAPI = {
  auth: {
    login: async (data: LoginData) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = mockUsers.find(u => u.username === data.username);
      if (!user) {
        throw new Error("Invalid credentials");
      }
      
      currentUser = user;
      return { user, message: "Login successful" };
    },

    register: async (data: RegisterData) => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if username already exists
      if (mockUsers.some(u => u.username === data.username)) {
        throw new Error("Username already exists");
      }
      
      // Create new user
      const newUser: User = {
        id: mockUsers.length + 1,
        username: data.username,
        email: data.email,
        first_name: data.first_name || "",
        last_name: data.last_name || ""
      };
      
      mockUsers.push(newUser);
      return { message: "Registration successful" };
    },

    logout: async () => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      currentUser = null;
      return { message: "Logged out successfully" };
    },

    getCurrentUser: async (): Promise<User | null> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return currentUser;
    },
  },

  profile: {
    getProfile: async (): Promise<Profile | null> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!currentUser) return null;
      
      return {
        id: currentUser.id,
        user: currentUser,
        image: "https://via.placeholder.com/150",
        bio: "This is a mock profile bio for testing purposes."
      };
    },

    updateProfile: async (profileId: number, data: ProfileData): Promise<Profile> => {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!currentUser) {
        throw new Error("Not authenticated");
      }
      
      return {
        id: profileId,
        user: currentUser,
        image: "https://via.placeholder.com/150",
        bio: data.bio || "Updated bio"
      };
    },
  },
};

// Real API implementation
const realAPI = {
  auth: {
    login: async (data: LoginData) => {
      try {
        const response = await fetch(`${API_URL}/login/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        });
        
        return await handleResponse(response);
      } catch (error) {
        console.error("Login error:", error);
        toast.error(error instanceof Error ? error.message : "Login failed");
        throw error;
      }
    },

    register: async (data: RegisterData) => {
      try {
        const response = await fetch(`${API_URL}/register/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        
        return await handleResponse(response);
      } catch (error) {
        console.error("Registration error:", error);
        toast.error(error instanceof Error ? error.message : "Registration failed");
        throw error;
      }
    },

    logout: async () => {
      try {
        const response = await fetch(`${API_URL}/logout/`, {
          method: "POST",
          credentials: "include",
        });
        
        return await handleResponse(response);
      } catch (error) {
        console.error("Logout error:", error);
        toast.error(error instanceof Error ? error.message : "Logout failed");
        throw error;
      }
    },

    getCurrentUser: async (): Promise<User | null> => {
      try {
        const response = await fetch(`${API_URL}/user/`, {
          credentials: "include",
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            return null;
          }
          throw new Error("Failed to get current user");
        }
        
        return await response.json();
      } catch (error) {
        console.error("Get current user error:", error);
        return null;
      }
    },
  },

  profile: {
    getProfile: async (): Promise<Profile | null> => {
      try {
        const response = await fetch(`${API_URL}/profile/`, {
          credentials: "include",
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            return null;
          }
          throw new Error("Failed to get profile");
        }
        
        const profiles = await response.json();
        return profiles.length > 0 ? profiles[0] : null;
      } catch (error) {
        console.error("Get profile error:", error);
        return null;
      }
    },

    updateProfile: async (profileId: number, data: ProfileData): Promise<Profile> => {
      try {
        const formData = new FormData();
        
        if (data.bio) {
          formData.append("bio", data.bio);
        }
        
        if (data.image) {
          formData.append("image", data.image);
        }
        
        const response = await fetch(`${API_URL}/profile/${profileId}/`, {
          method: "PATCH",
          credentials: "include",
          body: formData,
        });
        
        return await handleResponse(response);
      } catch (error) {
        console.error("Update profile error:", error);
        toast.error(error instanceof Error ? error.message : "Failed to update profile");
        throw error;
      }
    },
  },
};

// Export the appropriate API implementation
export const api = USE_MOCK_API ? mockAPI : realAPI;

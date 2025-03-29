
import { toast } from "sonner";

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

// Helper to handle fetch errors
const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  
  if (!response.ok) {
    if (isJson) {
      // Parse JSON error response
      const errorData = await response.json();
      // Django REST Framework often returns errors in this format
      if (errorData.detail) {
        throw new Error(errorData.detail);
      } else if (typeof errorData === 'object') {
        // Handle field-specific errors
        const errorMessages = Object.entries(errorData)
          .map(([field, errors]) => {
            if (Array.isArray(errors)) {
              return `${field}: ${errors.join(', ')}`;
            }
            return `${field}: ${errors}`;
          })
          .join('; ');
        throw new Error(errorMessages);
      }
      throw new Error(JSON.stringify(errorData));
    }
    
    // Non-JSON error
    throw new Error(response.statusText || "An error occurred");
  }
  
  // Handle empty responses (like 204 No Content)
  if (!isJson) {
    return { success: true };
  }
  
  return response.json();
};

export const api = {
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
        console.log("Registering with data:", data);
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

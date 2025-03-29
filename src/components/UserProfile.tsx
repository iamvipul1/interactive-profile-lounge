
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Edit, User } from "lucide-react";

interface Profile {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  image: string;
  bio: string;
}

const UserProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await api.profile.getProfile();
        if (profileData) {
          setProfile(profileData);
          setBio(profileData.bio || "");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;
    
    try {
      setIsLoading(true);
      const updatedProfile = await api.profile.updateProfile(profile.id, {
        bio,
        image: selectedImage || undefined,
      });
      
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      // Error is already handled in the API service
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto glass-card">
        <CardContent className="py-10 text-center">
          <p>Loading profile...</p>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="w-full max-w-2xl mx-auto glass-card">
        <CardContent className="py-10 text-center">
          <p>Profile not found</p>
        </CardContent>
      </Card>
    );
  }

  const displayName = profile.user.first_name 
    ? `${profile.user.first_name} ${profile.user.last_name}`
    : profile.user.username;

  return (
    <Card className="w-full max-w-2xl mx-auto animate-fade-up glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center gradient-text">My Profile</CardTitle>
        <CardDescription className="text-center">Manage your profile information</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="w-32 h-32 border-4 border-primary/20">
              <AvatarImage 
                src={previewUrl || profile.image} 
                alt={displayName} 
              />
              <AvatarFallback className="text-2xl bg-accent">
                <User className="w-10 h-10" />
              </AvatarFallback>
            </Avatar>
            
            {isEditing && (
              <div className="mt-2">
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <label 
                  htmlFor="profile-image" 
                  className="cursor-pointer inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-primary/10 hover:bg-primary/20 transition-colors"
                >
                  Change Photo
                </label>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <h3 className="text-xl font-semibold">{displayName}</h3>
            <p className="text-sm text-muted-foreground">@{profile.user.username}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">About Me</h4>
            {!isEditing && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsEditing(true)}
                className="h-8 px-2"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="min-h-[120px] bg-white/50"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setBio(profile.bio || "");
                    setSelectedImage(null);
                    setPreviewUrl(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="bg-white/50 p-3 rounded-md">
              {profile.bio ? (
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{profile.bio}</p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No bio provided yet.</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center border-t pt-6">
        <p className="text-xs text-muted-foreground">
          Account created on {new Date().toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );
};

export default UserProfile;

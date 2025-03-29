
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut, User } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white/50 backdrop-blur-md border-b border-accent/20 sticky top-0 z-10 py-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 
            className="text-xl font-bold gradient-text cursor-pointer" 
            onClick={() => navigate("/")}
          >
            Profile Lounge
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-2" 
                onClick={() => navigate("/dashboard")}
              >
                <User size={18} />
                <span className="hidden sm:inline">{user.username}</span>
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2" 
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              
              <Button 
                variant="default" 
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

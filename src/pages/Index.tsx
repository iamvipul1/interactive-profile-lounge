
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col">
        <section className="relative flex-1 flex flex-col items-center justify-center text-center p-8 overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50">
          {/* Background decorative elements */}
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-br from-purple-200/30 to-indigo-200/30 blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-tl from-purple-200/30 to-indigo-200/30 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto animate-fade-up">
            <h1 className="text-5xl sm:text-6xl font-bold mb-6 gradient-text tracking-tight">
              Profile Lounge
            </h1>
            <p className="text-xl mb-8 text-gray-700 max-w-xl mx-auto">
              Your personal space to showcase who you are. Create your profile, share your story, and connect with others.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button
                  size="lg"
                  className="px-8 py-6 text-lg"
                  onClick={() => navigate("/dashboard")}
                >
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="px-8 py-6 text-lg"
                    onClick={() => navigate("/register")}
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-6 text-lg"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 gradient-text">
              Features
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-accent/50 to-accent/10 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Personal Profile</h3>
                <p className="text-gray-600">
                  Create and customize your personal profile with your photo and bio.
                </p>
              </div>
              <div className="bg-gradient-to-br from-accent/50 to-accent/10 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Secure Authentication</h3>
                <p className="text-gray-600">
                  Enjoy secure login and registration with our Django-powered backend.
                </p>
              </div>
              <div className="bg-gradient-to-br from-accent/50 to-accent/10 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-3">Modern UI</h3>
                <p className="text-gray-600">
                  Experience a beautiful, responsive design with smooth animations.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 py-8 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2023 Profile Lounge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "@/context/AuthContext";
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import axios from "axios";
import { ADMIN_EMAILS } from "@/constants";

const GOOGLE_ID = "319314674536-fq5ha9ltheldhm376k54keo35hhbdmfq.apps.googleusercontent.com";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const googleDivRef = useRef<HTMLDivElement>(null);

  /** ✅ Enhanced Google One-Tap Login Handler */
  const handleCredential = useCallback(async (response: any) => {
    setIsGoogleLoading(true);
    setError("");

    try {
      console.log("[DEBUG] Google auth response:", response);
      
      if (!response?.credential) {
        throw new Error("No credential received from Google");
      }

      const token = response.credential;
      
      // Validate token format
      if (typeof token !== "string" || !token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)) {
        throw new Error("Invalid Google token format");
      }

      console.log("[DEBUG] Google token received:", token);

      const decoded: any = jwtDecode(token);
      console.log("[DEBUG] Decoded token:", decoded);

      if (!decoded?.email) {
        throw new Error("Token missing required email field");
      }

      // Verify token has required fields
      if (!decoded.iss || !decoded.aud || !decoded.exp) {
        console.warn("[WARNING] Token missing standard JWT fields");
      }

      // Call login function with the validated token
      await login(token);

      const target = ADMIN_EMAILS.includes(decoded.email)
        ? "/admin-dashboard"
        : "/dashboard";

      navigate(location.state?.from?.pathname || target, { replace: true });
    } catch (error: any) {
      console.error("[ERROR] Google auth failed:", error);
      setError(error.message || "Google login failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  }, [login, navigate, location.state]);

  /** ✅ Improved Google One Tap Script Injection */
  useEffect(() => {
    if (!googleDivRef.current) return;

    const handleGoogleLoad = () => {
      try {
        // @ts-ignore
        if (!window.google?.accounts?.id) {
          throw new Error("Google SDK not loaded properly");
        }

        console.log("[DEBUG] Initializing Google auth...");
        
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: GOOGLE_ID,
          callback: (response: any) => {
            console.log("[DEBUG] Google auth callback triggered");
            handleCredential(response);
          },
          prompt_parent_id: googleDivRef.current?.id,
          ux_mode: "popup",
        });

        // @ts-ignore
        window.google.accounts.id.renderButton(googleDivRef.current, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular",
          width: googleDivRef.current?.clientWidth,
        });

        // Optional: Display the One Tap prompt
        // @ts-ignore
        window.google.accounts.id.prompt();
      } catch (err) {
        console.error("[ERROR] Google auth initialization failed:", err);
        setError("Failed to initialize Google login. Please refresh the page.");
      }
    };

    if (window.google?.accounts?.id) {
      handleGoogleLoad();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = handleGoogleLoad;
      script.onerror = () => {
        console.error("[ERROR] Failed to load Google SDK");
        setError("Failed to load Google login. Please check your connection.");
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [handleCredential]);

  /** ✅ Enhanced Email/Password Login Handler */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsFormLoading(true);

    const { email, password } = form;

    try {
      if (!email || !password) {
        throw new Error("Please enter both email and password");
      }

      console.log("[DEBUG] Attempting email/password login...");
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, form, {
        validateStatus: (status) => status < 500
      });

      console.log("[DEBUG] Login response:", res);

      if (!res.data?.token) {
        throw new Error(res.data?.message || "No token received from server");
      }

      const token = res.data.token;
      if (typeof token !== "string") {
        throw new Error("Invalid token format from server");
      }

      const decoded: any = jwtDecode(token);
      console.log("[DEBUG] Decoded server token:", decoded);

      await login(token);

      const target = ADMIN_EMAILS.includes(decoded.email)
        ? "/admin-dashboard"
        : "/dashboard";

      navigate(location.state?.from?.pathname || target, { replace: true });
    } catch (err: any) {
      console.error("[ERROR] Login failed:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );
    } finally {
      setIsFormLoading(false);
    }
  };

  /** ✅ Handle Form Input Changes */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    setError(""); // Clear error when user types
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Logo className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Use your university credentials</CardDescription>
          </CardHeader>

          {/* Google Sign-In button with loading state */}
          <div 
            ref={googleDivRef} 
            className="flex justify-center my-4"
            id="google-signin-button"
          >
            {isGoogleLoading && (
              <div className="p-2 text-sm text-gray-500">Loading Google login...</div>
            )}
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email / Student ID</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={form.email} 
                  onChange={handleChange}
                  disabled={isFormLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={form.password} 
                  onChange={handleChange}
                  disabled={isFormLoading}
                />
              </div>
              {error && (
                <p className="text-sm text-red-600">
                  ⚠️ {error}
                </p>
              )}
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button 
                className="w-full bg-maroon-700 hover:bg-maroon-800" 
                type="submit"
                disabled={isFormLoading || isGoogleLoading}
              >
                {isFormLoading ? "Signing in..." : "Sign In"}
              </Button>
              <p className="mt-4 text-sm text-center">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
import { useState, useEffect, useRef, useCallback, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "@/context/AuthContext";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/ui/logo";
import axios from "axios";
import { ADMIN_EMAILS } from "@/constants";

const GOOGLE_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState({
    google: false,
    form: false
  });

  const googleDivRef = useRef<HTMLDivElement>(null);

  const handleCredential = useCallback(async (response: { credential: string }) => {
    setIsLoading(prev => ({ ...prev, google: true }));
    setError("");

    try {
      if (!response?.credential) {
        throw new Error("No credential received from Google");
      }

      const token = response.credential;
      
      // Basic JWT format validation
      if (!/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(token)) {
        throw new Error("Invalid token format");
      }

      await login(token);
      
      const decoded = jwtDecode<{ email: string }>(token);
      const target = ADMIN_EMAILS.includes(decoded.email) 
        ? "/admin-dashboard" 
        : "/dashboard";

      navigate(location.state?.from?.pathname || target, { replace: true });
    } catch (error) {
      console.error("Google login error:", error);
      setError(error instanceof Error ? error.message : "Google login failed");
    } finally {
      setIsLoading(prev => ({ ...prev, google: false }));
    }
  }, [login, navigate, location.state]);

  useEffect(() => {
    if (!googleDivRef.current) return;

    const initializeGoogleAuth = () => {
      try {
        window.google?.accounts?.id.initialize({
          client_id: GOOGLE_ID,
          callback: handleCredential,
          ux_mode: "popup",
          auto_select: false
        });

        window.google?.accounts?.id.renderButton(googleDivRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "rectangular"
        });

        window.google?.accounts?.id.prompt();
      } catch (error) {
        console.error("Google auth initialization failed:", error);
      }
    };

    if (window.google?.accounts?.id) {
      initializeGoogleAuth();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleAuth;
      script.onerror = () => {
        setError("Failed to load Google authentication");
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    }
  }, [handleCredential]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(prev => ({ ...prev, form: true }));
    setError("");

    try {
      const { email, password } = form;
      if (!email || !password) {
        throw new Error("Please fill in all fields");
      }

      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, form);
      const { token } = response.data;

      if (!token) {
        throw new Error("No token received");
      }

      await login(token);
      
      const decoded = jwtDecode<{ email: string }>(token);
      const target = ADMIN_EMAILS.includes(decoded.email) 
        ? "/admin-dashboard" 
        : "/dashboard";

      navigate(location.state?.from?.pathname || target, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Login failed");
      } else {
        setError(error instanceof Error ? error.message : "Login failed");
      }
    } finally {
      setIsLoading(prev => ({ ...prev, form: false }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    if (error) setError("");
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

          <div ref={googleDivRef} className="flex justify-center my-4">
            {isLoading.google && <p className="text-sm">Loading Google login...</p>}
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
                  disabled={isLoading.form}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={isLoading.form}
                  required
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
                disabled={isLoading.form || isLoading.google}
              >
                {isLoading.form ? "Signing in..." : "Sign In"}
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
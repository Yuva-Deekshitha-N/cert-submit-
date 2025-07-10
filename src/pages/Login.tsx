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
import { ADMIN_EMAILS } from "@/pages/AdminDashboard"; // Adjust path as needed

const GOOGLE_ID = "319314674536-fq5ha9ltheldhm376k54keo35hhbdmfq.apps.googleusercontent.com";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const googleDivRef = useRef<HTMLDivElement>(null);

  /** Handle Google One-Tap login */
  const handleCredential = useCallback((response: any) => {
    const token = response.credential;
    login(token);

    const decoded: any = jwtDecode(token);
    const target = ADMIN_EMAILS.includes(decoded.email) ? "/admin-dashboard" : "/dashboard";

    navigate(location.state?.from?.pathname || target, { replace: true });
  }, [login, navigate, location.state]);

  useEffect(() => {
    if (!googleDivRef.current) return;

    const inject = () => {
      // @ts-ignore
      window.google.accounts.id.initialize({ client_id: GOOGLE_ID, callback: handleCredential });
      // @ts-ignore
      window.google.accounts.id.renderButton(googleDivRef.current, {
        theme: "outline", size: "large"
      });
    };

    if (window.google?.accounts?.id) {
      inject();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = inject;
    document.body.appendChild(script);

    return () => { document.body.removeChild(script); };
  }, [handleCredential]);

  /** Handle input field changes */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.id]: e.target.value });

  /** Handle email/password login */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const { email, password } = form;

    if (!email || !password) {
      setError("Please enter credentials.");
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, form);
      const { token } = res.data;

      login(token); // AuthContext will decode and store user

      const decoded: any = jwtDecode(token);
      const target = ADMIN_EMAILS.includes(decoded.email) ? "/admin-dashboard" : "/dashboard";

      navigate(location.state?.from?.pathname || target, { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Login failed.";
      setError(msg);
    }
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

          {/* Google button mounts here */}
          <div ref={googleDivRef} className="flex justify-center my-4" />

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email / Student ID</Label>
                <Input id="email" value={form.email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={form.password} onChange={handleChange} />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button className="w-full bg-maroon-700 hover:bg-maroon-800" type="submit">
                Sign In
              </Button>
              <p className="mt-4 text-sm text-center">
                Don’t have an account? <Link to="/register" className="text-blue-600">Sign up</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;
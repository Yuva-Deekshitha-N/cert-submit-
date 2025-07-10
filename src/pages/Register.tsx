import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GoogleLogin from "@/components/GoogleLogin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/ui/logo";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    studentId: "",
    program: "",
    year: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleGoogleLogin = (user: { name: string; email: string; picture: string }) => {
    localStorage.setItem("username", user.name);
    localStorage.setItem("email", user.email);
    login(user);
    navigate("/dashboard", { replace: true });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.id]: e.target.value });

  const handleSelectChange = (id: string, value: string) =>
    setForm({ ...form, [id]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.studentId ||
      !form.program ||
      !form.year ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("All fields are required.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const fullName = `${form.firstName} ${form.lastName}`;

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
        name: fullName,
        email: form.email,
        password: form.password,
      });

      const { token, user } = res.data;

      // Store in context (or localStorage)
      login({ ...user, token });

      // Navigate based on role
      const target = user.role === "admin" ? "/admin-dashboard" : "/dashboard";
      navigate(target, { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || "Registration failed.";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full">
        <div className="mb-8 text-center">
          <Logo className="mx-auto mb-6" />
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground">Register to manage your certificates</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Enter your details to create an account</CardDescription>
          </CardHeader>

          {/* Google Sign-in */}
          <div className="flex justify-center mt-4 mb-6">
            <GoogleLogin onLogin={handleGoogleLogin} />
          </div>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First name</Label>
                  <Input id="firstName" value={form.firstName} onChange={handleChange} placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last name</Label>
                  <Input id="lastName" value={form.lastName} onChange={handleChange} placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={handleChange} placeholder="student@university.edu" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentId">Student ID</Label>
                <Input id="studentId" value={form.studentId} onChange={handleChange} placeholder="e.g., 23011A6603" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="program">Program</Label>
                <Select onValueChange={(value) => handleSelectChange("program", value)} value={form.program}>
                  <SelectTrigger id="program">
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="btech-cse">B.Tech Computer Science</SelectItem>
                    <SelectItem value="btech-ece">B.Tech Electronics</SelectItem>
                    <SelectItem value="btech-eee">B.Tech Electrical</SelectItem>
                    <SelectItem value="btech-civil">B.Tech Civil</SelectItem>
                    <SelectItem value="btech-mech">B.Tech Mechanical</SelectItem>
                    <SelectItem value="mtech">M.Tech Programs</SelectItem>
                    <SelectItem value="mba">MBA</SelectItem>
                    <SelectItem value="mca">MCA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year of Study</Label>
                <Select onValueChange={(value) => handleSelectChange("year", value)} value={form.year}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1st Year</SelectItem>
                    <SelectItem value="2">2nd Year</SelectItem>
                    <SelectItem value="3">3rd Year</SelectItem>
                    <SelectItem value="4">4th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={form.password} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
            </CardContent>

            <CardFooter className="flex flex-col">
              <Button className="w-full bg-maroon-700 hover:bg-maroon-800" type="submit">
                Create Account
              </Button>
              <p className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;

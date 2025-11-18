"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login Failed: " + error.message);
      return;
    }

    if (data.session) {
      // Wait a bit for cookies to be set
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.href = "/blog";
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#0F1115' }}>
      <div className="w-full max-w-md">
        <div className="card p-8">
          {/* Logo/Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#E5E5E5' }}>
              Blogguu
            </h1>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#E5E5E5' }}>
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2.5 text-sm rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ 
                  backgroundColor: '#1A1C1F',
                  border: '1px solid #2A2D35',
                  color: '#E5E5E5',
                  '--tw-ring-color': '#4AD7FF'
                }}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#E5E5E5' }}>
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2.5 text-sm rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ 
                  backgroundColor: '#1A1C1F',
                  border: '1px solid #2A2D35',
                  color: '#E5E5E5',
                  '--tw-ring-color': '#4AD7FF'
                }}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                suppressHydrationWarning
              />
            </div>

            <button
              onClick={handleLogin}
              className="btn-primary w-full text-black py-2.5 px-4 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F1115]"
              style={{ 
                '--tw-ring-color': '#4AD7FF'
              }}
            >
              Sign in
            </button>
          </div>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              Don't have an account?{" "}
              <a href="/signup" className="font-medium hover:opacity-80 transition-opacity" style={{ color: '#4AD7FF' }}>
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

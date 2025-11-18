"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  }

  // Don't show navbar on login/signup pages
  if (pathname === "/login" || pathname === "/signup" || !user) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50" style={{ backgroundColor: '#1A1C1F', borderBottom: '1px solid #2A2D35' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center">
            <a 
              href="/blog" 
              className="text-xl font-semibold hover:opacity-80 transition-opacity"
              style={{ color: '#E5E5E5' }}
            >
              Blogguu
            </a>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs hidden sm:block" style={{ color: '#9CA3AF' }}>
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md text-sm font-medium transition-all hover:border-[#00E0B8] hover:text-[#00E0B8]"
              style={{ 
                backgroundColor: '#1A1C1F',
                border: '1px solid #2A2D35',
                color: '#E5E5E5'
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}


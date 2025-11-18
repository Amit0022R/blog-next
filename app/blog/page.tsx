import { createClient } from "@/lib/supabaseServer";
import BlogPostsList from "@/components/BlogPostsList";

export default async function BlogHome() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: posts, error } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0F1115' }}>
        <div className="card p-8">
          <p style={{ color: '#EF4444' }}>Error loading posts: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0F1115' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1" style={{ color: '#E5E5E5' }}>
              Blog Posts
            </h1>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>All your blog posts in one place</p>
          </div>
          <a 
            href="/blog/create" 
            className="btn-primary text-black px-4 py-2 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F1115]"
            style={{ 
              '--tw-ring-color': '#4AD7FF'
            }}
          >
            Create Post
          </a>
        </div>

        {/* Posts Grid */}
        <BlogPostsList posts={posts} />
      </div>
    </div>
  );
}

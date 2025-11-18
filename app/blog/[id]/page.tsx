import { createClient } from "@/lib/supabaseServer";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BlogDetails({ params }: PageProps) {
  const supabase = await createClient();
  const { id } = await params;
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#0F1115' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8 md:p-10">
          {/* Back Button */}
          <a 
            href="/blog" 
            className="inline-flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors hover:opacity-80"
            style={{ color: '#4AD7FF' }}
          >
            ← Back
          </a>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ color: '#E5E5E5' }}>
            {post.title}
          </h1>

          {/* Image */}
          {post.image_url && (
            <div className="mb-6 rounded-lg overflow-hidden">
              <img 
                src={post.image_url} 
                alt={post.title}
                className="w-full h-auto object-cover"
                style={{ maxHeight: '500px' }}
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div className="leading-relaxed whitespace-pre-wrap" style={{ color: '#E5E5E5' }}>
              {post.content}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6" style={{ borderTop: '1px solid #2A2D35' }}>
            <a 
              href="/blog" 
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
              style={{ color: '#4AD7FF' }}
            >
              ← Back to all posts
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

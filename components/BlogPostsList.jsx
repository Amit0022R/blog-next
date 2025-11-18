"use client";
import DeletePostButton from "@/components/DeletePostButton";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";

export default function BlogPostsList({ posts }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts && posts.length > 0 ? (
        posts.map(p => (
          <div
            key={p.id}
            className="card p-0 overflow-hidden hover:border-[#4AD7FF]/30 hover:shadow-lg transition-all"
          >
            <a
              href={`/blog/${p.id}`}
              className="block"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {p.image_url && (
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: '#E5E5E5' }}>
                  {p.title}
                </h2>
                <p className="text-sm line-clamp-3 mb-4" style={{ color: '#9CA3AF' }}>
                  {p.content?.slice(0, 120)}...
                </p>
                <div className="text-xs font-medium mb-2" style={{ color: '#00E0B8' }}>
                  Read more →
                </div>
              </div>
            </a>
            <div className="px-6 pb-4">
              <DeletePostButton postId={p.id} />
          <LikeButton postId={p.id} initialLikes={p.likes || 0} />
          <CommentSection postId={p.id} />
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full">
          <div className="card p-12 text-center">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: '#E5E5E5' }}>No posts yet</h3>
            <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>Get started by creating your first blog post</p>
            <a
              href="/blog/create"
              className="btn-primary inline-block text-black px-4 py-2 rounded-md text-sm font-semibold"
            >
              Create Post
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

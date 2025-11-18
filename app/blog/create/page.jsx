"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function CreateBlog() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setImage(file);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  async function uploadImage(userId) {
    if (!image) return null;

    setUploadingImage(true);
    try {
      const fileExt = image.name.split('.').pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('blog-images')
        .upload(fileName, image, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path);

      setUploadingImage(false);
      return publicUrl;
    } catch (err) {
      setUploadingImage(false);
      throw err;
    }
  }

  async function savePost() {
    if (!title.trim() || !content.trim()) {
      setError("Please fill in both title and content");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        setError("You must be logged in to create a post");
        setLoading(false);
        return;
      }

      // Upload image if selected
      let imageUrl = null;
      if (image) {
        try {
          imageUrl = await uploadImage(user.id);
        } catch (uploadErr) {
          setError("Failed to upload image: " + uploadErr.message);
          setLoading(false);
          return;
        }
      }

      const { error: insertError } = await supabase.from("posts").insert({
        title: title.trim(),
        content: content.trim(),
        user_id: user.id,
        image_url: imageUrl
      });

      if (insertError) {
        setError("Failed to create post: " + insertError.message);
        setLoading(false);
        return;
      }

      router.push("/blog");
    } catch (err) {
      setError("An unexpected error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: '#0F1115' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1" style={{ color: '#E5E5E5' }}>
              Create New Post
            </h1>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>Write and publish your blog post</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="px-4 py-3 rounded-md mb-6" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#EF4444' }}>
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#E5E5E5' }}>
                Title
              </label>
              <input
                type="text"
                className="w-full px-3 py-2.5 text-sm rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ 
                  backgroundColor: '#1A1C1F',
                  border: '1px solid #2A2D35',
                  color: '#E5E5E5',
                  '--tw-ring-color': '#4AD7FF'
                }}
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
                suppressHydrationWarning
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#E5E5E5' }}>
                Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading || uploadingImage}
                className="w-full px-3 py-2.5 text-sm rounded-md focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                style={{ 
                  backgroundColor: '#1A1C1F',
                  border: '1px solid #2A2D35',
                  color: '#E5E5E5',
                  '--tw-ring-color': '#4AD7FF'
                }}
                suppressHydrationWarning
              />
              {imagePreview && (
                <div className="mt-3">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="rounded-md max-h-64 w-auto object-cover"
                    style={{ border: '1px solid #2A2D35' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null);
                      setImagePreview(null);
                    }}
                    className="mt-2 text-xs"
                    style={{ color: '#EF4444' }}
                  >
                    Remove image
                  </button>
                </div>
              )}
              <p className="mt-1.5 text-xs" style={{ color: '#9CA3AF' }}>Max size: 5MB. Supported formats: JPG, PNG, GIF, WebP</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: '#E5E5E5' }}>
                Content
              </label>
              <textarea
                className="w-full px-3 py-2.5 text-sm rounded-md focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-all"
                style={{ 
                  backgroundColor: '#1A1C1F',
                  border: '1px solid #2A2D35',
                  color: '#E5E5E5',
                  '--tw-ring-color': '#4AD7FF'
                }}
                rows={16}
                placeholder="Write your blog post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
                suppressHydrationWarning
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={savePost}
                disabled={loading || uploadingImage}
                className="btn-primary flex-1 text-black px-4 py-2.5 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0F1115] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#4AD7FF] disabled:hover:transform-none"
                style={{ 
                  '--tw-ring-color': '#4AD7FF'
                }}
              >
                {uploadingImage ? "Uploading image..." : loading ? "Publishing..." : "Publish Post"}
              </button>
              <a
                href="/blog"
                className="px-4 py-2.5 rounded-md text-sm font-medium transition-colors text-center hover:border-[#4AD7FF]"
                style={{ 
                  backgroundColor: '#1A1C1F',
                  border: '1px solid #2A2D35',
                  color: '#E5E5E5'
                }}
              >
                Cancel
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

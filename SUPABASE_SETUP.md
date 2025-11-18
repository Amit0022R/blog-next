# Supabase Setup Guide - Important!

## Fix "Database error saving new user" Error

यह error आता है जब Supabase में Email Confirmation enable होता है। इसे disable करना होगा:

### Step 1: Supabase Dashboard में जाएं

1. [Supabase Dashboard](https://app.supabase.com) खोलें
2. अपना project select करें

### Step 2: Email Confirmation Disable करें

1. Left sidebar में **Authentication** → **Settings** पर click करें
2. **Email Auth** section में scroll करें
3. **"Enable email confirmations"** को **OFF** करें
4. **Save** button click करें

### Step 3: Database Table बनाएं

SQL Editor में यह query run करें:

```sql
-- Create posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all posts
CREATE POLICY "Anyone can read posts" ON posts
  FOR SELECT USING (true);

-- Create policy to allow users to insert their own posts
CREATE POLICY "Users can insert their own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own posts
CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own posts
CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.uid() = user_id);
```

### Step 4: Environment Variables Check करें

`.env.local` file में ये variables होने चाहिए:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: App Restart करें

1. Terminal में `Ctrl+C` दबाकर server stop करें
2. फिर से `npm run dev` run करें

अब signup करने पर directly blog page खुलेगा! 🎉

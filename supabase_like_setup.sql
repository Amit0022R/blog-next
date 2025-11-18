-- Create a table to store which user liked which post
create table if not exists post_likes (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid references posts(id) on delete cascade,
  user_id uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc', now()),
  unique (post_id, user_id)
);

-- Add a trigger to increment likes on insert and decrement on delete
create or replace function handle_post_like()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update posts set likes = coalesce(likes, 0) + 1 where id = new.post_id;
    return new;
  elsif tg_op = 'DELETE' then
    update posts set likes = greatest(coalesce(likes, 1) - 1, 0) where id = old.post_id;
    return old;
  end if;
end;
$$ language plpgsql;

drop trigger if exists post_like_trigger on post_likes;
create trigger post_like_trigger
  after insert or delete on post_likes
  for each row execute function handle_post_like();

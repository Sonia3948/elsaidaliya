
-- Delete all data from tables in the correct order to respect foreign key constraints
-- Delete notifications first (they reference profiles)
DELETE FROM public.notifications;

-- Delete offers (they reference profiles)
DELETE FROM public.offers;

-- Delete listings (they reference profiles)
DELETE FROM public.listings;

-- Delete all profiles (this will also delete associated auth users due to CASCADE)
DELETE FROM public.profiles;

-- Reset sequences if needed (optional, for clean IDs)
-- Note: UUIDs don't use sequences, so this is not necessary for your schema

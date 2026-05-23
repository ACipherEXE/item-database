import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "http://192.168.1.23:54321";
const supabaseKey = "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH"; // paste the anon key from earlier

export const supabase = createClient(supabaseUrl, supabaseKey);

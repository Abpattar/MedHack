import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://txrhqmktuahplavytoex.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR4cmhxbWt0dWFocGxhdnl0b2V4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxOTU0ODcsImV4cCI6MjA4Nzc3MTQ4N30.Xe2f4RiMu5OI48i-drzGXvIvdroYTkibrjyecOi8Qgo";

export const supabase = createClient(supabaseUrl, supabaseKey);
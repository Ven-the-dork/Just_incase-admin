import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zylwkjgetiiewdlzxmdr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5bHdramdldGlpZXdkbHp4bWRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzIxNTE3OCwiZXhwIjoyMDc4NzkxMTc4fQ.lI_XkiChzdGv7G5uxZvTO91ay3prA0mD6wRyfqly4pc";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

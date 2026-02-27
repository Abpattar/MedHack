import { createClient } from '@supabase/supabase-js'

const logsUrl = 'https://qadafvyyssyqhfwyjuid.supabase.co'
const logsAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhZGFmdnl5c3N5cWhmd3lqdWlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMDA1MTcsImV4cCI6MjA4Nzc3NjUxN30.n9ZKzw9o1W_ZQSQoGAX3pGGP3MWr6qj5cRgC95d8zYU'

export const supabaseLogs = createClient(logsUrl, logsAnonKey)
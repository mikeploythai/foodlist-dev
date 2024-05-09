# !/bin/bash

source .env.local

pnpm dlx supabase gen types typescript --project-id "$PROJECT_ID" --schema public > src/utils/supabase/types.ts

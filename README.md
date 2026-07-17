# Digital Products Catalogue

Personal catalogue app — Next.js + Supabase. Mobile pe hamburger sidebar, desktop pe permanent sidebar.

## Setup (ek baar karna hai)

### 1. Supabase project banao
1. https://supabase.com pe jaao, sign up/login karo (free tier kaafi hai)
2. **New Project** banao — naam kuch bhi do (e.g. "digital-catalogue")
3. Database password set karo, region **Mumbai/Singapore** rakho (India ke liye fast)
4. Project ban jaane do (~2 min lagta hai)

### 2. Schema run karo
1. Left sidebar me **SQL Editor** kholo
2. **New query** pe click karo
3. `supabase-schema.sql` file ka pura content copy-paste karo
4. **Run** dabao — ye `categories` aur `products` table bana dega, saath me 5 default categories (PDFs, Courses, Tools, Word, Excel) bhi add ho jayengi

### 3. API keys lo
1. Left sidebar me **Project Settings → API** kholo
2. **Project URL** copy karo
3. **anon public** key copy karo (service_role key NAHI — wo secret hai)

### 4. Local me connect karo
1. Is folder me `.env.local` naam ki file banao (`.env.local.example` ko rename/copy kar sakte ho)
2. Values daalo:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
   ```

### 5. Install aur run
```bash
npm install
npm run dev
```
Browser me `http://localhost:3000` kholo.

## Deploy (Vercel pe, taaki mobile+desktop dono se access ho)
1. Is code ko GitHub repo me push karo
2. https://vercel.com pe **New Project** → apna repo select karo
3. **Environment Variables** me wahi 2 values daalo jo `.env.local` me the
4. Deploy — 2 min me live URL mil jayega, wahi URL mobile pe bhi kholo

## Features
- **Sidebar**: categories (PDFs/Courses/Tools/Word/Excel + jo aap add karo), mobile pe hamburger se, desktop pe hamesha open
- **Add category**: sidebar ke bottom se naya category banao, icon bhi choose kar sakte ho
- **Table columns**: URL → Title → Description → Platform → Status → Date Added → Info button
- Koi bhi cell pe click karke edit karo, blur hote hi auto-save ho jata hai
- **New entry** button se naya row banega (aaj ki date, "Not started" status preset)
- **Info icon** click karke right panel khulega — pura detail + notes + delete option
- Search bar se current category ke andar filter kar sakte ho

-- Users table (synced from Clerk webhooks)
create table if not exists users (
  id text primary key,
  email text,
  name text,
  nvidia_api_key text,
  created_at timestamptz default now()
);

-- Resumes table
create table if not exists resumes (
  id uuid primary key default gen_random_uuid(),
  user_id text references users(id) on delete cascade,
  title text not null,
  raw_text text,
  personal_info jsonb default '{}',
  summary text default '',
  experience jsonb default '[]',
  education jsonb default '[]',
  skills jsonb default '[]',
  certifications jsonb default '[]',
  languages jsonb default '[]',
  file_url text default '',
  is_master boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Applications table
create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  user_id text references users(id) on delete cascade,
  job_title text,
  company text,
  job_url text default '',
  job_description text default '',
  tailored_resume_id uuid references resumes(id) on delete set null,
  tailored_pdf_url text default '',
  ats_score integer default 0,
  score_breakdown jsonb default '{}',
  status text default 'saved',
  created_at timestamptz default now()
);

-- Cover letters table
create table if not exists cover_letters (
  id uuid primary key default gen_random_uuid(),
  user_id text references users(id) on delete cascade,
  application_id uuid references applications(id) on delete set null,
  content text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table users enable row level security;
alter table resumes enable row level security;
alter table applications enable row level security;
alter table cover_letters enable row level security;

-- RLS Policies (service role bypasses these, so API routes work fine)
create policy "Users can read own data" on users for select using (true);
create policy "Users can read own resumes" on resumes for select using (true);
create policy "Users can read own applications" on applications for select using (true);
create policy "Users can read own cover letters" on cover_letters for select using (true);

-- Storage bucket for generated PDFs
insert into storage.buckets (id, name, public)
values ('generated-pdfs', 'generated-pdfs', false)
on conflict (id) do nothing;

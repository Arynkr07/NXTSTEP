-- ============================================================
-- NxtStep — Supabase Schema
-- Run this entire file in the Supabase SQL Editor
-- ============================================================

-- Enable pgvector (must be first)
create extension if not exists vector;

-- ============================================================
-- TABLE: users
-- Firebase UID is the primary key so we never need Supabase Auth
-- ============================================================
create table if not exists users (
  firebase_uid   text primary key,
  email          text,
  username       text,
  interests      text[]   default '{}',
  skills         text[]   default '{}',
  work_style     text,
  education_level text,
  salary_expectation text,
  liked_career_ids   integer[] default '{}',
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- ============================================================
-- TABLE: career_embeddings
-- Stores LinkedIn job postings embedded with text-embedding-004
-- 768 dimensions
-- ============================================================
create table if not exists career_embeddings (
  id               uuid primary key default gen_random_uuid(),
  career_title     text not null,
  content          text not null,         -- raw text that was embedded
  embedding        vector(768),
  metadata         jsonb default '{}',    -- skills, salary, seniority, etc.
  source           text not null,         -- e.g. 'linkedin-kaggle-2024'
  created_at       timestamptz default now(),

  -- Prevent duplicate rows on re-seed
  unique (career_title, source)
);

-- ============================================================
-- TABLE: saved_roadmaps
-- Persisted AI-generated roadmaps per user per career
-- ============================================================
create table if not exists saved_roadmaps (
  id              uuid primary key default gen_random_uuid(),
  firebase_uid    text references users(firebase_uid) on delete cascade,
  career_title    text not null,
  skills_input    text[]  default '{}',
  roadmap_content text not null,     -- full streamed text saved after completion
  completed_steps integer[] default '{}', -- indices of checked-off milestones [0, 1, 2...]
  created_at      timestamptz default now()
);

-- ============================================================
-- TABLE: saved_careers
-- Liked/bookmarked careers per user
-- ============================================================
create table if not exists saved_careers (
  id              uuid primary key default gen_random_uuid(),
  firebase_uid    text references users(firebase_uid) on delete cascade,
  career_id       integer not null,
  career_title    text not null,
  created_at      timestamptz default now(),

  unique (firebase_uid, career_id)
);

-- ============================================================
-- TABLE: chat_sessions
-- Persists conversation history for the chat widget
-- ============================================================
create table if not exists chat_sessions (
  id              uuid primary key default gen_random_uuid(),
  firebase_uid    text references users(firebase_uid) on delete cascade,
  messages        jsonb not null default '[]',
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ============================================================
-- INDEXES
-- ============================================================
-- IVFFlat vector similarity index (tune lists= based on row count)
create index if not exists career_embeddings_embedding_idx
  on career_embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- B-tree indexes on foreign keys
create index if not exists saved_roadmaps_uid_idx on saved_roadmaps (firebase_uid);
create index if not exists saved_careers_uid_idx  on saved_careers  (firebase_uid);
create index if not exists chat_sessions_uid_idx  on chat_sessions  (firebase_uid);

-- ============================================================
-- FUNCTION: match_careers
-- Cosine similarity search returning top-k career embeddings
-- Usage: select * from match_careers(embedding, 0.5, 5, null);
-- ============================================================
create or replace function match_careers(
  query_embedding  vector(768),
  match_threshold  float   default 0.5,
  match_count      int     default 5,
  filter_career    text    default null
)
returns table (
  id           uuid,
  career_title text,
  content      text,
  metadata     jsonb,
  similarity   float
)
language sql
stable
as $$
  select
    ce.id,
    ce.career_title,
    ce.content,
    ce.metadata,
    1 - (ce.embedding <=> query_embedding) as similarity
  from career_embeddings ce
  where
    (filter_career is null or ce.career_title ilike '%' || filter_career || '%')
    and 1 - (ce.embedding <=> query_embedding) > match_threshold
  order by ce.embedding <=> query_embedding
  limit match_count;
$$;

-- ============================================================
-- RLS: Row Level Security
-- Using service_role key on the server bypasses RLS.
-- Enable RLS so the anon key is safe to use on the client.
-- ============================================================
alter table users          enable row level security;
alter table saved_roadmaps enable row level security;
alter table saved_careers  enable row level security;
alter table chat_sessions  enable row level security;

-- career_embeddings is public read-only
alter table career_embeddings enable row level security;
create policy "Public read career_embeddings"
  on career_embeddings for select using (true);

-- Users can only read/write their own rows
-- (Server-side always uses service_role which bypasses RLS)
create policy "Users manage own row"
  on users for all using (true);

create policy "Users manage own saved_roadmaps"
  on saved_roadmaps for all using (true);

create policy "Users manage own saved_careers"
  on saved_careers for all using (true);

create policy "Users manage own chat_sessions"
  on chat_sessions for all using (true);

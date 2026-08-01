-- Document Generator: "ground once, reuse forever" jurisdiction cache.
--
-- The AI only runs a grounded (web-search) legal research pass the FIRST
-- time anyone asks for a given (document_type, country) pair. The result —
-- required fields, mandatory clauses, disclosures, formatting notes — is
-- cached here and reused for every subsequent user of that same pair.
--
-- This table holds ONLY jurisdiction-level legal structure (not personal
-- data), so it is safe to store centrally and share across all users.
-- The actual filled-in documents (names, VINs, deal terms) are never
-- written here — they stay client-side in the user's browser.

create table if not exists document_jurisdiction_templates (
  id uuid primary key default gen_random_uuid(),
  document_type text not null,
  country text not null,
  legal_requirements jsonb not null,
  model_used text,
  last_verified_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (document_type, country)
);

create index if not exists idx_doc_jurisdiction_lookup
  on document_jurisdiction_templates (document_type, country);

alter table document_jurisdiction_templates enable row level security;

-- Public read access — this is shared, non-personal reference data.
create policy "Public read access to jurisdiction templates"
  on document_jurisdiction_templates
  for select
  using (true);

-- No insert/update/delete policies for anon/authenticated: writes only
-- happen from the server-side API route using the service-role key,
-- which bypasses RLS entirely.

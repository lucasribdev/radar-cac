create table public.submissions (
  id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  result public.process_result_enum not null,
  date_protocol date not null,
  date_decision date not null,
  type public.process_type_enum not null,
  om_id bigint null,
  constraint submissions_pkey primary key (id),
  constraint submissions_om_id_fkey foreign KEY (om_id) references oms (id)
) TABLESPACE pg_default;
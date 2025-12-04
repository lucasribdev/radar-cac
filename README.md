## Radar CAC — Estatística comunitária de prazos

Painel colaborativo que reúne, em uma base compartilhada, os prazos de tramitação de processos de Controle de Armas (CAC). Usuários enviam dados anonimizados e o dashboard consolida estatísticas para ajudar a comunidade a acompanhar tempos de análise por OM e tipo de processo.

## Fluxo do usuário

- Envio: em `/submission`, a pessoa informa tipo de processo, OM da PF, datas de protocolo/decisão e resultado; aceita os termos e grava o envio no Supabase (`public.submissions`).
- Consulta: em `/`, escolhe filtros (tipo de processo, OM e período). O app chama RPCs do Supabase para montar:
  - Cards com média/mín/max de dias e total de envios (RPC `get_submissions_stats`).
  - Gráfico de média por mês (últimos 6 meses) com filtros opcionais (RPC `get_submissions_monthly_stats`).
  - Tabela com envios mais recentes (RPC `get_recent_submissions`), também disponível em `/recents`.

## Stack rápida

React 19 + Vite + TanStack Router/Query/Form, Tailwind, Supabase, Vitest, Biome.

## Setup local

1. Clone o repositório  
   `git clone <url-do-repo> && cd radar-cac`
2. Instale dependências  
   `npm install`
3. Crie `.env.local` na raiz com as variáveis do seu projeto Supabase:

```
VITE_SUPABASE_URL=<sua-url-supabase>
VITE_SUPABASE_ANON_KEY=<sua-anon-key>
VITE_RECAPTCHA_SITE_KEY=<sua-recaptcha-key>
```

4. Rode em modo dev (porta 3000 por padrão)  
   `npm run dev`

### Qualidade e testes

- Lint: `npm run lint`
- Format: `npm run format`
- Testes: `npm run test`

## Modelo de dados (Supabase)

Tabela `public.submissions` usada pelo app:

- `id` (`uuid`, PK, default `gen_random_uuid()`)
- `created_at` (`timestamptz`, default `now()`)
- `process_type` (`public.process_type_enum`, not null)
- `om_name` (`text`, not null)
- `result` (`public.process_result_enum`, not null)
- `date_protocol` (`date`, not null)
- `date_decision` (`date`, not null)

Enums esperados:

- `public.process_result_enum`: `DEFERIDO`, `INDEFERIDO`
- `public.process_type_enum`: `CR_OBTER`, `CR_REVALIDAR`, `CR_APOSTILAR`, `CR_CANCELAR`, `AQUISICAO_ARMA_SOLICITAR`, `ARMA_REGISTRAR`, `REGISTRO_ARMA_RENOVAR`, `TRANSFERENCIA_ARMA_CAC_SOLICITAR`, `ALTERAR_NIVEL_ATIRADOR`, `TRANSFERENCIA_ACERVO_MESMO_PROP`, `TRANSFERENCIA_ACERVO_CAC_OBTER`, `TRANSFERENCIA_SI_DP_PARA_CAC_SOLICITAR`, `TRANSFERENCIA_SI_DP_PARA_CAC_OBTER`, `TRANSFERENCIA_CAC_PARA_SI_DP_SOLICITAR`, `TRANSFERENCIA_CAC_PARA_SI_DP_OBTER`, `CR_SEGUNDA_VIA_SOLICITAR`, `CR_SEGUNDA_VIA_OBTER`, `REGISTRO_ARMA_SEGUNDA_VIA_OBTER`, `GUIA_TRÁFEGO_ESPECIAL_OBTER`

DDL recomendada:

```sql
-- Certifique-se de que os tipos enum existem
create type if not exists public.process_result_enum as enum ('DEFERIDO', 'INDEFERIDO');
create type if not exists public.process_type_enum as enum (
  'CR_OBTER',
  'CR_REVALIDAR',
  'CR_APOSTILAR',
  'CR_CANCELAR',
  'AQUISICAO_ARMA_SOLICITAR',
  'ARMA_REGISTRAR',
  'REGISTRO_ARMA_RENOVAR',
  'TRANSFERENCIA_ARMA_CAC_SOLICITAR',
  'ALTERAR_NIVEL_ATIRADOR',
  'TRANSFERENCIA_ACERVO_MESMO_PROP',
  'TRANSFERENCIA_ACERVO_CAC_OBTER',
  'TRANSFERENCIA_SI_DP_PARA_CAC_SOLICITAR',
  'TRANSFERENCIA_SI_DP_PARA_CAC_OBTER',
  'TRANSFERENCIA_CAC_PARA_SI_DP_SOLICITAR',
  'TRANSFERENCIA_CAC_PARA_SI_DP_OBTER',
  'CR_SEGUNDA_VIA_SOLICITAR',
  'CR_SEGUNDA_VIA_OBTER',
  'REGISTRO_ARMA_SEGUNDA_VIA_OBTER',
  'GUIA_TRÁFEGO_ESPECIAL_OBTER'
);

create table if not exists public.submissions (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  process_type public.process_type_enum not null,
  om_name text not null,
  result public.process_result_enum not null,
  date_protocol date not null,
  date_decision date not null,
  constraint submissions_pkey primary key (id)
) tablespace pg_default;
```

Em projetos novos do Supabase, a função `gen_random_uuid()` vem habilitada pelo pacote `pgcrypto`. Se o banco retornar erro, habilite com `create extension if not exists "pgcrypto";`.

### RPCs necessárias

Função para métricas agregadas com filtros opcionais (`get_submissions_stats`):

```sql
create or replace function public.get_submissions_stats(
  p_om_name text default null,
  p_period_to_days integer default null,
  p_process_type public.process_type_enum default null
)
returns table (
  "avgDays" integer,
  "minDays" integer,
  "maxDays" integer,
  "total"  bigint
)
language sql
as $$
  select
    avg((date_decision - date_protocol))::int as "avgDays",
    min((date_decision - date_protocol))::int as "minDays",
    max((date_decision - date_protocol))::int as "maxDays",
    count(*)                        as "total"
  from public.submissions
  where
    (p_om_name is null or om_name = p_om_name)
    and (p_process_type is null or process_type = p_process_type)
    and (
      p_period_to_days is null
      or date_decision >= current_date - p_period_to_days
    );
$$;
```

Função para média de dias por mês (últimos 6 meses), com filtros opcionais (`get_submissions_monthly_stats`):

```sql
create or replace function public.get_submissions_monthly_stats(
  p_om_name text default null,
  p_process_type public.process_type_enum default null
)
returns table (
  "month" text,
  "avgDays" integer
)
language sql
as $$
  with months as (
    select
      (date_trunc('month', current_date) - (i * interval '1 month'))::date as month_start
    from generate_series(0, 5) as i
  ), translated as (
    select
      extract(month from m.month_start) as month_number,
      avg((s.date_decision - s.date_protocol))::int as avg_days,
      m.month_start
    from months m
    left join public.submissions s
      on date_trunc('month', s.date_decision) = m.month_start
      and (p_om_name is null or s.om_name = p_om_name)
      and (p_process_type is null or s.process_type = p_process_type)
    group by m.month_start
  )
  select
    case month_number
      when 1 then 'Jan'
      when 2 then 'Fev'
      when 3 then 'Mar'
      when 4 then 'Abr'
      when 5 then 'Mai'
      when 6 then 'Jun'
      when 7 then 'Jul'
      when 8 then 'Ago'
      when 9 then 'Set'
      when 10 then 'Out'
      when 11 then 'Nov'
      when 12 then 'Dez'
    end as "month",
    avg_days as "avgDays"
  from translated
  order by month_start;
$$;
```

Função para listar envios mais recentes (com filtros opcionais e limite) (`get_recent_submissions`):

```sql
create or replace function public.get_recent_submissions(
  p_om_name text default null,
  p_process_type public.process_type_enum default null,
  p_limit integer default 10
)
returns table (
  "id" uuid,
  "omName" text,
  "processType" public.process_type_enum,
  "avgDays" integer,
  "result" public.process_result_enum,
  "createdAt" timestamp with time zone
)
language sql
as $$
  select
    s.id as "id",
    s.om_name as "omName",
    s.process_type as "processType",
    (s.date_decision - s.date_protocol)::int as "avgDays",
    s.result as "result",
    s.created_at as "createdAt"
  from public.submissions s
  where
    (p_om_name is null or s.om_name = p_om_name)
    and (p_process_type is null or s.process_type = p_process_type)
  order by
    s.date_decision desc,
    s.created_at desc
  limit p_limit;
$$;
```

Com essas definições e variáveis de ambiente, qualquer dev consegue subir o projeto localmente e usar o painel de estatística comunitária.

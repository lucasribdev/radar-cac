Welcome to your new TanStack app!

# Getting Started

To run this application:

```bash
npm install
npm run start
```

# Building For Production

To build this application for production:

```bash
npm run build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
npm run test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.

## Supabase

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
- `public.process_type_enum`: `CR`, `AUTORIZACAO_COMPRA`, `CRAF`, `GUIA_TRAFEGO`

DDL recomendada:

```sql
-- Certifique-se de que os tipos enum existem
create type if not exists public.process_result_enum as enum ('DEFERIDO', 'INDEFERIDO');
create type if not exists public.process_type_enum as enum ('CR', 'AUTORIZACAO_COMPRA', 'CRAF', 'GUIA_TRAFEGO');

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

### RPC de estatísticas

Função usada para métricas agregadas, com filtros opcionais por OM, tipo de processo e período (últimos N dias):

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
    -- filtro opcional por om_name
    (p_om_name is null or om_name = p_om_name)
    -- filtro opcional por process_type
    and (p_process_type is null or process_type = p_process_type)
    -- filtro opcional por período em dias (últimos N dias)
    and (
      p_period_to_days is null
      or date_decision >= current_date - p_period_to_days
    );
$$;
```

Ela espera que `date_decision` e `date_protocol` estejam preenchidos para calcular as diferenças de dias.

### RPC de estatísticas mensais

Função para média de dias por mês (últimos 6 meses), com filtros opcionais por OM e tipo de processo:

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

### RPC de envios recentes

Função para listar envios mais recentes (com filtros opcionais por OM e tipo):

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

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:

```bash
npm run lint
npm run format
npm run check
```

## Shadcn

Add components using the latest version of [Shadcn](https://ui.shadcn.com/).

```bash
pnpx shadcn@latest add button
```

## Routing

This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
});
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
npm install @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).

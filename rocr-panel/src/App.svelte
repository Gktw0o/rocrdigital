<script>
  import { onMount } from "svelte";
  import Router from "svelte-spa-router";
  import { theme } from "./lib/stores/theme.js";
  import Sidebar from "./lib/components/Sidebar.svelte";
  import Header from "./lib/components/Header.svelte";
  import Dashboard from "./lib/pages/Dashboard.svelte";
  import Contacts from "./lib/pages/Contacts.svelte";
  import Partners from "./lib/pages/Partners.svelte";
  import Services from "./lib/pages/Services.svelte";
  import Content from "./lib/pages/Content.svelte";
  import Team from "./lib/pages/Team.svelte";
  import Settings from "./lib/pages/Settings.svelte";

  const routes = {
    "/": Dashboard,
    "/contacts": Contacts,
    "/partners": Partners,
    "/services": Services,
    "/content": Content,
    "/team": Team,
    "/settings": Settings,
  };

  let sidebarCollapsed = $state(false);

  onMount(() => {
    theme.init();
  });
</script>

<div class="flex h-screen w-screen overflow-hidden" style="background: var(--bg);">
  <Sidebar bind:collapsed={sidebarCollapsed} />
  <div class="flex flex-1 flex-col overflow-hidden">
    <Header collapsed={sidebarCollapsed} />
    <main class="flex-1 overflow-y-auto p-6" style="background: var(--bg);">
      <Router {routes} />
    </main>
  </div>
</div>

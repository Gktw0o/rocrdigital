<script>
  import { onMount } from "svelte";
  import Router from "svelte-spa-router";
  import { auth } from "./lib/stores/auth.js";
  import { theme } from "./lib/stores/theme.js";
  import Sidebar from "./lib/components/Sidebar.svelte";
  import Header from "./lib/components/Header.svelte";
  import Login from "./lib/pages/Login.svelte";
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
  let isInitializing = $state(true);

  onMount(async () => {
    theme.init();
    await auth.init();
    isInitializing = false;
  });
</script>

{#if isInitializing}
  <!-- Loading Screen -->
  <div class="loading-screen">
    <div class="loading-content">
      <div class="loading-logo">
        <span class="logo-text">ROCR</span>
        <span class="logo-dot">.</span>
      </div>
      <div class="loading-spinner"></div>
    </div>
  </div>
{:else if !auth.isAuthenticated}
  <!-- Login Page -->
  <Login />
{:else}
  <!-- Authenticated App -->
  <div
    class="flex h-screen w-screen overflow-hidden"
    style="background: var(--bg);"
  >
    <Sidebar bind:collapsed={sidebarCollapsed} />
    <div class="flex flex-1 flex-col overflow-hidden">
      <Header collapsed={sidebarCollapsed} />
      <main class="flex-1 overflow-y-auto p-6" style="background: var(--bg);">
        <Router {routes} />
      </main>
    </div>
  </div>
{/if}

<style>
  .loading-screen {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  }

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .loading-logo {
    display: flex;
    align-items: center;
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: -0.03em;
  }

  .logo-text {
    color: #fff;
  }

  .logo-dot {
    color: #3b82f6;
    font-size: 3.5rem;
    line-height: 1;
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid rgba(255, 255, 255, 0.1);
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>

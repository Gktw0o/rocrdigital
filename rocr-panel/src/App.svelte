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
  import Projects from "./lib/pages/Projects.svelte";
  import Calendar from "./lib/pages/Calendar.svelte";
  import Schedule from "./lib/pages/Schedule.svelte";
  import TimeTracking from "./lib/pages/TimeTracking.svelte";

  const routes = {
    "/": Dashboard,
    "/contacts": Contacts,
    "/partners": Partners,
    "/services": Services,
    "/content": Content,
    "/team": Team,
    "/settings": Settings,
    "/projects": Projects,
    "/calendar": Calendar,
    "/schedule": Schedule,
    "/time": TimeTracking,
  };

  let sidebarCollapsed = $state(false);
  let isInitializing = $state(true);
  let isAuthenticated = $state(false);

  // Subscribe to auth store for reactive updates
  auth.subscribe((user) => {
    isAuthenticated = !!user;
  });

  onMount(async () => {
    console.log("App initializing...");
    theme.init();

    try {
      await auth.init();
      console.log("Auth initialized, authenticated:", auth.isAuthenticated);
    } catch (err) {
      console.error("Auth init error:", err);
    }

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
      <p class="loading-text">Loading...</p>
    </div>
  </div>
{:else if !isAuthenticated}
  <!-- Login Page -->
  <Login />
{:else}
  <!-- Authenticated App -->
  <div class="app-container">
    <Sidebar bind:collapsed={sidebarCollapsed} />
    <div class="main-content">
      <Header collapsed={sidebarCollapsed} />
      <main class="page-content">
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

  .loading-text {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.875rem;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .app-container {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background: var(--bg);
  }

  .main-content {
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: hidden;
  }

  .page-content {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    background: var(--bg);
  }
</style>

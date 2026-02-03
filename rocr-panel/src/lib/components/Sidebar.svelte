<script>
  import { link, location } from "svelte-spa-router";
  import {
    LayoutDashboard,
    FolderKanban,
    Calendar,
    CalendarDays,
    Mail,
    Handshake,
    Briefcase,
    FileText,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    Zap,
  } from "lucide-svelte";

  let { collapsed = $bindable(false) } = $props();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/projects", label: "Projeler", icon: FolderKanban },
    { path: "/calendar", label: "Takvim", icon: Calendar },
    { path: "/schedule", label: "Program", icon: CalendarDays },
    { separator: true, label: "İçerik" },
    { path: "/contacts", label: "Mesajlar", icon: Mail },
    { path: "/partners", label: "Partnerler", icon: Handshake },
    { path: "/services", label: "Servisler", icon: Briefcase },
    { path: "/content", label: "İçerik", icon: FileText },
    { path: "/team", label: "Ekip", icon: Users },
    { separator: true, label: "Sistem" },
    { path: "/settings", label: "Ayarlar", icon: Settings },
  ];

  function isActive(path) {
    if (path === "/") return $location === "/";
    return $location.startsWith(path);
  }
</script>

<aside class="sidebar" class:collapsed>
  <!-- Logo -->
  <div class="logo">
    {#if !collapsed}
      <div class="logo-icon">
        <Zap size={20} />
      </div>
      <span class="logo-text">ROCR Panel</span>
    {:else}
      <div class="logo-icon small">
        <Zap size={16} />
      </div>
    {/if}
  </div>

  <!-- Navigation -->
  <nav class="nav">
    {#each navItems as item}
      {#if item.separator}
        <div class="separator">
          {#if !collapsed}
            <span>{item.label}</span>
          {/if}
        </div>
      {:else}
        <a
          href={item.path}
          use:link
          class="nav-item"
          class:active={isActive(item.path)}
        >
          <span class="nav-icon">
            <item.icon size={20} />
          </span>
          {#if !collapsed}
            <span class="nav-label">{item.label}</span>
          {/if}
        </a>
      {/if}
    {/each}
  </nav>

  <!-- Collapse Button -->
  <div class="collapse-area">
    <button class="collapse-btn" onclick={() => (collapsed = !collapsed)}>
      {#if collapsed}
        <ChevronRight size={18} />
      {:else}
        <ChevronLeft size={18} />
        <span>Daralt</span>
      {/if}
    </button>
  </div>
</aside>

<style>
  .sidebar {
    width: 260px;
    height: 100%;
    background: var(--bg-secondary);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    transition: width 0.2s ease;
  }

  .sidebar.collapsed {
    width: 72px;
  }

  /* Logo */
  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 72px;
    padding: 0 24px;
    border-bottom: 1px solid var(--border);
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    background: var(--primary);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }

  .logo-icon.small {
    width: 32px;
    height: 32px;
    margin: auto;
  }

  .logo-text {
    font-size: 18px;
    font-weight: 700;
    color: var(--text);
  }

  /* Navigation */
  .nav {
    flex: 1;
    overflow-y: auto;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .separator {
    padding: 16px 12px 8px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
  }

  .sidebar.collapsed .separator {
    padding: 12px 0;
    border-top: 1px solid var(--border);
    margin: 8px 12px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 16px;
    border-radius: var(--radius-sm);
    text-decoration: none;
    color: var(--text-secondary);
    transition: all 0.15s;
  }

  .nav-item:hover {
    background: var(--bg-tertiary);
    color: var(--text);
  }

  .nav-item.active {
    background: var(--primary);
    color: white;
  }

  .nav-icon {
    display: flex;
    flex-shrink: 0;
  }

  .nav-label {
    font-size: 14px;
    font-weight: 500;
  }

  .sidebar.collapsed .nav-item {
    justify-content: center;
    padding: 14px;
  }

  /* Collapse */
  .collapse-area {
    padding: 16px 12px;
    border-top: 1px solid var(--border);
  }

  .collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-secondary);
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  .collapse-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text);
  }
</style>

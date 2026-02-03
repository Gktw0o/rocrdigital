<script>
  import { link, location } from "svelte-spa-router";
  import {
    LayoutDashboard,
    Mail,
    Handshake,
    Briefcase,
    FileText,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    FolderKanban,
    Calendar,
    Clock,
    CalendarDays,
  } from "lucide-svelte";

  let { collapsed = $bindable(false) } = $props();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/projects", label: "Projects", icon: FolderKanban },
    { path: "/calendar", label: "Calendar", icon: Calendar },
    { path: "/schedule", label: "Schedule", icon: CalendarDays },
    { path: "/time", label: "Time Tracking", icon: Clock },
    { type: "divider" },
    { path: "/contacts", label: "Messages", icon: Mail },
    { path: "/partners", label: "Partners", icon: Handshake },
    { path: "/services", label: "Services", icon: Briefcase },
    { path: "/content", label: "Content", icon: FileText },
    { path: "/team", label: "Team", icon: Users },
    { type: "divider" },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  function isActive(itemPath, currentLocation) {
    if (itemPath === "/") return currentLocation === "/";
    return currentLocation.startsWith(itemPath);
  }
</script>

<aside
  class="flex flex-col border-r transition-all duration-300"
  style="background: var(--sidebar-bg); border-color: var(--border); width: {collapsed
    ? '68px'
    : '240px'};"
>
  <!-- Logo -->
  <div
    class="flex h-16 items-center border-b px-4"
    style="border-color: var(--border);"
  >
    {#if !collapsed}
      <span class="text-lg font-bold" style="color: var(--text);"
        >ROCR Panel</span
      >
    {:else}
      <span class="text-lg font-bold mx-auto" style="color: var(--text);"
        >R</span
      >
    {/if}
  </div>

  <!-- Navigation -->
  <nav class="flex-1 py-4 overflow-y-auto">
    {#each navItems as item}
      {#if item.type === "divider"}
        {#if !collapsed}
          <div
            class="mx-4 my-3 border-t"
            style="border-color: var(--border);"
          ></div>
        {:else}
          <div
            class="mx-2 my-3 border-t"
            style="border-color: var(--border);"
          ></div>
        {/if}
      {:else}
        {@const active = isActive(item.path, $location)}
        <a
          href={item.path}
          use:link
          class="flex items-center gap-3 mx-2 mb-1 rounded-lg px-3 py-2.5 text-sm transition-all duration-150"
          style="
            background: {active ? 'var(--color-primary)' : 'transparent'};
            color: {active ? '#ffffff' : 'var(--text-secondary)'};
          "
          onmouseenter={(e) => {
            if (!active) e.currentTarget.style.background = "var(--hover)";
          }}
          onmouseleave={(e) => {
            if (!active) e.currentTarget.style.background = "transparent";
          }}
        >
          <item.icon size={20} />
          {#if !collapsed}
            <span class="font-medium">{item.label}</span>
          {/if}
        </a>
      {/if}
    {/each}
  </nav>

  <!-- Collapse toggle -->
  <button
    onclick={() => (collapsed = !collapsed)}
    class="flex items-center justify-center border-t py-3 transition-colors cursor-pointer"
    style="border-color: var(--border); color: var(--text-secondary);"
    onmouseenter={(e) => (e.currentTarget.style.background = "var(--hover)")}
    onmouseleave={(e) => (e.currentTarget.style.background = "transparent")}
  >
    {#if collapsed}
      <ChevronRight size={18} />
    {:else}
      <ChevronLeft size={18} />
      <span class="ml-2 text-sm">Collapse</span>
    {/if}
  </button>
</aside>

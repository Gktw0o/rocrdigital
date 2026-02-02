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
  } from "lucide-svelte";

  let { collapsed = $bindable(false) } = $props();

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard },
    { path: "/contacts", label: "Mesajlar", icon: Mail },
    { path: "/partners", label: "Partnerler", icon: Handshake },
    { path: "/services", label: "Servisler", icon: Briefcase },
    { path: "/content", label: "Icerik", icon: FileText },
    { path: "/team", label: "Ekip", icon: Users },
    { path: "/settings", label: "Ayarlar", icon: Settings },
  ];

  function isActive(itemPath, currentLocation) {
    if (itemPath === "/") return currentLocation === "/";
    return currentLocation.startsWith(itemPath);
  }
</script>

<aside
  class="flex flex-col border-r transition-all duration-300"
  style="background: var(--sidebar-bg); border-color: var(--border); width: {collapsed ? '68px' : '240px'};"
>
  <!-- Logo -->
  <div class="flex h-16 items-center border-b px-4" style="border-color: var(--border);">
    {#if !collapsed}
      <span class="text-lg font-bold" style="color: var(--text);">ROCR Panel</span>
    {:else}
      <span class="text-lg font-bold mx-auto" style="color: var(--text);">R</span>
    {/if}
  </div>

  <!-- Navigation -->
  <nav class="flex-1 py-4">
    {#each navItems as item}
      {@const active = isActive(item.path, $location)}
      <a
        href={item.path}
        use:link
        class="flex items-center gap-3 mx-2 mb-1 rounded-lg px-3 py-2.5 text-sm transition-all duration-150"
        style="
          background: {active ? 'var(--color-primary)' : 'transparent'};
          color: {active ? '#ffffff' : 'var(--text-secondary)'};
        "
        onmouseenter={(e) => { if (!active) e.currentTarget.style.background = 'var(--hover)'; }}
        onmouseleave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
      >
        <item.icon size={20} />
        {#if !collapsed}
          <span class="font-medium">{item.label}</span>
        {/if}
      </a>
    {/each}
  </nav>

  <!-- Collapse toggle -->
  <button
    onclick={() => (collapsed = !collapsed)}
    class="flex items-center justify-center border-t py-3 transition-colors cursor-pointer"
    style="border-color: var(--border); color: var(--text-secondary);"
    onmouseenter={(e) => e.currentTarget.style.background = 'var(--hover)'}
    onmouseleave={(e) => e.currentTarget.style.background = 'transparent'}
  >
    {#if collapsed}
      <ChevronRight size={18} />
    {:else}
      <ChevronLeft size={18} />
      <span class="ml-2 text-sm">Kucult</span>
    {/if}
  </button>
</aside>

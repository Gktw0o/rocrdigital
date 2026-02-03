<script>
  import { theme } from "../stores/theme.js";
  import { auth } from "../stores/auth.js";
  import { unreadContacts } from "../stores/data.js";
  import { Sun, Moon, Bell, LogOut, ChevronDown } from "lucide-svelte";

  let { collapsed = false } = $props();
  let dropdownOpen = $state(false);
  let currentUser = $state(null);

  // Subscribe to auth store
  auth.subscribe((user) => {
    currentUser = user;
  });

  function handleLogout() {
    auth.logout();
  }

  function toggleDropdown() {
    dropdownOpen = !dropdownOpen;
  }

  function closeDropdown() {
    dropdownOpen = false;
  }

  // Get user initials
  function getInitials(name) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
</script>

<svelte:window onclick={closeDropdown} />

<header
  class="flex h-16 items-center justify-between border-b px-6"
  style="background: var(--bg-secondary); border-color: var(--border);"
>
  <div>
    <h2 class="text-sm font-medium" style="color: var(--text-secondary);">
      ROCR Digital Admin
    </h2>
  </div>

  <div class="flex items-center gap-3">
    <!-- Notifications -->
    <button
      class="relative rounded-lg p-2 transition-colors cursor-pointer"
      style="color: var(--text-secondary);"
      onmouseenter={(e) => (e.currentTarget.style.background = "var(--hover)")}
      onmouseleave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <Bell size={20} />
      {#if $unreadContacts.length > 0}
        <span
          class="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
          style="background: var(--color-primary);"
        >
          {$unreadContacts.length}
        </span>
      {/if}
    </button>

    <!-- Theme toggle -->
    <button
      onclick={() => theme.toggle()}
      class="rounded-lg p-2 transition-colors cursor-pointer"
      style="color: var(--text-secondary);"
      onmouseenter={(e) => (e.currentTarget.style.background = "var(--hover)")}
      onmouseleave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      {#if $theme === "dark"}
        <Sun size={20} />
      {:else}
        <Moon size={20} />
      {/if}
    </button>

    <!-- User dropdown -->
    <div class="relative">
      <button
        onclick={(e) => {
          e.stopPropagation();
          toggleDropdown();
        }}
        class="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors cursor-pointer"
        style="color: var(--text-primary);"
        onmouseenter={(e) =>
          (e.currentTarget.style.background = "var(--hover)")}
        onmouseleave={(e) =>
          (e.currentTarget.style.background = dropdownOpen
            ? "var(--hover)"
            : "transparent")}
      >
        <!-- Avatar -->
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
          style="background: var(--color-primary);"
        >
          {getInitials(currentUser?.name)}
        </div>

        <!-- Name & Role (hidden on mobile) -->
        <div class="hidden sm:block text-left">
          <p class="text-sm font-medium" style="color: var(--text-primary);">
            {currentUser?.name || "User"}
          </p>
          <p class="text-xs capitalize" style="color: var(--text-secondary);">
            {currentUser?.role || "Member"}
          </p>
        </div>

        <ChevronDown size={16} style="color: var(--text-secondary);" />
      </button>

      <!-- Dropdown Menu -->
      {#if dropdownOpen}
        <div
          class="absolute right-0 top-full mt-2 w-48 rounded-lg border py-1 shadow-lg z-50"
          style="background: var(--bg-secondary); border-color: var(--border);"
        >
          <div class="px-4 py-2 border-b" style="border-color: var(--border);">
            <p class="text-sm font-medium" style="color: var(--text-primary);">
              {currentUser?.name}
            </p>
            <p class="text-xs truncate" style="color: var(--text-secondary);">
              {currentUser?.email}
            </p>
          </div>

          <button
            onclick={handleLogout}
            class="flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors text-red-500 hover:bg-red-500/10"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      {/if}
    </div>
  </div>
</header>

<script>
  import { theme } from "../stores/theme.js";
  import { unreadContacts } from "../stores/data.js";
  import { Sun, Moon, Bell } from "lucide-svelte";

  let { collapsed = false } = $props();
</script>

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
      onmouseenter={(e) => e.currentTarget.style.background = 'var(--hover)'}
      onmouseleave={(e) => e.currentTarget.style.background = 'transparent'}
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
      onmouseenter={(e) => e.currentTarget.style.background = 'var(--hover)'}
      onmouseleave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      {#if $theme === "dark"}
        <Sun size={20} />
      {:else}
        <Moon size={20} />
      {/if}
    </button>

    <!-- User avatar -->
    <div
      class="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
      style="background: var(--color-primary);"
    >
      R
    </div>
  </div>
</header>

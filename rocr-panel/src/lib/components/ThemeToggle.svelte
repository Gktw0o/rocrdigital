<script>
  import { theme } from "../stores/theme.js";
  import { Sun, Moon } from "lucide-svelte";
</script>

<button
  onclick={() => theme.toggle()}
  class="rounded-lg p-2 transition-colors cursor-pointer"
  style="color: var(--text-secondary);"
  onmouseenter={(e) => e.currentTarget.style.background = 'var(--hover)'}
  onmouseleave={(e) => e.currentTarget.style.background = 'transparent'}
  aria-label="Tema degistir"
>
  {#if $theme === "dark"}
    <Sun size={18} />
  {:else}
    <Moon size={18} />
  {/if}
</button>

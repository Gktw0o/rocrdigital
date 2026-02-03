<script>
  import { theme } from "../stores/theme.js";
  import { Sun, Moon } from "lucide-svelte";
</script>

<button
  class="theme-btn"
  onclick={() => theme.toggle()}
  aria-label="Temayı Değiştir"
>
  {#if $theme === "dark"}
    <Sun size={20} />
  {:else}
    <Moon size={20} />
  {/if}
</button>

<style>
  .theme-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s;
  }

  .theme-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text);
  }
</style>

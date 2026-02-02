<script>
  let { open = $bindable(false), title = "", children } = $props();

  function close() {
    open = false;
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) close();
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    onclick={handleBackdrop}
  >
    <div
      class="w-full max-w-lg rounded-2xl border p-6 shadow-2xl"
      style="background: var(--bg-secondary); border-color: var(--border);"
    >
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold" style="color: var(--text);">{title}</h3>
        <button
          onclick={close}
          class="rounded-lg p-1 transition-colors cursor-pointer"
          style="color: var(--text-secondary);"
          onmouseenter={(e) => e.currentTarget.style.background = 'var(--hover)'}
          onmouseleave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          &times;
        </button>
      </div>
      {@render children()}
    </div>
  </div>
{/if}

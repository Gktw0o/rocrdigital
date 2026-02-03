<script>
  import { X } from "lucide-svelte";

  let { open = $bindable(false), title = "", children } = $props();

  function close() {
    open = false;
  }

  function handleBackdrop(e) {
    if (e.target === e.currentTarget) close();
  }

  function handleKeydown(e) {
    if (e.key === "Escape") close();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if open}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="backdrop" onclick={handleBackdrop}>
    <div class="modal">
      <div class="modal-header">
        <h2 class="modal-title">{title}</h2>
        <button class="close-btn" onclick={close}>
          <X size={20} />
        </button>
      </div>
      <div class="modal-body">
        {@render children()}
      </div>
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 24px;
    animation: fadeIn 0.15s ease-out;
  }

  .modal {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    width: 100%;
    max-width: 500px;
    max-height: 90vh;
    overflow: hidden;
    animation: scaleIn 0.2s ease-out;
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
  }

  .modal-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s;
  }

  .close-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text);
  }

  .modal-body {
    padding: 24px;
    overflow-y: auto;
    max-height: calc(90vh - 80px);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>

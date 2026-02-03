<script>
  let {
    children,
    class: className = "",
    onclick = null,
    padding = true,
  } = $props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="card {className}"
  class:clickable={onclick}
  class:no-padding={!padding}
  role={onclick ? "button" : undefined}
  tabindex={onclick ? 0 : undefined}
  {onclick}
  onkeydown={(e) => {
    if (onclick && (e.key === "Enter" || e.key === " ")) onclick(e);
  }}
>
  {@render children()}
</div>

<style>
  .card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    transition: all 0.2s ease;
  }

  .card.no-padding {
    padding: 0;
  }

  .card.clickable {
    cursor: pointer;
  }

  .card.clickable:hover {
    border-color: var(--border-hover);
    transform: translateY(-2px);
  }
</style>

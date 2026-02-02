<script>
  let { children, class: className = "", onclick = null } = $props();
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div
  class="rounded-2xl border p-5 transition-all duration-150 {className}"
  style="background: var(--bg-card); border-color: var(--border); backdrop-filter: blur(12px);"
  role={onclick ? "button" : undefined}
  tabindex={onclick ? 0 : undefined}
  {onclick}
  onkeydown={(e) => { if (onclick && (e.key === 'Enter' || e.key === ' ')) onclick(e); }}
>
  {@render children()}
</div>

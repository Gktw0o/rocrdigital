<script>
  let { columns = [], rows = [], onRowClick = null } = $props();
</script>

<div class="overflow-x-auto rounded-2xl border" style="border-color: var(--border);">
  <table class="w-full text-sm">
    <thead>
      <tr style="background: var(--hover); border-bottom: 1px solid var(--border);">
        {#each columns as col}
          <th
            class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
            style="color: var(--text-secondary);"
          >
            {col.label}
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each rows as row, i}
        <tr
          class="transition-colors"
          style="border-bottom: 1px solid var(--border); cursor: {onRowClick ? 'pointer' : 'default'};"
          onclick={() => onRowClick?.(row)}
          onmouseenter={(e) => e.currentTarget.style.background = 'var(--hover)'}
          onmouseleave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          {#each columns as col}
            <td class="px-4 py-3" style="color: var(--text);">
              {#if col.render}
                {@html col.render(row)}
              {:else}
                {row[col.key] ?? ""}
              {/if}
            </td>
          {/each}
        </tr>
      {/each}
      {#if rows.length === 0}
        <tr>
          <td
            colspan={columns.length}
            class="px-4 py-8 text-center"
            style="color: var(--text-secondary);"
          >
            Veri bulunamadi
          </td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>

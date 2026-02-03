<script>
  let { columns = [], data = [] } = $props();
</script>

<div class="table-wrapper">
  <table class="table">
    <thead>
      <tr>
        {#each columns as col}
          <th>{col.label}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#if data.length === 0}
        <tr>
          <td colspan={columns.length} class="empty"> Veri bulunamadı </td>
        </tr>
      {:else}
        {#each data as row}
          <tr>
            {#each columns as col}
              <td>{row[col.key] || "-"}</td>
            {/each}
          </tr>
        {/each}
      {/if}
    </tbody>
  </table>
</div>

<style>
  .table-wrapper {
    overflow-x: auto;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 16px 20px;
    text-align: left;
  }

  th {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
  }

  td {
    font-size: 14px;
    color: var(--text);
    border-bottom: 1px solid var(--border);
  }

  tr:last-child td {
    border-bottom: none;
  }

  tr:hover td {
    background: var(--bg-tertiary);
  }

  .empty {
    text-align: center;
    padding: 48px;
    color: var(--text-muted);
  }
</style>

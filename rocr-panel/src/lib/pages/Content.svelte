<script>
  import { onMount } from "svelte";
  import { data, isLoading } from "../stores/data.js";
  import Card from "../components/Card.svelte";
  import Modal from "../components/Modal.svelte";
  import { FileText, Plus, Search, Edit, Trash2, Eye } from "lucide-svelte";
  import { contentApi } from "../stores/api.js";

  let searchQuery = $state("");
  let showModal = $state(false);
  let editingContent = $state(null);
  let formData = $state({ page: "", section: "", content: {} });

  onMount(() => data.init());

  const filteredContent = $derived(
    ($data.content || []).filter((c) =>
      c.page?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.section?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  function openModal(content = null) {
    editingContent = content;
    formData = content 
      ? { ...content, content: content.content || {} }
      : { page: "", section: "", content: {} };
    showModal = true;
  }

  async function handleSubmit() {
    if (editingContent) {
      await contentApi.update(editingContent.id, formData);
    } else {
      await contentApi.create(formData);
    }
    await data.refresh();
    showModal = false;
  }

  async function handleDelete(id) {
    if (confirm("Bu içeriği silmek istediğinize emin misiniz?")) {
      await contentApi.delete(id);
      await data.refresh();
    }
  }
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">İçerik</h1>
      <p class="page-subtitle">Web sitesi içerik yönetimi</p>
    </div>
    <button class="primary-btn" onclick={() => openModal()}>
      <Plus size={18} />
      <span>Yeni İçerik</span>
    </button>
  </header>

  <Card padding={false}>
    <div class="toolbar">
      <div class="search">
        <Search size={18} />
        <input type="text" placeholder="Ara..." bind:value={searchQuery} />
      </div>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Sayfa</th>
            <th>Bölüm</th>
            <th>İçerik</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#if $isLoading}
            <tr>
              <td colspan="4" class="loading">Yükleniyor...</td>
            </tr>
          {:else if filteredContent.length === 0}
            <tr>
              <td colspan="4" class="empty">
                <FileText size={40} />
                <p>İçerik bulunamadı</p>
              </td>
            </tr>
          {:else}
            {#each filteredContent as content}
              <tr>
                <td><span class="page-badge">{content.page}</span></td>
                <td>{content.section}</td>
                <td class="content-preview">
                  {JSON.stringify(content.content).slice(0, 80)}...
                </td>
                <td>
                  <div class="actions">
                    <button class="action-btn" onclick={() => openModal(content)}>
                      <Edit size={16} />
                    </button>
                    <button class="action-btn danger" onclick={() => handleDelete(content.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </Card>
</div>

<Modal bind:open={showModal} title={editingContent ? "İçerik Düzenle" : "Yeni İçerik"}>
  <form class="form" onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
    <div class="form-row">
      <div class="form-group">
        <label>Sayfa</label>
        <input type="text" bind:value={formData.page} placeholder="örn: home" required />
      </div>
      <div class="form-group">
        <label>Bölüm</label>
        <input type="text" bind:value={formData.section} placeholder="örn: hero" required />
      </div>
    </div>
    <div class="form-group">
      <label>İçerik (JSON)</label>
      <textarea 
        bind:value={formData.content} 
        rows="6"
        placeholder='{"title": "...", "description": "..."}'
      ></textarea>
    </div>
    <div class="form-actions">
      <button type="button" class="btn-secondary" onclick={() => (showModal = false)}>İptal</button>
      <button type="submit" class="btn-primary">Kaydet</button>
    </div>
  </form>
</Modal>

<style>
  .page {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 4px;
  }

  .page-subtitle {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .primary-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: var(--primary);
    border: none;
    border-radius: var(--radius-sm);
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  .toolbar {
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
  }

  .search {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    max-width: 300px;
    color: var(--text-muted);
  }

  .search input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: 14px;
    color: var(--text);
    outline: none;
  }

  .table-wrapper { overflow-x: auto; }
  .table { width: 100%; border-collapse: collapse; }
  th, td { padding: 16px 20px; text-align: left; }
  th {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
  }
  td {
    font-size: 14px;
    color: var(--text);
    border-bottom: 1px solid var(--border);
  }
  tr:hover td { background: var(--bg-tertiary); }
  .loading, .empty {
    text-align: center;
    padding: 64px;
    color: var(--text-muted);
  }
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }

  .page-badge {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    background: var(--primary);
    color: white;
    border-radius: 999px;
  }

  .content-preview {
    max-width: 300px;
    font-family: monospace;
    font-size: 12px;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .actions {
    display: flex;
    gap: 4px;
  }

  .action-btn {
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

  .action-btn:hover { background: var(--bg-tertiary); color: var(--text); }
  .action-btn.danger:hover { color: var(--danger); }

  /* Form */
  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .form-group input, .form-group textarea {
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg);
    color: var(--text);
    font-size: 14px;
    font-family: inherit;
    outline: none;
  }

  .form-group textarea {
    font-family: monospace;
    resize: vertical;
  }

  .form-group input:focus, .form-group textarea:focus {
    border-color: var(--primary);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 8px;
  }

  .btn-secondary, .btn-primary {
    padding: 12px 24px;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  .btn-secondary { background: var(--bg-tertiary); color: var(--text); }
  .btn-primary { background: var(--primary); color: white; }
</style>

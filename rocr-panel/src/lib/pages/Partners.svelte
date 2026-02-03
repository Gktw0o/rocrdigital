<script>
  import { onMount } from "svelte";
  import { data, isLoading } from "../stores/data.js";
  import Card from "../components/Card.svelte";
  import Modal from "../components/Modal.svelte";
  import {
    Handshake,
    Plus,
    Search,
    Edit,
    Trash2,
    ExternalLink,
  } from "lucide-svelte";
  import { partnersApi } from "../stores/api.js";

  let searchQuery = $state("");
  let showModal = $state(false);
  let editingPartner = $state(null);
  let formData = $state({ name: "", logo: "", website: "", description: "" });

  onMount(() => data.init());

  const filteredPartners = $derived(
    ($data.partners || []).filter((p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  function openModal(partner = null) {
    editingPartner = partner;
    formData = partner
      ? { ...partner }
      : { name: "", logo: "", website: "", description: "" };
    showModal = true;
  }

  async function handleSubmit() {
    if (editingPartner) {
      await partnersApi.update(editingPartner.id, formData);
    } else {
      await partnersApi.create(formData);
    }
    await data.refresh();
    showModal = false;
  }

  async function handleDelete(id) {
    if (confirm("Bu partneri silmek istediğinize emin misiniz?")) {
      await partnersApi.delete(id);
      await data.refresh();
    }
  }
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Partnerler</h1>
      <p class="page-subtitle">İş ortakları ve partnerler</p>
    </div>
    <button class="primary-btn" onclick={() => openModal()}>
      <Plus size={18} />
      <span>Yeni Partner</span>
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
            <th>Partner</th>
            <th>Website</th>
            <th>Açıklama</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#if $isLoading}
            <tr>
              <td colspan="4" class="loading">Yükleniyor...</td>
            </tr>
          {:else if filteredPartners.length === 0}
            <tr>
              <td colspan="4" class="empty">
                <Handshake size={40} />
                <p>Partner bulunamadı</p>
              </td>
            </tr>
          {:else}
            {#each filteredPartners as partner}
              <tr>
                <td>
                  <div class="partner">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      class="partner-logo"
                    />
                    <span class="partner-name">{partner.name}</span>
                  </div>
                </td>
                <td>
                  {#if partner.website}
                    <a
                      href={partner.website}
                      target="_blank"
                      class="website-link"
                    >
                      <ExternalLink size={14} />
                      <span>{partner.website}</span>
                    </a>
                  {:else}
                    <span class="muted">-</span>
                  {/if}
                </td>
                <td class="description">{partner.description || "-"}</td>
                <td>
                  <div class="actions">
                    <button
                      class="action-btn"
                      onclick={() => openModal(partner)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      class="action-btn danger"
                      onclick={() => handleDelete(partner.id)}
                    >
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

<Modal
  bind:open={showModal}
  title={editingPartner ? "Partner Düzenle" : "Yeni Partner"}
>
  <form
    class="form"
    onsubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}
  >
    <div class="form-group">
      <label>Partner Adı</label>
      <input type="text" bind:value={formData.name} required />
    </div>
    <div class="form-group">
      <label>Logo URL</label>
      <input type="url" bind:value={formData.logo} placeholder="https://..." />
    </div>
    <div class="form-group">
      <label>Website</label>
      <input
        type="url"
        bind:value={formData.website}
        placeholder="https://..."
      />
    </div>
    <div class="form-group">
      <label>Açıklama</label>
      <textarea bind:value={formData.description} rows="3"></textarea>
    </div>
    <div class="form-actions">
      <button
        type="button"
        class="btn-secondary"
        onclick={() => (showModal = false)}>İptal</button
      >
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
    transition: all 0.15s;
  }

  .primary-btn:hover {
    background: var(--primary-hover);
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
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
  }
  td {
    font-size: 14px;
    color: var(--text);
    border-bottom: 1px solid var(--border);
  }
  tr:hover td {
    background: var(--bg-tertiary);
  }
  .loading,
  .empty {
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

  .partner {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .partner-logo {
    width: 40px;
    height: 40px;
    border-radius: var(--radius-sm);
    object-fit: contain;
    background: var(--bg-tertiary);
  }

  .partner-name {
    font-weight: 500;
  }

  .website-link {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--primary);
    text-decoration: none;
    font-size: 13px;
  }

  .description {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .muted {
    color: var(--text-muted);
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

  .action-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text);
  }

  .action-btn.danger:hover {
    color: var(--danger);
  }

  /* Form */
  .form {
    display: flex;
    flex-direction: column;
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

  .form-group input,
  .form-group textarea {
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg);
    color: var(--text);
    font-size: 14px;
    outline: none;
    transition: border-color 0.15s;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    border-color: var(--primary);
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 8px;
  }

  .btn-secondary,
  .btn-primary {
    padding: 12px 24px;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-secondary {
    background: var(--bg-tertiary);
    color: var(--text);
  }

  .btn-primary {
    background: var(--primary);
    color: white;
  }

  .btn-primary:hover {
    background: var(--primary-hover);
  }
</style>

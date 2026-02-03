<script>
  import { onMount } from "svelte";
  import { data, isLoading } from "../stores/data.js";
  import {
    formatDate,
    getStatusColor,
    getStatusLabel,
  } from "../utils/index.js";
  import Card from "../components/Card.svelte";
  import Modal from "../components/Modal.svelte";
  import {
    Mail,
    Search,
    Filter,
    Eye,
    Trash2,
    CheckCircle,
    XCircle,
  } from "lucide-svelte";
  import { contactsApi } from "../stores/api.js";

  let searchQuery = $state("");
  let selectedContact = $state(null);
  let showModal = $state(false);

  onMount(() => data.init());

  const filteredContacts = $derived(
    ($data.contacts || []).filter(
      (c) =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject?.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  function viewContact(contact) {
    selectedContact = contact;
    showModal = true;
  }

  async function updateStatus(id, status) {
    await contactsApi.update(id, { status });
    await data.refresh();
    showModal = false;
  }

  async function deleteContact(id) {
    if (confirm("Bu mesajı silmek istediğinize emin misiniz?")) {
      await contactsApi.delete(id);
      await data.refresh();
      showModal = false;
    }
  }
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Mesajlar</h1>
      <p class="page-subtitle">İletişim formundan gelen mesajlar</p>
    </div>
  </header>

  <Card padding={false}>
    <!-- Search -->
    <div class="toolbar">
      <div class="search">
        <Search size={18} />
        <input type="text" placeholder="Ara..." bind:value={searchQuery} />
      </div>
    </div>

    <!-- Table -->
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Gönderen</th>
            <th>Konu</th>
            <th>Durum</th>
            <th>Tarih</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#if $isLoading}
            <tr>
              <td colspan="5" class="loading">Yükleniyor...</td>
            </tr>
          {:else if filteredContacts.length === 0}
            <tr>
              <td colspan="5" class="empty">
                <Mail size={40} />
                <p>Mesaj bulunamadı</p>
              </td>
            </tr>
          {:else}
            {#each filteredContacts as contact}
              <tr>
                <td>
                  <div class="sender">
                    <div class="avatar">
                      {contact.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <span class="name">{contact.name}</span>
                      <span class="email">{contact.email}</span>
                    </div>
                  </div>
                </td>
                <td class="subject">{contact.subject}</td>
                <td>
                  <span class="status {getStatusColor(contact.status)}">
                    {getStatusLabel(contact.status)}
                  </span>
                </td>
                <td class="date"
                  >{formatDate(contact.createdAt || contact.date)}</td
                >
                <td>
                  <button
                    class="action-btn"
                    onclick={() => viewContact(contact)}
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            {/each}
          {/if}
        </tbody>
      </table>
    </div>
  </Card>
</div>

<!-- Modal -->
<Modal bind:open={showModal} title="Mesaj Detayı">
  {#if selectedContact}
    <div class="modal-content">
      <div class="info-grid">
        <div class="info-item">
          <label>Ad Soyad</label>
          <span>{selectedContact.name}</span>
        </div>
        <div class="info-item">
          <label>E-posta</label>
          <span>{selectedContact.email}</span>
        </div>
        <div class="info-item">
          <label>Telefon</label>
          <span>{selectedContact.phone || "-"}</span>
        </div>
        <div class="info-item">
          <label>Konu</label>
          <span>{selectedContact.subject}</span>
        </div>
      </div>

      <div class="info-item full">
        <label>Mesaj</label>
        <p class="message-text">{selectedContact.message}</p>
      </div>

      <div class="modal-actions">
        <button
          class="btn btn-success"
          onclick={() => updateStatus(selectedContact.id, "read")}
        >
          <CheckCircle size={16} />
          <span>Okundu</span>
        </button>
        <button
          class="btn btn-danger"
          onclick={() => deleteContact(selectedContact.id)}
        >
          <Trash2 size={16} />
          <span>Sil</span>
        </button>
      </div>
    </div>
  {/if}
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

  /* Toolbar */
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

  .search input::placeholder {
    color: var(--text-muted);
  }

  /* Table */
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

  /* Sender */
  .sender {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    color: white;
  }

  .name {
    display: block;
    font-weight: 500;
    color: var(--text);
  }

  .email {
    display: block;
    font-size: 13px;
    color: var(--text-muted);
  }

  .subject {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .date {
    color: var(--text-muted);
    white-space: nowrap;
  }

  .status {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
    text-transform: uppercase;
  }

  .status.bg-yellow-100 {
    background: #fef3c7;
    color: #92400e;
  }
  .status.bg-green-100 {
    background: #d1fae5;
    color: #065f46;
  }
  .status.bg-red-100 {
    background: #fee2e2;
    color: #991b1b;
  }
  .status.bg-blue-100 {
    background: #dbeafe;
    color: #1e40af;
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

  /* Modal Content */
  .modal-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .info-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .info-item.full {
    grid-column: 1 / -1;
  }

  .info-item label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .info-item span,
  .info-item p {
    font-size: 14px;
    color: var(--text);
  }

  .message-text {
    padding: 16px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    line-height: 1.6;
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }

  .btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-success {
    background: var(--success);
    color: white;
  }

  .btn-danger {
    background: var(--danger);
    color: white;
  }

  .btn:hover {
    opacity: 0.9;
  }
</style>

<script>
  import { onMount } from "svelte";
  import { data, isLoading, loadingStates } from "../stores/data.js";
  import {
    formatDate,
    getStatusColor,
    getStatusLabel,
    truncate,
  } from "../utils/index.js";
  import Card from "../components/Card.svelte";
  import Modal from "../components/Modal.svelte";
  import DataTable from "../components/DataTable.svelte";
  import {
    Search,
    Filter,
    Download,
    Eye,
    Trash2,
    RefreshCw,
    Loader2,
  } from "lucide-svelte";

  let searchQuery = $state("");
  let statusFilter = $state("all");
  let selectedContact = $state(null);
  let detailOpen = $state(false);
  let updating = $state(false);

  onMount(async () => {
    // Load contacts if not already loaded
    if (!$data.contacts || $data.contacts.length === 0) {
      await data.loadContacts();
    }
  });

  const filteredContacts = $derived(
    ($data.contacts || []).filter((c) => {
      const matchSearch =
        searchQuery === "" ||
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchStatus;
    }),
  );

  const columns = [
    { key: "name", label: "İsim" },
    { key: "email", label: "Email" },
    { key: "subject", label: "Konu" },
    {
      key: "status",
      label: "Durum",
      render: (row) =>
        `<span class="rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(row.status)}">${getStatusLabel(row.status)}</span>`,
    },
    {
      key: "createdAt",
      label: "Tarih",
      render: (row) => formatDate(row.createdAt || row.date),
    },
  ];

  async function viewContact(contact) {
    selectedContact = contact;
    detailOpen = true;

    // Mark as read if unread
    if (contact.status === "unread") {
      updating = true;
      try {
        await data.updateContact(contact.id, { status: "read" });
        selectedContact = { ...selectedContact, status: "read" };
      } catch (error) {
        console.error("Failed to update status:", error);
      } finally {
        updating = false;
      }
    }
  }

  async function updateStatus(id, status) {
    updating = true;
    try {
      await data.updateContact(id, { status });
      selectedContact = { ...selectedContact, status };
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Durum güncellenirken hata oluştu");
    } finally {
      updating = false;
    }
  }

  async function deleteContact(id) {
    if (!confirm("Bu mesajı silmek istediğinizden emin misiniz?")) return;

    updating = true;
    try {
      await data.deleteContact(id);
      detailOpen = false;
      selectedContact = null;
    } catch (error) {
      console.error("Failed to delete contact:", error);
      alert("Mesaj silinirken hata oluştu");
    } finally {
      updating = false;
    }
  }

  async function handleRefresh() {
    await data.loadContacts();
  }

  async function exportContacts() {
    // Export as CSV
    const headers = ["İsim", "Email", "Konu", "Mesaj", "Durum", "Tarih"];
    const rows = filteredContacts.map((c) => [
      c.name,
      c.email,
      c.subject,
      c.message?.replace(/"/g, '""'),
      c.status,
      formatDate(c.createdAt || c.date),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `contacts_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold" style="color: var(--text);">Mesajlar</h1>
      <p class="mt-1 text-sm" style="color: var(--text-secondary);">
        İletişim formu gönderimlerini yönetin ({$data.contacts?.length || 0} toplam)
      </p>
    </div>
    <div class="flex items-center gap-2">
      <button
        onclick={handleRefresh}
        disabled={$loadingStates.contacts}
        class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-50"
        style="background: var(--surface); color: var(--text);"
      >
        <RefreshCw
          size={16}
          class={$loadingStates.contacts ? "animate-spin" : ""}
        />
      </button>
      <button
        onclick={exportContacts}
        class="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors cursor-pointer"
        style="background: var(--color-primary);"
      >
        <Download size={16} /> Dışa Aktar
      </button>
    </div>
  </div>

  <!-- Filters -->
  <Card>
    <div class="flex flex-wrap items-center gap-4">
      <div class="relative flex-1">
        <Search
          size={16}
          class="absolute left-3 top-1/2 -translate-y-1/2"
          style="color: var(--text-secondary);"
        />
        <input
          type="text"
          placeholder="İsim, email veya konu ile ara..."
          bind:value={searchQuery}
          class="w-full rounded-lg border py-2 pl-10 pr-4 text-sm outline-none transition-colors"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
      </div>
      <div class="flex items-center gap-2">
        <Filter size={16} style="color: var(--text-secondary);" />
        <select
          bind:value={statusFilter}
          class="rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        >
          <option value="all">Tüm Durumlar</option>
          <option value="unread">Okunmadı</option>
          <option value="read">Okundu</option>
          <option value="in_progress">İşleniyor</option>
          <option value="replied">Yanıt Verildi</option>
          <option value="archived">Arşivlendi</option>
        </select>
      </div>
    </div>
  </Card>

  <!-- Loading State -->
  {#if $loadingStates.contacts}
    <Card>
      <div
        class="flex items-center justify-center py-8 gap-2"
        style="color: var(--text-secondary);"
      >
        <Loader2 size={20} class="animate-spin" />
        <span>Mesajlar yükleniyor...</span>
      </div>
    </Card>
  {:else if filteredContacts.length === 0}
    <Card>
      <div class="py-8 text-center" style="color: var(--text-secondary);">
        {searchQuery || statusFilter !== "all"
          ? "Arama kriterlerine uygun mesaj bulunamadı."
          : "Henüz mesaj yok."}
      </div>
    </Card>
  {:else}
    <!-- Table -->
    <DataTable {columns} rows={filteredContacts} onRowClick={viewContact} />
  {/if}

  <!-- Detail Modal -->
  <Modal bind:open={detailOpen} title="Mesaj Detayı">
    {#if selectedContact}
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <span
              class="text-xs font-medium"
              style="color: var(--text-secondary);">İsim</span
            >
            <p class="text-sm font-medium" style="color: var(--text);">
              {selectedContact.name}
            </p>
          </div>
          <div>
            <span
              class="text-xs font-medium"
              style="color: var(--text-secondary);">Email</span
            >
            <p class="text-sm font-medium" style="color: var(--text);">
              {selectedContact.email}
            </p>
          </div>
          <div>
            <span
              class="text-xs font-medium"
              style="color: var(--text-secondary);">Konu</span
            >
            <p class="text-sm font-medium" style="color: var(--text);">
              {selectedContact.subject}
            </p>
          </div>
          <div>
            <span
              class="text-xs font-medium"
              style="color: var(--text-secondary);">Tarih</span
            >
            <p class="text-sm font-medium" style="color: var(--text);">
              {formatDate(selectedContact.createdAt || selectedContact.date)}
            </p>
          </div>
        </div>
        <div>
          <span
            class="text-xs font-medium"
            style="color: var(--text-secondary);">Mesaj</span
          >
          <p
            class="mt-1 rounded-lg p-3 text-sm"
            style="background: var(--bg); color: var(--text);"
          >
            {selectedContact.message}
          </p>
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          <span
            class="text-xs font-medium"
            style="color: var(--text-secondary);">Durum:</span
          >
          {#each ["unread", "read", "in_progress", "replied", "archived"] as status}
            <button
              onclick={() => updateStatus(selectedContact.id, status)}
              disabled={updating}
              class="rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50 {getStatusColor(
                status,
              )}"
              style="opacity: {selectedContact.status === status ? 1 : 0.5};"
            >
              {getStatusLabel(status)}
            </button>
          {/each}
        </div>
        <div
          class="flex justify-end gap-2 pt-2 border-t"
          style="border-color: var(--border);"
        >
          <button
            onclick={() => deleteContact(selectedContact.id)}
            disabled={updating}
            class="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors cursor-pointer disabled:opacity-50"
            onmouseenter={(e) =>
              (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
            onmouseleave={(e) =>
              (e.currentTarget.style.background = "transparent")}
          >
            {#if updating}
              <Loader2 size={14} class="animate-spin" />
            {:else}
              <Trash2 size={14} />
            {/if}
            Sil
          </button>
        </div>
      </div>
    {/if}
  </Modal>
</div>

<style>
  .animate-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>

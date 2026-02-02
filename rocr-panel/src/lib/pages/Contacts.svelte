<script>
  import { data } from "../stores/data.js";
  import { formatDate, getStatusColor, getStatusLabel, truncate } from "../utils/index.js";
  import Card from "../components/Card.svelte";
  import Modal from "../components/Modal.svelte";
  import DataTable from "../components/DataTable.svelte";
  import { Search, Filter, Download, Eye, Trash2 } from "lucide-svelte";

  let searchQuery = $state("");
  let statusFilter = $state("all");
  let selectedContact = $state(null);
  let detailOpen = $state(false);

  const filteredContacts = $derived(
    $data.contacts.filter((c) => {
      const matchSearch =
        searchQuery === "" ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchStatus;
    })
  );

  const columns = [
    { key: "name", label: "Isim" },
    { key: "email", label: "Email" },
    { key: "subject", label: "Konu" },
    {
      key: "status",
      label: "Durum",
      render: (row) =>
        `<span class="rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(row.status)}">${getStatusLabel(row.status)}</span>`,
    },
    { key: "date", label: "Tarih", render: (row) => formatDate(row.date) },
  ];

  function viewContact(contact) {
    selectedContact = contact;
    detailOpen = true;
    if (contact.status === "unread") {
      data.updateContact(contact.id, { status: "read" });
    }
  }

  function updateStatus(id, status) {
    data.updateContact(id, { status });
  }

  function deleteContact(id) {
    data.deleteContact(id);
    detailOpen = false;
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold" style="color: var(--text);">Mesajlar</h1>
      <p class="mt-1 text-sm" style="color: var(--text-secondary);">
        Iletisim formu gonderimlerini yonetin ({$data.contacts.length} toplam)
      </p>
    </div>
    <button
      class="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors cursor-pointer"
      style="background: var(--color-primary);"
    >
      <Download size={16} /> Disa Aktar
    </button>
  </div>

  <!-- Filters -->
  <Card>
    <div class="flex flex-wrap items-center gap-4">
      <div class="relative flex-1">
        <Search size={16} class="absolute left-3 top-1/2 -translate-y-1/2" style="color: var(--text-secondary);" />
        <input
          type="text"
          placeholder="Isim, email veya konu ile ara..."
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
          <option value="all">Tum Durumlar</option>
          <option value="unread">Okunmadi</option>
          <option value="read">Okundu</option>
          <option value="replied">Yanit Verildi</option>
          <option value="archived">Arsivlendi</option>
        </select>
      </div>
    </div>
  </Card>

  <!-- Table -->
  <DataTable {columns} rows={filteredContacts} onRowClick={viewContact} />

  <!-- Detail Modal -->
  <Modal bind:open={detailOpen} title="Mesaj Detayi">
    {#if selectedContact}
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-medium" style="color: var(--text-secondary);">Isim</label>
            <p class="text-sm font-medium" style="color: var(--text);">{selectedContact.name}</p>
          </div>
          <div>
            <label class="text-xs font-medium" style="color: var(--text-secondary);">Email</label>
            <p class="text-sm font-medium" style="color: var(--text);">{selectedContact.email}</p>
          </div>
          <div>
            <label class="text-xs font-medium" style="color: var(--text-secondary);">Konu</label>
            <p class="text-sm font-medium" style="color: var(--text);">{selectedContact.subject}</p>
          </div>
          <div>
            <label class="text-xs font-medium" style="color: var(--text-secondary);">Tarih</label>
            <p class="text-sm font-medium" style="color: var(--text);">{formatDate(selectedContact.date)}</p>
          </div>
        </div>
        <div>
          <label class="text-xs font-medium" style="color: var(--text-secondary);">Mesaj</label>
          <p class="mt-1 rounded-lg p-3 text-sm" style="background: var(--bg); color: var(--text);">
            {selectedContact.message}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs font-medium" style="color: var(--text-secondary);">Durum:</label>
          {#each ["unread", "read", "replied", "archived"] as status}
            <button
              onclick={() => updateStatus(selectedContact.id, status)}
              class="rounded-full px-3 py-1 text-xs font-medium transition-colors cursor-pointer {getStatusColor(status)}"
              style="opacity: {selectedContact.status === status ? 1 : 0.5};"
            >
              {getStatusLabel(status)}
            </button>
          {/each}
        </div>
        <div class="flex justify-end gap-2 pt-2 border-t" style="border-color: var(--border);">
          <button
            onclick={() => deleteContact(selectedContact.id)}
            class="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors cursor-pointer"
            onmouseenter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
            onmouseleave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <Trash2 size={14} /> Sil
          </button>
        </div>
      </div>
    {/if}
  </Modal>
</div>

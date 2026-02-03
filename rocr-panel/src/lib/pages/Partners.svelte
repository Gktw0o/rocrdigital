<script>
  import { onMount } from "svelte";
  import { data, loadingStates } from "../stores/data.js";
  import Card from "../components/Card.svelte";
  import Modal from "../components/Modal.svelte";
  import { Plus, Pencil, Trash2, Tag, RefreshCw, Loader2 } from "lucide-svelte";

  let editOpen = $state(false);
  let editingPartner = $state(null);
  let formData = $state({ name: "", description: "", tags: "" });
  let saving = $state(false);
  let error = $state(null);

  onMount(async () => {
    if (!$data.partners || $data.partners.length === 0) {
      await data.loadPartners();
    }
  });

  function openNew() {
    editingPartner = null;
    formData = { name: "", description: "", tags: "" };
    error = null;
    editOpen = true;
  }

  function openEdit(partner) {
    editingPartner = partner;
    formData = {
      name: partner.name || "",
      description: partner.description || "",
      tags: Array.isArray(partner.tags)
        ? partner.tags.join(", ")
        : partner.tags || "",
    };
    error = null;
    editOpen = true;
  }

  async function save() {
    if (!formData.name.trim()) {
      error = "Partner adı gerekli";
      return;
    }

    const tags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    saving = true;
    error = null;

    try {
      if (editingPartner) {
        await data.updatePartner(editingPartner.id, {
          name: formData.name.trim(),
          description: formData.description.trim(),
          tags,
        });
      } else {
        await data.addPartner({
          name: formData.name.trim(),
          description: formData.description.trim(),
          tags,
        });
      }
      editOpen = false;
    } catch (err) {
      console.error("Failed to save partner:", err);
      error = err.message || "Partner kaydedilirken hata oluştu";
    } finally {
      saving = false;
    }
  }

  async function remove(id) {
    if (!confirm("Bu partneri silmek istediğinizden emin misiniz?")) return;

    try {
      await data.deletePartner(id);
    } catch (err) {
      console.error("Failed to delete partner:", err);
      alert("Partner silinirken hata oluştu: " + err.message);
    }
  }

  async function handleRefresh() {
    await data.loadPartners();
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold" style="color: var(--text);">Partnerler</h1>
      <p class="mt-1 text-sm" style="color: var(--text-secondary);">
        Partner ve vaka çalışmalarını yönetin ({$data.partners?.length || 0} partner)
      </p>
    </div>
    <div class="flex items-center gap-2">
      <button
        onclick={handleRefresh}
        disabled={$loadingStates.partners}
        class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-50"
        style="background: var(--surface); color: var(--text);"
      >
        <RefreshCw
          size={16}
          class={$loadingStates.partners ? "animate-spin" : ""}
        />
      </button>
      <button
        onclick={openNew}
        class="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors cursor-pointer"
        style="background: var(--color-primary);"
      >
        <Plus size={16} /> Yeni Partner
      </button>
    </div>
  </div>

  <!-- Loading State -->
  {#if $loadingStates.partners}
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each Array(6) as _}
        <Card>
          <div class="animate-pulse space-y-3">
            <div class="h-5 w-32 rounded bg-gray-700"></div>
            <div class="h-4 w-48 rounded bg-gray-700"></div>
            <div class="flex gap-2">
              <div class="h-5 w-20 rounded-full bg-gray-700"></div>
              <div class="h-5 w-24 rounded-full bg-gray-700"></div>
            </div>
          </div>
        </Card>
      {/each}
    </div>
  {:else if !$data.partners || $data.partners.length === 0}
    <Card>
      <div class="py-12 text-center">
        <p style="color: var(--text-secondary);">Henüz partner eklenmemiş.</p>
        <button
          onclick={openNew}
          class="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
          style="background: var(--color-primary); color: white;"
        >
          <Plus size={16} /> İlk Partneri Ekle
        </button>
      </div>
    </Card>
  {:else}
    <!-- Partner Grid -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {#each $data.partners as partner}
        <Card class="hover:scale-[1.02] transition-transform">
          <div class="space-y-3">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="text-base font-semibold" style="color: var(--text);">
                  {partner.name}
                </h3>
                <p class="mt-1 text-sm" style="color: var(--text-secondary);">
                  {partner.description || ""}
                </p>
              </div>
              <div class="flex gap-1">
                <button
                  onclick={() => openEdit(partner)}
                  class="rounded-lg p-1.5 transition-colors cursor-pointer"
                  style="color: var(--text-secondary);"
                  onmouseenter={(e) =>
                    (e.currentTarget.style.background = "var(--hover)")}
                  onmouseleave={(e) =>
                    (e.currentTarget.style.background = "transparent")}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onclick={() => remove(partner.id)}
                  class="rounded-lg p-1.5 text-red-400 transition-colors cursor-pointer"
                  onmouseenter={(e) =>
                    (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                  onmouseleave={(e) =>
                    (e.currentTarget.style.background = "transparent")}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div class="flex flex-wrap gap-1.5">
              {#each Array.isArray(partner.tags) ? partner.tags : [] as tag}
                <span
                  class="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                  style="background: var(--color-primary)15; color: var(--color-primary);"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              {/each}
            </div>
          </div>
        </Card>
      {/each}
    </div>
  {/if}

  <!-- Edit/Create Modal -->
  <Modal
    bind:open={editOpen}
    title={editingPartner ? "Partner Düzenle" : "Yeni Partner"}
  >
    <div class="space-y-4">
      {#if error}
        <div class="rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      {/if}

      <label
        class="block text-xs font-medium"
        style="color: var(--text-secondary);"
      >
        <span class="mb-1 block">Partner Adı *</span>
        <input
          type="text"
          bind:value={formData.name}
          placeholder="Partner adı girin"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
      </label>
      <label
        class="block text-xs font-medium"
        style="color: var(--text-secondary);"
      >
        <span class="mb-1 block">Açıklama</span>
        <textarea
          bind:value={formData.description}
          placeholder="Partner açıklaması"
          rows="3"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        ></textarea>
      </label>
      <label
        class="block text-xs font-medium"
        style="color: var(--text-secondary);"
      >
        <span class="mb-1 block">Etiketler (virgül ile ayırın)</span>
        <input
          type="text"
          bind:value={formData.tags}
          placeholder="Web Experiences, AI & Automation"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
      </label>
      <div class="flex justify-end gap-2 pt-2">
        <button
          onclick={() => (editOpen = false)}
          disabled={saving}
          class="rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer disabled:opacity-50"
          style="color: var(--text-secondary);"
          onmouseenter={(e) =>
            (e.currentTarget.style.background = "var(--hover)")}
          onmouseleave={(e) =>
            (e.currentTarget.style.background = "transparent")}
        >
          İptal
        </button>
        <button
          onclick={save}
          disabled={saving}
          class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors cursor-pointer disabled:opacity-50"
          style="background: var(--color-primary);"
        >
          {#if saving}
            <Loader2 size={14} class="animate-spin" />
          {/if}
          Kaydet
        </button>
      </div>
    </div>
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

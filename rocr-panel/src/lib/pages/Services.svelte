<script>
  import { onMount } from "svelte";
  import { data, loadingStates } from "../stores/data.js";
  import Card from "../components/Card.svelte";
  import Modal from "../components/Modal.svelte";
  import {
    Pencil,
    ToggleLeft,
    ToggleRight,
    Check,
    RefreshCw,
    Loader2,
  } from "lucide-svelte";

  let editOpen = $state(false);
  let editingService = $state(null);
  let formData = $state({ title: "", description: "", features: "" });
  let saving = $state(false);
  let toggling = $state(null);

  onMount(async () => {
    if (!$data.services || $data.services.length === 0) {
      await data.loadServices();
    }
  });

  function openEdit(service) {
    editingService = service;
    formData = {
      title: service.title || "",
      description: service.description || "",
      features: Array.isArray(service.features)
        ? service.features.join("\n")
        : "",
    };
    editOpen = true;
  }

  async function save() {
    if (!editingService) return;

    const features = formData.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    saving = true;
    try {
      await data.updateService(editingService.id, {
        title: formData.title.trim(),
        description: formData.description.trim(),
        features,
      });
      editOpen = false;
    } catch (err) {
      console.error("Failed to save service:", err);
      alert("Servis kaydedilirken hata oluştu: " + err.message);
    } finally {
      saving = false;
    }
  }

  async function handleToggle(service) {
    toggling = service.id;
    try {
      await data.toggleService(service.id);
    } catch (err) {
      console.error("Failed to toggle service:", err);
      alert("Servis durumu değiştirilemedi: " + err.message);
    } finally {
      toggling = null;
    }
  }

  async function handleRefresh() {
    await data.loadServices();
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold" style="color: var(--text);">Servisler</h1>
      <p class="mt-1 text-sm" style="color: var(--text-secondary);">
        {$data.services?.length || 0} servis kategorisini yönetin
      </p>
    </div>
    <button
      onclick={handleRefresh}
      disabled={$loadingStates.services}
      class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-50"
      style="background: var(--surface); color: var(--text);"
    >
      <RefreshCw
        size={16}
        class={$loadingStates.services ? "animate-spin" : ""}
      />
    </button>
  </div>

  <!-- Loading State -->
  {#if $loadingStates.services}
    <div class="space-y-3">
      {#each Array(4) as _}
        <Card>
          <div class="animate-pulse space-y-3">
            <div class="flex items-center gap-3">
              <div class="h-5 w-40 rounded bg-gray-700"></div>
              <div class="h-5 w-16 rounded-full bg-gray-700"></div>
            </div>
            <div class="h-4 w-64 rounded bg-gray-700"></div>
            <div class="flex gap-4">
              <div class="h-4 w-32 rounded bg-gray-700"></div>
              <div class="h-4 w-28 rounded bg-gray-700"></div>
            </div>
          </div>
        </Card>
      {/each}
    </div>
  {:else if !$data.services || $data.services.length === 0}
    <Card>
      <div class="py-12 text-center" style="color: var(--text-secondary);">
        Henüz servis eklenmemiş.
      </div>
    </Card>
  {:else}
    <!-- Service List -->
    <div class="space-y-3">
      {#each $data.services as service}
        <Card>
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center gap-3">
                <h3 class="text-base font-semibold" style="color: var(--text);">
                  {service.title}
                </h3>
                <span
                  class="rounded-full px-2 py-0.5 text-[11px] font-medium"
                  style="background: {service.active
                    ? 'rgba(16,185,129,0.15)'
                    : 'rgba(239,68,68,0.15)'}; color: {service.active
                    ? '#10b981'
                    : '#ef4444'};"
                >
                  {service.active ? "Aktif" : "Pasif"}
                </span>
              </div>
              <p class="mt-1 text-sm" style="color: var(--text-secondary);">
                {service.description || ""}
              </p>
              <div class="mt-3 flex flex-wrap gap-2">
                {#each Array.isArray(service.features) ? service.features : [] as feature}
                  <span
                    class="flex items-center gap-1 text-xs"
                    style="color: var(--text-secondary);"
                  >
                    <Check size={12} style="color: var(--color-primary);" />
                    {feature}
                  </span>
                {/each}
              </div>
            </div>
            <div class="flex gap-1">
              <button
                onclick={() => handleToggle(service)}
                disabled={toggling === service.id}
                class="rounded-lg p-1.5 transition-colors cursor-pointer disabled:opacity-50"
                style="color: {service.active
                  ? '#10b981'
                  : 'var(--text-secondary)'};"
                onmouseenter={(e) =>
                  (e.currentTarget.style.background = "var(--hover)")}
                onmouseleave={(e) =>
                  (e.currentTarget.style.background = "transparent")}
                title={service.active ? "Devre dışı bırak" : "Etkinleştir"}
              >
                {#if toggling === service.id}
                  <Loader2 size={20} class="animate-spin" />
                {:else if service.active}
                  <ToggleRight size={20} />
                {:else}
                  <ToggleLeft size={20} />
                {/if}
              </button>
              <button
                onclick={() => openEdit(service)}
                class="rounded-lg p-1.5 transition-colors cursor-pointer"
                style="color: var(--text-secondary);"
                onmouseenter={(e) =>
                  (e.currentTarget.style.background = "var(--hover)")}
                onmouseleave={(e) =>
                  (e.currentTarget.style.background = "transparent")}
              >
                <Pencil size={16} />
              </button>
            </div>
          </div>
        </Card>
      {/each}
    </div>
  {/if}

  <!-- Edit Modal -->
  <Modal bind:open={editOpen} title="Servis Düzenle">
    {#if editingService}
      <div class="space-y-4">
        <label
          class="block text-xs font-medium"
          style="color: var(--text-secondary);"
        >
          <span class="mb-1 block">Başlık</span>
          <input
            type="text"
            bind:value={formData.title}
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
            rows="3"
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text);"
          ></textarea>
        </label>
        <label
          class="block text-xs font-medium"
          style="color: var(--text-secondary);"
        >
          <span class="mb-1 block">Özellikler (her satıra bir tane)</span>
          <textarea
            bind:value={formData.features}
            rows="4"
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text);"
          ></textarea>
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

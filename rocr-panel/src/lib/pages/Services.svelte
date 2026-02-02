<script>
  import { data } from "../stores/data.js";
  import Card from "../components/Card.svelte";
  import Modal from "../components/Modal.svelte";
  import { Pencil, ToggleLeft, ToggleRight, Check } from "lucide-svelte";

  let editOpen = $state(false);
  let editingService = $state(null);
  let formData = $state({ title: "", description: "", features: "" });

  function openEdit(service) {
    editingService = service;
    formData = {
      title: service.title,
      description: service.description,
      features: service.features.join("\n"),
    };
    editOpen = true;
  }

  function save() {
    if (!editingService) return;
    const features = formData.features
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    data.updateService(editingService.id, {
      title: formData.title,
      description: formData.description,
      features,
    });
    editOpen = false;
  }
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold" style="color: var(--text);">Servisler</h1>
    <p class="mt-1 text-sm" style="color: var(--text-secondary);">
      9 servis kategorisini yonetin
    </p>
  </div>

  <!-- Service List -->
  <div class="space-y-3">
    {#each $data.services as service}
      <Card>
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <h3 class="text-base font-semibold" style="color: var(--text);">{service.title}</h3>
              <span
                class="rounded-full px-2 py-0.5 text-[11px] font-medium"
                style="background: {service.active ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)'}; color: {service.active ? '#10b981' : '#ef4444'};"
              >
                {service.active ? "Aktif" : "Pasif"}
              </span>
            </div>
            <p class="mt-1 text-sm" style="color: var(--text-secondary);">{service.description}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              {#each service.features as feature}
                <span class="flex items-center gap-1 text-xs" style="color: var(--text-secondary);">
                  <Check size={12} style="color: var(--color-primary);" /> {feature}
                </span>
              {/each}
            </div>
          </div>
          <div class="flex gap-1">
            <button
              onclick={() => data.toggleService(service.id)}
              class="rounded-lg p-1.5 transition-colors cursor-pointer"
              style="color: {service.active ? '#10b981' : 'var(--text-secondary)'};"
              onmouseenter={(e) => e.currentTarget.style.background = 'var(--hover)'}
              onmouseleave={(e) => e.currentTarget.style.background = 'transparent'}
              title={service.active ? "Devre disi birak" : "Etkinlestir"}
            >
              {#if service.active}
                <ToggleRight size={20} />
              {:else}
                <ToggleLeft size={20} />
              {/if}
            </button>
            <button
              onclick={() => openEdit(service)}
              class="rounded-lg p-1.5 transition-colors cursor-pointer"
              style="color: var(--text-secondary);"
              onmouseenter={(e) => e.currentTarget.style.background = 'var(--hover)'}
              onmouseleave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>
      </Card>
    {/each}
  </div>

  <!-- Edit Modal -->
  <Modal bind:open={editOpen} title="Servis Duzenle">
    {#if editingService}
      <div class="space-y-4">
        <div>
          <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Baslik</label>
          <input
            type="text"
            bind:value={formData.title}
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text);"
          />
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Aciklama</label>
          <textarea
            bind:value={formData.description}
            rows="3"
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text);"
          ></textarea>
        </div>
        <div>
          <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">
            Ozellikler (her satira bir tane)
          </label>
          <textarea
            bind:value={formData.features}
            rows="4"
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text);"
          ></textarea>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button
            onclick={() => (editOpen = false)}
            class="rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer"
            style="color: var(--text-secondary);"
            onmouseenter={(e) => e.currentTarget.style.background = 'var(--hover)'}
            onmouseleave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            Iptal
          </button>
          <button
            onclick={save}
            class="rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors cursor-pointer"
            style="background: var(--color-primary);"
          >
            Kaydet
          </button>
        </div>
      </div>
    {/if}
  </Modal>
</div>

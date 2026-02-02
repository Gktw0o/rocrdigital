<script>
  import { data } from "../stores/data.js";
  import Card from "../components/Card.svelte";
  import Modal from "../components/Modal.svelte";
  import { Plus, Pencil, Trash2, Tag } from "lucide-svelte";

  let editOpen = $state(false);
  let editingPartner = $state(null);
  let formData = $state({ name: "", description: "", tags: "" });

  function openNew() {
    editingPartner = null;
    formData = { name: "", description: "", tags: "" };
    editOpen = true;
  }

  function openEdit(partner) {
    editingPartner = partner;
    formData = {
      name: partner.name,
      description: partner.description,
      tags: partner.tags.join(", "),
    };
    editOpen = true;
  }

  function save() {
    const tags = formData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingPartner) {
      data.updatePartner(editingPartner.id, {
        name: formData.name,
        description: formData.description,
        tags,
      });
    } else {
      data.addPartner({
        name: formData.name,
        description: formData.description,
        tags,
      });
    }
    editOpen = false;
  }

  function remove(id) {
    data.deletePartner(id);
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold" style="color: var(--text);">Partnerler</h1>
      <p class="mt-1 text-sm" style="color: var(--text-secondary);">
        Partner ve vaka calismalarini yonetin ({$data.partners.length} partner)
      </p>
    </div>
    <button
      onclick={openNew}
      class="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors cursor-pointer"
      style="background: var(--color-primary);"
    >
      <Plus size={16} /> Yeni Partner
    </button>
  </div>

  <!-- Partner Grid -->
  <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
    {#each $data.partners as partner}
      <Card>
        <div class="space-y-3">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-base font-semibold" style="color: var(--text);">{partner.name}</h3>
              <p class="mt-1 text-sm" style="color: var(--text-secondary);">{partner.description}</p>
            </div>
            <div class="flex gap-1">
              <button
                onclick={() => openEdit(partner)}
                class="rounded-lg p-1.5 transition-colors cursor-pointer"
                style="color: var(--text-secondary);"
                onmouseenter={(e) => e.currentTarget.style.background = 'var(--hover)'}
                onmouseleave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Pencil size={14} />
              </button>
              <button
                onclick={() => remove(partner.id)}
                class="rounded-lg p-1.5 text-red-400 transition-colors cursor-pointer"
                onmouseenter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                onmouseleave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div class="flex flex-wrap gap-1.5">
            {#each partner.tags as tag}
              <span
                class="flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                style="background: var(--color-primary)15; color: var(--color-primary);"
              >
                <Tag size={10} /> {tag}
              </span>
            {/each}
          </div>
        </div>
      </Card>
    {/each}
  </div>

  <!-- Edit/Create Modal -->
  <Modal bind:open={editOpen} title={editingPartner ? "Partner Duzenle" : "Yeni Partner"}>
    <div class="space-y-4">
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Partner Adi</label>
        <input
          type="text"
          bind:value={formData.name}
          placeholder="Partner adi girin"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Aciklama</label>
        <textarea
          bind:value={formData.description}
          placeholder="Partner aciklamasi"
          rows="3"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        ></textarea>
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">
          Etiketler (virgul ile ayirin)
        </label>
        <input
          type="text"
          bind:value={formData.tags}
          placeholder="Web Experiences, AI & Automation"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
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
  </Modal>
</div>

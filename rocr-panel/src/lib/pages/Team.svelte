<script>
  import { data, teamByGroup } from "../stores/data.js";
  import Card from "../components/Card.svelte";
  import Modal from "../components/Modal.svelte";
  import { Plus, Pencil, Trash2, Users } from "lucide-svelte";

  let editOpen = $state(false);
  let editingMember = $state(null);
  let formData = $state({ name: "", role: "", group: "Founders & Leadership", description: "" });

  const groups = ["Founders & Leadership", "Design Studio", "Engineering Lab"];

  function openNew() {
    editingMember = null;
    formData = { name: "", role: "", group: "Founders & Leadership", description: "" };
    editOpen = true;
  }

  function openEdit(member) {
    editingMember = member;
    formData = {
      name: member.name,
      role: member.role,
      group: member.group,
      description: member.description,
    };
    editOpen = true;
  }

  function save() {
    if (editingMember) {
      data.updateTeamMember(editingMember.id, { ...formData });
    } else {
      data.addTeamMember({ ...formData });
    }
    editOpen = false;
  }

  function remove(id) {
    data.deleteTeamMember(id);
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold" style="color: var(--text);">Ekip Yonetimi</h1>
      <p class="mt-1 text-sm" style="color: var(--text-secondary);">
        Ekip uyelerini yonetin ({$data.team.length} uye)
      </p>
    </div>
    <button
      onclick={openNew}
      class="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors cursor-pointer"
      style="background: var(--color-primary);"
    >
      <Plus size={16} /> Yeni Uye
    </button>
  </div>

  <!-- Team by Groups -->
  {#each groups as group}
    {@const members = $teamByGroup[group] || []}
    <div>
      <div class="mb-3 flex items-center gap-2">
        <Users size={16} style="color: var(--color-primary);" />
        <h2 class="text-sm font-semibold uppercase tracking-wider" style="color: var(--text-secondary);">
          {group}
        </h2>
        <span class="text-xs" style="color: var(--text-secondary);">({members.length})</span>
      </div>
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {#each members as member}
          <Card>
            <div class="flex items-start justify-between">
              <div class="flex gap-3">
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style="background: var(--color-primary);"
                >
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 class="text-sm font-semibold" style="color: var(--text);">{member.name}</h3>
                  <p class="text-xs" style="color: var(--color-primary);">{member.role}</p>
                  <p class="mt-1 text-xs" style="color: var(--text-secondary);">{member.description}</p>
                </div>
              </div>
              <div class="flex gap-1">
                <button
                  onclick={() => openEdit(member)}
                  class="rounded-lg p-1 transition-colors cursor-pointer"
                  style="color: var(--text-secondary);"
                  onmouseenter={(e) => e.currentTarget.style.background = 'var(--hover)'}
                  onmouseleave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Pencil size={12} />
                </button>
                <button
                  onclick={() => remove(member.id)}
                  class="rounded-lg p-1 text-red-400 transition-colors cursor-pointer"
                  onmouseenter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                  onmouseleave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </Card>
        {/each}
      </div>
    </div>
  {/each}

  <!-- Edit/Create Modal -->
  <Modal bind:open={editOpen} title={editingMember ? "Uye Duzenle" : "Yeni Uye"}>
    <div class="space-y-4">
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Isim</label>
        <input
          type="text"
          bind:value={formData.name}
          placeholder="Isim soyisim"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Rol</label>
        <input
          type="text"
          bind:value={formData.role}
          placeholder="Unvan / Rol"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Grup</label>
        <select
          bind:value={formData.group}
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        >
          {#each groups as group}
            <option value={group}>{group}</option>
          {/each}
        </select>
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Aciklama</label>
        <textarea
          bind:value={formData.description}
          rows="3"
          placeholder="Kisa aciklama"
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
  </Modal>
</div>

<script>
  import { onMount } from "svelte";
  import { data, teamByGroup, loadingStates } from "../stores/data.js";
  import Card from "../components/Card.svelte";
  import Modal from "../components/Modal.svelte";
  import {
    Plus,
    Pencil,
    Trash2,
    Users,
    RefreshCw,
    Loader2,
  } from "lucide-svelte";

  let editOpen = $state(false);
  let editingMember = $state(null);
  let formData = $state({
    name: "",
    role: "",
    group: "Founders & Leadership",
    description: "",
  });
  let saving = $state(false);
  let error = $state(null);

  const groups = [
    "Founders & Leadership",
    "Design Studio",
    "Engineering Lab",
    "Marketing",
    "Operations",
  ];

  onMount(async () => {
    if (!$data.team || $data.team.length === 0) {
      await data.loadTeam();
    }
  });

  function openNew() {
    editingMember = null;
    formData = {
      name: "",
      role: "",
      group: "Founders & Leadership",
      description: "",
    };
    error = null;
    editOpen = true;
  }

  function openEdit(member) {
    editingMember = member;
    formData = {
      name: member.name || "",
      role: member.role || "",
      group: member.group || "Founders & Leadership",
      description: member.description || "",
    };
    error = null;
    editOpen = true;
  }

  async function save() {
    if (!formData.name.trim()) {
      error = "İsim gerekli";
      return;
    }

    saving = true;
    error = null;

    try {
      if (editingMember) {
        await data.updateTeamMember(editingMember.id, {
          name: formData.name.trim(),
          role: formData.role.trim(),
          group: formData.group,
          description: formData.description.trim(),
        });
      } else {
        await data.addTeamMember({
          name: formData.name.trim(),
          role: formData.role.trim(),
          group: formData.group,
          description: formData.description.trim(),
        });
      }
      editOpen = false;
    } catch (err) {
      console.error("Failed to save team member:", err);
      error = err.message || "Üye kaydedilirken hata oluştu";
    } finally {
      saving = false;
    }
  }

  async function remove(id) {
    if (!confirm("Bu üyeyi silmek istediğinizden emin misiniz?")) return;

    try {
      await data.deleteTeamMember(id);
    } catch (err) {
      console.error("Failed to delete team member:", err);
      alert("Üye silinirken hata oluştu: " + err.message);
    }
  }

  async function handleRefresh() {
    await data.loadTeam();
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold" style="color: var(--text);">
        Ekip Yönetimi
      </h1>
      <p class="mt-1 text-sm" style="color: var(--text-secondary);">
        Ekip üyelerini yönetin ({$data.team?.length || 0} üye)
      </p>
    </div>
    <div class="flex items-center gap-2">
      <button
        onclick={handleRefresh}
        disabled={$loadingStates.team}
        class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-50"
        style="background: var(--surface); color: var(--text);"
      >
        <RefreshCw
          size={16}
          class={$loadingStates.team ? "animate-spin" : ""}
        />
      </button>
      <button
        onclick={openNew}
        class="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors cursor-pointer"
        style="background: var(--color-primary);"
      >
        <Plus size={16} /> Yeni Üye
      </button>
    </div>
  </div>

  <!-- Loading State -->
  {#if $loadingStates.team}
    <div class="space-y-6">
      {#each Array(2) as _}
        <div class="space-y-3">
          <div class="h-5 w-40 rounded bg-gray-700 animate-pulse"></div>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {#each Array(3) as _}
              <Card>
                <div class="animate-pulse flex gap-3">
                  <div class="h-10 w-10 rounded-full bg-gray-700"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 w-24 rounded bg-gray-700"></div>
                    <div class="h-3 w-32 rounded bg-gray-700"></div>
                  </div>
                </div>
              </Card>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {:else if !$data.team || $data.team.length === 0}
    <Card>
      <div class="py-12 text-center">
        <p style="color: var(--text-secondary);">
          Henüz ekip üyesi eklenmemiş.
        </p>
        <button
          onclick={openNew}
          class="mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
          style="background: var(--color-primary); color: white;"
        >
          <Plus size={16} /> İlk Üyeyi Ekle
        </button>
      </div>
    </Card>
  {:else}
    <!-- Team by Groups -->
    {#each groups as group}
      {@const members = $teamByGroup[group] || []}
      {#if members.length > 0}
        <div>
          <div class="mb-3 flex items-center gap-2">
            <Users size={16} style="color: var(--color-primary);" />
            <h2
              class="text-sm font-semibold uppercase tracking-wider"
              style="color: var(--text-secondary);"
            >
              {group}
            </h2>
            <span class="text-xs" style="color: var(--text-secondary);"
              >({members.length})</span
            >
          </div>
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {#each members as member}
              <Card class="hover:scale-[1.02] transition-transform">
                <div class="flex items-start justify-between">
                  <div class="flex gap-3">
                    <div
                      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style="background: var(--color-primary);"
                    >
                      {member.name?.charAt(0) || "?"}
                    </div>
                    <div>
                      <h3
                        class="text-sm font-semibold"
                        style="color: var(--text);"
                      >
                        {member.name}
                      </h3>
                      <p class="text-xs" style="color: var(--color-primary);">
                        {member.role || ""}
                      </p>
                      <p
                        class="mt-1 text-xs"
                        style="color: var(--text-secondary);"
                      >
                        {member.description || ""}
                      </p>
                    </div>
                  </div>
                  <div class="flex gap-1">
                    <button
                      onclick={() => openEdit(member)}
                      class="rounded-lg p-1 transition-colors cursor-pointer"
                      style="color: var(--text-secondary);"
                      onmouseenter={(e) =>
                        (e.currentTarget.style.background = "var(--hover)")}
                      onmouseleave={(e) =>
                        (e.currentTarget.style.background = "transparent")}
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      onclick={() => remove(member.id)}
                      class="rounded-lg p-1 text-red-400 transition-colors cursor-pointer"
                      onmouseenter={(e) =>
                        (e.currentTarget.style.background =
                          "rgba(239,68,68,0.1)")}
                      onmouseleave={(e) =>
                        (e.currentTarget.style.background = "transparent")}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </Card>
            {/each}
          </div>
        </div>
      {/if}
    {/each}
  {/if}

  <!-- Edit/Create Modal -->
  <Modal
    bind:open={editOpen}
    title={editingMember ? "Üye Düzenle" : "Yeni Üye"}
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
        <span class="mb-1 block">İsim *</span>
        <input
          type="text"
          bind:value={formData.name}
          placeholder="İsim soyisim"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
      </label>
      <label
        class="block text-xs font-medium"
        style="color: var(--text-secondary);"
      >
        <span class="mb-1 block">Rol</span>
        <input
          type="text"
          bind:value={formData.role}
          placeholder="Ünvan / Rol"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
      </label>
      <label
        class="block text-xs font-medium"
        style="color: var(--text-secondary);"
      >
        <span class="mb-1 block">Grup</span>
        <select
          bind:value={formData.group}
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none cursor-pointer"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        >
          {#each groups as group}
            <option value={group}>{group}</option>
          {/each}
        </select>
      </label>
      <label
        class="block text-xs font-medium"
        style="color: var(--text-secondary);"
      >
        <span class="mb-1 block">Açıklama</span>
        <textarea
          bind:value={formData.description}
          rows="3"
          placeholder="Kısa açıklama"
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

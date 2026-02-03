<script>
  import { onMount } from "svelte";
  import Card from "../components/Card.svelte";
  import Modal from "../components/Modal.svelte";
  import {
    FolderKanban,
    Plus,
    Search,
    Edit,
    Trash2,
    Clock,
    CheckCircle,
    AlertCircle,
  } from "lucide-svelte";
  import { projectsApi } from "../stores/api.js";

  let projects = $state([]);
  let loading = $state(true);
  let searchQuery = $state("");
  let showModal = $state(false);
  let editingProject = $state(null);
  let formData = $state({
    name: "",
    description: "",
    status: "active",
    deadline: "",
  });

  onMount(async () => {
    await loadProjects();
  });

  async function loadProjects() {
    loading = true;
    try {
      projects = await projectsApi.getAll();
    } catch (e) {
      console.error(e);
    }
    loading = false;
  }

  const filteredProjects = $derived(
    (projects || []).filter((p) =>
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  function openModal(project = null) {
    editingProject = project;
    formData = project
      ? { ...project }
      : { name: "", description: "", status: "active", deadline: "" };
    showModal = true;
  }

  async function handleSubmit() {
    if (editingProject) {
      await projectsApi.update(editingProject.id, formData);
    } else {
      await projectsApi.create(formData);
    }
    await loadProjects();
    showModal = false;
  }

  async function handleDelete(id) {
    if (confirm("Bu projeyi silmek istediğinize emin misiniz?")) {
      await projectsApi.delete(id);
      await loadProjects();
    }
  }

  function getStatusIcon(status) {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "active":
        return Clock;
      default:
        return AlertCircle;
    }
  }

  function getStatusLabel(status) {
    switch (status) {
      case "completed":
        return "Tamamlandı";
      case "active":
        return "Aktif";
      case "paused":
        return "Beklemede";
      default:
        return status;
    }
  }
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Projeler</h1>
      <p class="page-subtitle">Proje yönetimi</p>
    </div>
    <button class="primary-btn" onclick={() => openModal()}>
      <Plus size={18} />
      <span>Yeni Proje</span>
    </button>
  </header>

  <div class="projects-grid">
    {#if loading}
      {#each Array(6) as _}
        <Card>
          <div class="skeleton"></div>
        </Card>
      {/each}
    {:else if filteredProjects.length === 0}
      <div class="empty">
        <FolderKanban size={48} />
        <p>Proje bulunamadı</p>
      </div>
    {:else}
      {#each filteredProjects as project}
        <Card>
          <div class="project-card">
            <div class="project-header">
              <h3 class="project-name">{project.name}</h3>
              <span class="project-status status-{project.status}">
                <svelte:component
                  this={getStatusIcon(project.status)}
                  size={14}
                />
                <span>{getStatusLabel(project.status)}</span>
              </span>
            </div>

            <p class="project-desc">{project.description || "Açıklama yok"}</p>

            {#if project.deadline}
              <div class="project-deadline">
                <Clock size={14} />
                <span
                  >{new Date(project.deadline).toLocaleDateString(
                    "tr-TR",
                  )}</span
                >
              </div>
            {/if}

            <div class="project-actions">
              <button class="action-btn" onclick={() => openModal(project)}>
                <Edit size={16} />
              </button>
              <button
                class="action-btn danger"
                onclick={() => handleDelete(project.id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </Card>
      {/each}
    {/if}
  </div>
</div>

<Modal
  bind:open={showModal}
  title={editingProject ? "Proje Düzenle" : "Yeni Proje"}
>
  <form
    class="form"
    onsubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}
  >
    <div class="form-group">
      <label>Proje Adı</label>
      <input type="text" bind:value={formData.name} required />
    </div>
    <div class="form-group">
      <label>Açıklama</label>
      <textarea bind:value={formData.description} rows="3"></textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Durum</label>
        <select bind:value={formData.status}>
          <option value="active">Aktif</option>
          <option value="completed">Tamamlandı</option>
          <option value="paused">Beklemede</option>
        </select>
      </div>
      <div class="form-group">
        <label>Bitiş Tarihi</label>
        <input type="date" bind:value={formData.deadline} />
      </div>
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
  }

  .projects-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  @media (max-width: 1024px) {
    .projects-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .projects-grid {
      grid-template-columns: 1fr;
    }
  }

  .project-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .project-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .project-name {
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
  }

  .project-status {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 999px;
    flex-shrink: 0;
  }

  .project-status.status-active {
    background: #dbeafe;
    color: #1e40af;
  }

  .project-status.status-completed {
    background: #d1fae5;
    color: #065f46;
  }

  .project-status.status-paused {
    background: #fef3c7;
    color: #92400e;
  }

  .project-desc {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .project-deadline {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text-muted);
  }

  .project-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: var(--radius-sm);
    background: var(--bg-tertiary);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s;
  }

  .action-btn:hover {
    color: var(--text);
  }
  .action-btn.danger:hover {
    color: var(--danger);
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 64px;
    color: var(--text-muted);
    grid-column: 1 / -1;
  }

  .skeleton {
    height: 150px;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    animation: pulse 1.5s ease-in-out infinite;
  }

  /* Form */
  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
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
  .form-group textarea,
  .form-group select {
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg);
    color: var(--text);
    font-size: 14px;
    outline: none;
  }

  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
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
  }

  .btn-secondary {
    background: var(--bg-tertiary);
    color: var(--text);
  }
  .btn-primary {
    background: var(--primary);
    color: white;
  }
</style>

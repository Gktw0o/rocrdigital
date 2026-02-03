<script>
  import { onMount } from "svelte";
  import { data, isLoading } from "../stores/data.js";
  import Card from "../components/Card.svelte";
  import Modal from "../components/Modal.svelte";
  import { Briefcase, Plus, Search, Edit, Trash2 } from "lucide-svelte";
  import { servicesApi } from "../stores/api.js";

  let searchQuery = $state("");
  let showModal = $state(false);
  let editingService = $state(null);
  let formData = $state({ title: "", description: "", icon: "", features: [] });

  onMount(() => data.init());

  const filteredServices = $derived(
    ($data.services || []).filter((s) =>
      s.title?.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  function openModal(service = null) {
    editingService = service;
    formData = service
      ? { ...service, features: service.features || [] }
      : { title: "", description: "", icon: "", features: [] };
    showModal = true;
  }

  async function handleSubmit() {
    if (editingService) {
      await servicesApi.update(editingService.id, formData);
    } else {
      await servicesApi.create(formData);
    }
    await data.refresh();
    showModal = false;
  }

  async function handleDelete(id) {
    if (confirm("Bu servisi silmek istediğinize emin misiniz?")) {
      await servicesApi.delete(id);
      await data.refresh();
    }
  }
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Servisler</h1>
      <p class="page-subtitle">Sunulan hizmetler</p>
    </div>
    <button class="primary-btn" onclick={() => openModal()}>
      <Plus size={18} />
      <span>Yeni Servis</span>
    </button>
  </header>

  <div class="services-grid">
    {#if $isLoading}
      {#each Array(6) as _}
        <Card>
          <div class="skeleton"></div>
        </Card>
      {/each}
    {:else if filteredServices.length === 0}
      <Card class="empty-card">
        <div class="empty">
          <Briefcase size={48} />
          <p>Servis bulunamadı</p>
        </div>
      </Card>
    {:else}
      {#each filteredServices as service}
        <Card>
          <div class="service-card">
            <div class="service-icon">
              {service.icon || "⚙️"}
            </div>
            <h3 class="service-title">{service.title}</h3>
            <p class="service-desc">{service.description}</p>
            {#if service.features?.length > 0}
              <ul class="service-features">
                {#each service.features.slice(0, 3) as feature}
                  <li>{feature}</li>
                {/each}
              </ul>
            {/if}
            <div class="service-actions">
              <button class="action-btn" onclick={() => openModal(service)}>
                <Edit size={16} />
              </button>
              <button
                class="action-btn danger"
                onclick={() => handleDelete(service.id)}
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
  title={editingService ? "Servis Düzenle" : "Yeni Servis"}
>
  <form
    class="form"
    onsubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}
  >
    <div class="form-group">
      <label>Servis Adı</label>
      <input type="text" bind:value={formData.title} required />
    </div>
    <div class="form-group">
      <label>Icon (Emoji)</label>
      <input type="text" bind:value={formData.icon} placeholder="🚀" />
    </div>
    <div class="form-group">
      <label>Açıklama</label>
      <textarea bind:value={formData.description} rows="3"></textarea>
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

  .services-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  @media (max-width: 1024px) {
    .services-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .services-grid {
      grid-template-columns: 1fr;
    }
  }

  .service-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .service-icon {
    font-size: 32px;
  }

  .service-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
  }

  .service-desc {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .service-features {
    padding-left: 16px;
    font-size: 13px;
    color: var(--text-secondary);
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .service-actions {
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

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* Form */
  .form {
    display: flex;
    flex-direction: column;
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
  .form-group textarea {
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg);
    color: var(--text);
    font-size: 14px;
    outline: none;
  }

  .form-group input:focus,
  .form-group textarea:focus {
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

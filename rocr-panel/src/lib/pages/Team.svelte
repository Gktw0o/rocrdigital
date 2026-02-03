<script>
  import { onMount } from "svelte";
  import { data, isLoading } from "../stores/data.js";
  import Card from "../components/Card.svelte";
  import Modal from "../components/Modal.svelte";
  import {
    Users,
    Plus,
    Search,
    Edit,
    Trash2,
    Mail,
    Phone,
  } from "lucide-svelte";
  import { teamApi } from "../stores/api.js";

  let searchQuery = $state("");
  let showModal = $state(false);
  let editingMember = $state(null);
  let formData = $state({
    name: "",
    role: "",
    email: "",
    phone: "",
    photo: "",
    bio: "",
  });

  onMount(() => data.init());

  const filteredTeam = $derived(
    ($data.team || []).filter(
      (m) =>
        m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role?.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  function openModal(member = null) {
    editingMember = member;
    formData = member
      ? { ...member }
      : { name: "", role: "", email: "", phone: "", photo: "", bio: "" };
    showModal = true;
  }

  async function handleSubmit() {
    if (editingMember) {
      await teamApi.update(editingMember.id, formData);
    } else {
      await teamApi.create(formData);
    }
    await data.refresh();
    showModal = false;
  }

  async function handleDelete(id) {
    if (confirm("Bu ekip üyesini silmek istediğinize emin misiniz?")) {
      await teamApi.delete(id);
      await data.refresh();
    }
  }
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Ekip</h1>
      <p class="page-subtitle">Ekip üyeleri</p>
    </div>
    <button class="primary-btn" onclick={() => openModal()}>
      <Plus size={18} />
      <span>Yeni Üye</span>
    </button>
  </header>

  <div class="team-grid">
    {#if $isLoading}
      {#each Array(4) as _}
        <Card>
          <div class="skeleton"></div>
        </Card>
      {/each}
    {:else if filteredTeam.length === 0}
      <div class="empty">
        <Users size={48} />
        <p>Ekip üyesi bulunamadı</p>
      </div>
    {:else}
      {#each filteredTeam as member}
        <Card>
          <div class="member-card">
            <div class="member-header">
              {#if member.photo}
                <img
                  src={member.photo}
                  alt={member.name}
                  class="member-photo"
                />
              {:else}
                <div class="member-avatar">
                  {member.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              {/if}
              <div>
                <h3 class="member-name">{member.name}</h3>
                <p class="member-role">{member.role}</p>
              </div>
            </div>

            {#if member.bio}
              <p class="member-bio">{member.bio}</p>
            {/if}

            <div class="member-contact">
              {#if member.email}
                <a href="mailto:{member.email}" class="contact-link">
                  <Mail size={14} />
                  <span>{member.email}</span>
                </a>
              {/if}
              {#if member.phone}
                <a href="tel:{member.phone}" class="contact-link">
                  <Phone size={14} />
                  <span>{member.phone}</span>
                </a>
              {/if}
            </div>

            <div class="member-actions">
              <button class="action-btn" onclick={() => openModal(member)}>
                <Edit size={16} />
              </button>
              <button
                class="action-btn danger"
                onclick={() => handleDelete(member.id)}
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

<Modal bind:open={showModal} title={editingMember ? "Üye Düzenle" : "Yeni Üye"}>
  <form
    class="form"
    onsubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}
  >
    <div class="form-row">
      <div class="form-group">
        <label>Ad Soyad</label>
        <input type="text" bind:value={formData.name} required />
      </div>
      <div class="form-group">
        <label>Pozisyon</label>
        <input type="text" bind:value={formData.role} required />
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>E-posta</label>
        <input type="email" bind:value={formData.email} />
      </div>
      <div class="form-group">
        <label>Telefon</label>
        <input type="tel" bind:value={formData.phone} />
      </div>
    </div>
    <div class="form-group">
      <label>Fotoğraf URL</label>
      <input type="url" bind:value={formData.photo} placeholder="https://..." />
    </div>
    <div class="form-group">
      <label>Biyografi</label>
      <textarea bind:value={formData.bio} rows="3"></textarea>
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

  .team-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  @media (max-width: 1024px) {
    .team-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .team-grid {
      grid-template-columns: 1fr;
    }
  }

  .member-card {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .member-header {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .member-photo {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
  }

  .member-avatar {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 600;
    color: white;
  }

  .member-name {
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
  }

  .member-role {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .member-bio {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .member-contact {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .contact-link {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text-secondary);
    text-decoration: none;
  }

  .contact-link:hover {
    color: var(--primary);
  }

  .member-actions {
    display: flex;
    gap: 8px;
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
    height: 200px;
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

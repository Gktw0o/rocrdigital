<script>
  import { onMount } from "svelte";
  import { data, isLoading, dataError } from "../stores/data.js";
  import {
    formatDate,
    getStatusColor,
    getStatusLabel,
  } from "../utils/index.js";
  import Card from "../components/Card.svelte";
  import {
    Mail,
    Handshake,
    Briefcase,
    Users,
    ArrowRight,
    RefreshCw,
    AlertCircle,
  } from "lucide-svelte";
  import { push } from "svelte-spa-router";

  let initialized = $state(false);
  let greeting = $state("");

  onMount(async () => {
    const hour = new Date().getHours();
    if (hour < 12) greeting = "Günaydın";
    else if (hour < 18) greeting = "İyi günler";
    else greeting = "İyi akşamlar";

    await data.init();
    initialized = true;
  });

  const stats = $derived([
    {
      label: "Mesajlar",
      value: $data.contacts?.length || 0,
      icon: Mail,
      color: "#3b82f6",
      route: "/contacts",
    },
    {
      label: "Partnerler",
      value: $data.partners?.length || 0,
      icon: Handshake,
      color: "#8b5cf6",
      route: "/partners",
    },
    {
      label: "Servisler",
      value: $data.services?.length || 0,
      icon: Briefcase,
      color: "#f59e0b",
      route: "/services",
    },
    {
      label: "Ekip",
      value: $data.team?.length || 0,
      icon: Users,
      color: "#22c55e",
      route: "/team",
    },
  ]);

  const recentContacts = $derived(
    [...($data.contacts || [])]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date),
      )
      .slice(0, 5),
  );

  async function handleRefresh() {
    await data.refresh();
  }
</script>

<div class="dashboard">
  <!-- Header -->
  <header class="header">
    <div>
      <h1 class="title">{greeting} 👋</h1>
      <p class="subtitle">İşte bugünün özeti</p>
    </div>
    <button class="refresh-btn" onclick={handleRefresh} disabled={$isLoading}>
      <RefreshCw size={18} class={$isLoading ? "animate-spin" : ""} />
      <span>{$isLoading ? "Yükleniyor..." : "Yenile"}</span>
    </button>
  </header>

  <!-- Error -->
  {#if $dataError}
    <Card>
      <div class="error">
        <AlertCircle size={20} />
        <span>{$dataError}</span>
      </div>
    </Card>
  {/if}

  <!-- Loading -->
  {#if $isLoading && !initialized}
    <div class="stats-grid">
      {#each Array(4) as _}
        <Card>
          <div class="skeleton"></div>
        </Card>
      {/each}
    </div>
  {:else}
    <!-- Stats -->
    <div class="stats-grid">
      {#each stats as stat}
        <Card onclick={() => push(stat.route)}>
          <div class="stat">
            <div class="stat-info">
              <span class="stat-label">{stat.label}</span>
              <span class="stat-value">{stat.value}</span>
            </div>
            <div
              class="stat-icon"
              style="background: {stat.color}20; color: {stat.color}"
            >
              <stat.icon size={24} />
            </div>
          </div>
        </Card>
      {/each}
    </div>

    <!-- Recent Messages -->
    <Card padding={false}>
      <div class="section-header">
        <div>
          <h2 class="section-title">Son Mesajlar</h2>
          <p class="section-subtitle">En son gelen iletişim talepleri</p>
        </div>
        <button class="view-all-btn" onclick={() => push("/contacts")}>
          <span>Tümünü Gör</span>
          <ArrowRight size={16} />
        </button>
      </div>

      <div class="messages-list">
        {#if recentContacts.length === 0}
          <div class="empty">
            <Mail size={40} />
            <p>Henüz mesaj yok</p>
          </div>
        {:else}
          {#each recentContacts as contact}
            <button class="message-item" onclick={() => push("/contacts")}>
              <div class="message-avatar">
                {contact.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div class="message-content">
                <div class="message-header">
                  <span class="message-name">{contact.name}</span>
                  <span class="message-status {getStatusColor(contact.status)}">
                    {getStatusLabel(contact.status)}
                  </span>
                </div>
                <p class="message-subject">{contact.subject}</p>
              </div>
              <span class="message-date">
                {formatDate(contact.createdAt || contact.date)}
              </span>
            </button>
          {/each}
        {/if}
      </div>
    </Card>
  {/if}
</div>

<style>
  .dashboard {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 32px;
    max-width: 1400px;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .title {
    font-size: 32px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 4px;
  }

  .subtitle {
    font-size: 15px;
    color: var(--text-secondary);
  }

  .refresh-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    color: var(--text);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  .refresh-btn:hover:not(:disabled) {
    background: var(--bg-tertiary);
  }

  .refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* Error */
  .error {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--danger);
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  @media (max-width: 1200px) {
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .stats-grid {
      grid-template-columns: 1fr;
    }
  }

  .stat {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .stat-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .stat-label {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .stat-value {
    font-size: 36px;
    font-weight: 700;
    color: var(--text);
  }

  .stat-icon {
    width: 56px;
    height: 56px;
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Skeleton */
  .skeleton {
    height: 80px;
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

  /* Section */
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    border-bottom: 1px solid var(--border);
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 4px;
  }

  .section-subtitle {
    font-size: 13px;
    color: var(--text-secondary);
  }

  .view-all-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: var(--primary);
    border: none;
    border-radius: var(--radius-sm);
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  .view-all-btn:hover {
    background: var(--primary-hover);
  }

  /* Messages */
  .messages-list {
    display: flex;
    flex-direction: column;
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 64px;
    color: var(--text-muted);
  }

  .message-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px 24px;
    border: none;
    border-bottom: 1px solid var(--border);
    background: transparent;
    text-align: left;
    cursor: pointer;
    transition: background 0.15s;
    width: 100%;
  }

  .message-item:last-child {
    border-bottom: none;
  }

  .message-item:hover {
    background: var(--bg-tertiary);
  }

  .message-avatar {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-weight: 600;
    color: white;
    flex-shrink: 0;
  }

  .message-content {
    flex: 1;
    min-width: 0;
  }

  .message-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 4px;
  }

  .message-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
  }

  .message-status {
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 999px;
    text-transform: uppercase;
  }

  .message-status.bg-yellow-100 {
    background: #fef3c7;
    color: #92400e;
  }

  .message-status.bg-green-100 {
    background: #d1fae5;
    color: #065f46;
  }

  .message-status.bg-red-100 {
    background: #fee2e2;
    color: #991b1b;
  }

  .message-status.bg-blue-100 {
    background: #dbeafe;
    color: #1e40af;
  }

  .message-subject {
    font-size: 14px;
    color: var(--text-secondary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .message-date {
    font-size: 13px;
    color: var(--text-muted);
    flex-shrink: 0;
  }
</style>

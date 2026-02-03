<script>
  import { user } from "../stores/auth.js";
  import Card from "../components/Card.svelte";
  import ThemeToggle from "../components/ThemeToggle.svelte";
  import {
    Settings as SettingsIcon,
    User,
    Bell,
    Shield,
    Palette,
  } from "lucide-svelte";

  let activeTab = $state("profile");

  const tabs = [
    { id: "profile", label: "Profil", icon: User },
    { id: "appearance", label: "Görünüm", icon: Palette },
    { id: "notifications", label: "Bildirimler", icon: Bell },
    { id: "security", label: "Güvenlik", icon: Shield },
  ];
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Ayarlar</h1>
      <p class="page-subtitle">Uygulama ve profil ayarları</p>
    </div>
  </header>

  <div class="settings-layout">
    <!-- Tabs -->
    <div class="tabs">
      {#each tabs as tab}
        <button
          class="tab"
          class:active={activeTab === tab.id}
          onclick={() => (activeTab = tab.id)}
        >
          <tab.icon size={18} />
          <span>{tab.label}</span>
        </button>
      {/each}
    </div>

    <!-- Content -->
    <div class="settings-content">
      {#if activeTab === "profile"}
        <Card>
          <h2 class="section-title">Profil Bilgileri</h2>
          <form class="form">
            <div class="form-group">
              <label>Ad Soyad</label>
              <input type="text" value={$user?.name || ""} />
            </div>
            <div class="form-group">
              <label>E-posta</label>
              <input type="email" value={$user?.email || ""} />
            </div>
            <button type="submit" class="btn-primary">Kaydet</button>
          </form>
        </Card>
      {:else if activeTab === "appearance"}
        <Card>
          <h2 class="section-title">Görünüm</h2>
          <div class="setting-item">
            <div>
              <h3 class="setting-label">Tema</h3>
              <p class="setting-desc">Koyu veya açık tema seçin</p>
            </div>
            <ThemeToggle />
          </div>
        </Card>
      {:else if activeTab === "notifications"}
        <Card>
          <h2 class="section-title">Bildirimler</h2>
          <p class="muted">Bildirim ayarları yakında eklenecek.</p>
        </Card>
      {:else if activeTab === "security"}
        <Card>
          <h2 class="section-title">Güvenlik</h2>
          <form class="form">
            <div class="form-group">
              <label>Mevcut Şifre</label>
              <input type="password" />
            </div>
            <div class="form-group">
              <label>Yeni Şifre</label>
              <input type="password" />
            </div>
            <div class="form-group">
              <label>Yeni Şifre (Tekrar)</label>
              <input type="password" />
            </div>
            <button type="submit" class="btn-primary">Şifreyi Güncelle</button>
          </form>
        </Card>
      {/if}
    </div>
  </div>
</div>

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

  .settings-layout {
    display: grid;
    grid-template-columns: 240px 1fr;
    gap: 24px;
  }

  @media (max-width: 768px) {
    .settings-layout {
      grid-template-columns: 1fr;
    }
  }

  .tabs {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .tab {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
    text-align: left;
  }

  .tab:hover {
    background: var(--bg-tertiary);
    color: var(--text);
  }

  .tab.active {
    background: var(--primary);
    color: white;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 24px;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 400px;
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

  .form-group input {
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg);
    color: var(--text);
    font-size: 14px;
    outline: none;
  }

  .form-group input:focus {
    border-color: var(--primary);
  }

  .btn-primary {
    padding: 12px 24px;
    background: var(--primary);
    border: none;
    border-radius: var(--radius-sm);
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    width: fit-content;
    margin-top: 8px;
  }

  .setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
  }

  .setting-item:last-child {
    border-bottom: none;
  }

  .setting-label {
    font-size: 15px;
    font-weight: 500;
    color: var(--text);
    margin-bottom: 4px;
  }

  .setting-desc {
    font-size: 13px;
    color: var(--text-secondary);
  }

  .muted {
    color: var(--text-muted);
  }
</style>

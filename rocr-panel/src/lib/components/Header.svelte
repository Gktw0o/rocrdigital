<script>
  import { user, logout } from "../stores/auth.js";
  import ThemeToggle from "./ThemeToggle.svelte";
  import { Bell, LogOut, User } from "lucide-svelte";

  let showDropdown = $state(false);
</script>

<header class="header">
  <div class="header-left">
    <span class="brand">ROCR Digital Admin</span>
  </div>

  <div class="header-right">
    <ThemeToggle />

    <button class="icon-btn">
      <Bell size={20} />
    </button>

    <div class="user-menu">
      <button class="user-btn" onclick={() => (showDropdown = !showDropdown)}>
        <div class="user-avatar">
          <User size={18} />
        </div>
        <span class="user-name">{$user?.name || "Admin"}</span>
      </button>

      {#if showDropdown}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="dropdown-backdrop"
          onclick={() => (showDropdown = false)}
        ></div>
        <div class="dropdown">
          <button class="dropdown-item" onclick={logout}>
            <LogOut size={16} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      {/if}
    </div>
  </div>
</header>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    padding: 0 24px;
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
  }

  .brand {
    font-size: 14px;
    font-weight: 600;
    color: var(--text);
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .icon-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.15s;
  }

  .icon-btn:hover {
    background: var(--bg-tertiary);
    color: var(--text);
  }

  /* User Menu */
  .user-menu {
    position: relative;
  }

  .user-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: transparent;
    cursor: pointer;
    transition: all 0.15s;
  }

  .user-btn:hover {
    background: var(--bg-tertiary);
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--primary);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
  }

  .user-name {
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
  }

  /* Dropdown */
  .dropdown-backdrop {
    position: fixed;
    inset: 0;
    z-index: 40;
  }

  .dropdown {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    min-width: 180px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 8px;
    z-index: 50;
    animation: fadeIn 0.15s ease-out;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--text);
    font-size: 14px;
    cursor: pointer;
    transition: all 0.15s;
  }

  .dropdown-item:hover {
    background: var(--bg-tertiary);
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>

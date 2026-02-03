<script>
  import { login, isLoading, authError } from "../stores/auth.js";
  import { Zap, Eye, EyeOff } from "lucide-svelte";

  let email = $state("");
  let password = $state("");
  let showPassword = $state(false);

  async function handleSubmit(e) {
    e.preventDefault();
    await login(email, password);
  }
</script>

<div class="login-page">
  <div class="login-card">
    <div class="login-header">
      <div class="logo">
        <Zap size={24} />
      </div>
      <h1>ROCR Panel</h1>
      <p>Yönetim paneline giriş yapın</p>
    </div>

    {#if $authError}
      <div class="error">
        {$authError}
      </div>
    {/if}

    <form class="login-form" onsubmit={handleSubmit}>
      <div class="form-group">
        <label for="email">E-posta</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="admin@example.com"
          required
        />
      </div>

      <div class="form-group">
        <label for="password">Şifre</label>
        <div class="password-input">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            bind:value={password}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            class="toggle-password"
            onclick={() => (showPassword = !showPassword)}
          >
            {#if showPassword}
              <EyeOff size={18} />
            {:else}
              <Eye size={18} />
            {/if}
          </button>
        </div>
      </div>

      <button type="submit" class="submit-btn" disabled={$isLoading}>
        {$isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
      </button>
    </form>
  </div>
</div>

<style>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: var(--bg);
  }

  .login-card {
    width: 100%;
    max-width: 400px;
    padding: 40px;
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
  }

  .login-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .logo {
    width: 56px;
    height: 56px;
    background: var(--primary);
    border-radius: var(--radius);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin: 0 auto 20px;
  }

  .login-header h1 {
    font-size: 24px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 8px;
  }

  .login-header p {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .error {
    padding: 12px 16px;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: var(--radius-sm);
    color: var(--danger);
    font-size: 14px;
    margin-bottom: 24px;
  }

  .login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .form-group label {
    font-size: 14px;
    font-weight: 500;
    color: var(--text);
  }

  .form-group input {
    width: 100%;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg);
    color: var(--text);
    font-size: 15px;
    outline: none;
    transition: border-color 0.15s;
  }

  .form-group input:focus {
    border-color: var(--primary);
  }

  .form-group input::placeholder {
    color: var(--text-muted);
  }

  .password-input {
    position: relative;
  }

  .password-input input {
    padding-right: 48px;
  }

  .toggle-password {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
  }

  .toggle-password:hover {
    color: var(--text);
  }

  .submit-btn {
    width: 100%;
    padding: 14px 24px;
    background: var(--primary);
    border: none;
    border-radius: var(--radius-sm);
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
  }

  .submit-btn:hover:not(:disabled) {
    background: var(--primary-hover);
  }

  .submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
</style>

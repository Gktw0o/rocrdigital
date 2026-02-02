<script>
  import { auth } from "../stores/auth.js";
  import { theme } from "../stores/theme.js";
  import { onMount } from "svelte";
  
  let email = $state("");
  let password = $state("");
  let isLoading = $state(false);
  let showPassword = $state(false);
  let error = $state(null);
  
  onMount(() => {
    theme.init();
  });
  
  async function handleSubmit(e) {
    e.preventDefault();
    isLoading = true;
    error = null;
    
    const success = await auth.login(email, password);
    
    if (!success) {
      error = auth.error || "Invalid email or password";
    }
    
    isLoading = false;
  }
</script>

<div class="login-container">
  <div class="login-card">
    <!-- Logo -->
    <div class="logo-section">
      <div class="logo">
        <span class="logo-text">ROCR</span>
        <span class="logo-dot">.</span>
      </div>
      <p class="logo-subtitle">Admin Panel</p>
    </div>
    
    <!-- Login Form -->
    <form onsubmit={handleSubmit} class="login-form">
      <h1 class="form-title">Welcome back</h1>
      <p class="form-subtitle">Sign in to access your dashboard</p>
      
      {#if error}
        <div class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <span>{error}</span>
        </div>
      {/if}
      
      <div class="input-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="admin@rocrdigital.com"
          required
          disabled={isLoading}
        />
      </div>
      
      <div class="input-group">
        <label for="password">Password</label>
        <div class="password-input">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            bind:value={password}
            placeholder="••••••••"
            required
            disabled={isLoading}
          />
          <button 
            type="button" 
            class="toggle-password"
            onclick={() => showPassword = !showPassword}
          >
            {#if showPassword}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
            {:else}
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            {/if}
          </button>
        </div>
      </div>
      
      <button type="submit" class="submit-btn" disabled={isLoading}>
        {#if isLoading}
          <svg class="spinner" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-opacity="0.75"/>
          </svg>
          Signing in...
        {:else}
          Sign in
        {/if}
      </button>
    </form>
    
    <p class="footer-text">
      ROCR Digital © 2026
    </p>
  </div>
</div>

<style>
  .login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  }
  
  .login-card {
    width: 100%;
    max-width: 400px;
    padding: 2.5rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.5rem;
    backdrop-filter: blur(20px);
  }
  
  .logo-section {
    text-align: center;
    margin-bottom: 2rem;
  }
  
  .logo {
    display: inline-flex;
    align-items: center;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.03em;
  }
  
  .logo-text {
    color: #fff;
  }
  
  .logo-dot {
    color: #3b82f6;
    font-size: 2.5rem;
    line-height: 1;
  }
  
  .logo-subtitle {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }
  
  .form-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #fff;
    margin: 0;
    text-align: center;
  }
  
  .form-subtitle {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.875rem;
    margin: -0.5rem 0 0.5rem;
    text-align: center;
  }
  
  .error-message {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 0.75rem;
    color: #f87171;
    font-size: 0.875rem;
  }
  
  .input-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .input-group label {
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .input-group input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    color: #fff;
    font-size: 0.9375rem;
    transition: all 0.2s ease;
  }
  
  .input-group input::placeholder {
    color: rgba(255, 255, 255, 0.3);
  }
  
  .input-group input:focus {
    outline: none;
    border-color: #3b82f6;
    background: rgba(59, 130, 246, 0.05);
  }
  
  .input-group input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .password-input {
    position: relative;
  }
  
  .password-input input {
    padding-right: 3rem;
  }
  
  .toggle-password {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    padding: 0.25rem;
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    transition: color 0.2s ease;
  }
  
  .toggle-password:hover {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    background: #3b82f6;
    border: none;
    border-radius: 0.75rem;
    color: #fff;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 0.5rem;
  }
  
  .submit-btn:hover:not(:disabled) {
    background: #2563eb;
    transform: translateY(-1px);
  }
  
  .submit-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .footer-text {
    text-align: center;
    margin-top: 2rem;
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.75rem;
  }
</style>

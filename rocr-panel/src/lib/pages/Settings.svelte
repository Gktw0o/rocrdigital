<script>
  import { theme } from "../stores/theme.js";
  import Card from "../components/Card.svelte";
  import { Sun, Moon, Monitor, Download, Upload, Database, Shield } from "lucide-svelte";

  let apiUrl = $state("");
  let autoSync = $state(false);

  function exportJSON() {
    // In production, this would call the Tauri export_data command
    alert("JSON export - Tauri komutu entegre edilecek");
  }

  function exportCSV() {
    alert("CSV export - Tauri komutu entegre edilecek");
  }

  function importData() {
    alert("Veri import - Tauri komutu entegre edilecek");
  }
</script>

<div class="space-y-6">
  <div>
    <h1 class="text-2xl font-bold" style="color: var(--text);">Ayarlar</h1>
    <p class="mt-1 text-sm" style="color: var(--text-secondary);">
      Uygulama ayarlarini yapilandirin
    </p>
  </div>

  <!-- Appearance -->
  <Card>
    <div class="mb-4 flex items-center gap-2">
      <Monitor size={18} style="color: var(--color-primary);" />
      <h3 class="text-base font-semibold" style="color: var(--text);">Gorunum</h3>
    </div>
    <div class="flex gap-3">
      <button
        onclick={() => theme.set("dark")}
        class="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-all cursor-pointer"
        style="
          border-color: {$theme === 'dark' ? 'var(--color-primary)' : 'var(--border)'};
          background: {$theme === 'dark' ? 'var(--color-primary)10' : 'transparent'};
          color: var(--text);
        "
      >
        <Moon size={16} /> Karanlik
      </button>
      <button
        onclick={() => theme.set("light")}
        class="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 py-3 text-sm font-medium transition-all cursor-pointer"
        style="
          border-color: {$theme === 'light' ? 'var(--color-primary)' : 'var(--border)'};
          background: {$theme === 'light' ? 'var(--color-primary)10' : 'transparent'};
          color: var(--text);
        "
      >
        <Sun size={16} /> Aydinlik
      </button>
    </div>
  </Card>

  <!-- Data Management -->
  <Card>
    <div class="mb-4 flex items-center gap-2">
      <Database size={18} style="color: var(--color-accent-purple);" />
      <h3 class="text-base font-semibold" style="color: var(--text);">Veri Yonetimi</h3>
    </div>
    <div class="space-y-3">
      <div class="flex items-center justify-between rounded-xl p-3" style="background: var(--hover);">
        <div>
          <p class="text-sm font-medium" style="color: var(--text);">JSON Olarak Disa Aktar</p>
          <p class="text-xs" style="color: var(--text-secondary);">Tum verileri JSON dosyasi olarak indirin</p>
        </div>
        <button
          onclick={exportJSON}
          class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer"
          style="background: var(--bg); border: 1px solid var(--border); color: var(--text);"
        >
          <Download size={14} /> JSON
        </button>
      </div>
      <div class="flex items-center justify-between rounded-xl p-3" style="background: var(--hover);">
        <div>
          <p class="text-sm font-medium" style="color: var(--text);">CSV Olarak Disa Aktar</p>
          <p class="text-xs" style="color: var(--text-secondary);">Mesajlari CSV dosyasi olarak indirin</p>
        </div>
        <button
          onclick={exportCSV}
          class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer"
          style="background: var(--bg); border: 1px solid var(--border); color: var(--text);"
        >
          <Download size={14} /> CSV
        </button>
      </div>
      <div class="flex items-center justify-between rounded-xl p-3" style="background: var(--hover);">
        <div>
          <p class="text-sm font-medium" style="color: var(--text);">Veri Icerik Aktar</p>
          <p class="text-xs" style="color: var(--text-secondary);">JSON dosyasindan veri yukleyin</p>
        </div>
        <button
          onclick={importData}
          class="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer"
          style="background: var(--bg); border: 1px solid var(--border); color: var(--text);"
        >
          <Upload size={14} /> Yukle
        </button>
      </div>
    </div>
  </Card>

  <!-- API Configuration -->
  <Card>
    <div class="mb-4 flex items-center gap-2">
      <Shield size={18} style="color: var(--color-accent-orange);" />
      <h3 class="text-base font-semibold" style="color: var(--text);">API Yapilandirmasi</h3>
    </div>
    <div class="space-y-3">
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">API URL</label>
        <input
          type="text"
          bind:value={apiUrl}
          placeholder="https://api.rocrdigital.com"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
      </div>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium" style="color: var(--text);">Otomatik Senkronizasyon</p>
          <p class="text-xs" style="color: var(--text-secondary);">Degisiklikleri otomatik olarak API'ye gonder</p>
        </div>
        <button
          onclick={() => (autoSync = !autoSync)}
          class="relative h-6 w-11 rounded-full transition-colors cursor-pointer"
          style="background: {autoSync ? 'var(--color-primary)' : 'var(--border)'};"
        >
          <span
            class="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform"
            style="transform: translateX({autoSync ? '20px' : '0'});"
          ></span>
        </button>
      </div>
    </div>
  </Card>

  <!-- App Info -->
  <Card>
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm font-medium" style="color: var(--text);">ROCR Panel</p>
        <p class="text-xs" style="color: var(--text-secondary);">Versiyon 0.1.0 - Svelte 5 + Tauri 2</p>
      </div>
      <span class="text-xs" style="color: var(--text-secondary);">ROCR Digital &copy; 2025</span>
    </div>
  </Card>
</div>

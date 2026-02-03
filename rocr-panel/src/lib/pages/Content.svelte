<script>
  import { onMount } from "svelte";
  import { data, loadingStates } from "../stores/data.js";
  import Card from "../components/Card.svelte";
  import {
    Save,
    Type,
    Info,
    BarChart3,
    Heart,
    RefreshCw,
    Loader2,
    Check,
  } from "lucide-svelte";

  // Form states - will be initialized from API data
  let heroHeadline = $state("");
  let heroSubheadline = $state("");
  let aboutDescription = $state("");
  let aboutMission = $state("");
  let aboutVision = $state("");
  let statProjects = $state("");
  let statClients = $state("");
  let statYears = $state("");
  let statServices = $state("");
  let values = $state("");

  let saveMessage = $state("");
  let savingSection = $state(null);
  let initialized = $state(false);

  onMount(async () => {
    await loadContent();
  });

  async function loadContent() {
    try {
      await data.loadContent();
      initializeFormFromStore();
      initialized = true;
    } catch (err) {
      console.error("Failed to load content:", err);
    }
  }

  function initializeFormFromStore() {
    const content = $data.content || {};

    // Hero
    heroHeadline = content.hero?.headline || "";
    heroSubheadline = content.hero?.subheadline || "";

    // About
    aboutDescription = content.about?.description || "";
    aboutMission = content.about?.mission || "";
    aboutVision = content.about?.vision || "";

    // Stats
    statProjects = content.stats?.projects || "";
    statClients = content.stats?.clients || "";
    statYears = content.stats?.years || "";
    statServices = content.stats?.services || "";

    // Values
    values = Array.isArray(content.values) ? content.values.join("\n") : "";
  }

  async function saveHero() {
    savingSection = "hero";
    try {
      await data.updateContent("hero", {
        headline: heroHeadline.trim(),
        subheadline: heroSubheadline.trim(),
      });
      flash("Hero bölümü kaydedildi");
    } catch (err) {
      console.error("Failed to save hero:", err);
      flash("Hata: " + err.message, true);
    } finally {
      savingSection = null;
    }
  }

  async function saveAbout() {
    savingSection = "about";
    try {
      await data.updateContent("about", {
        description: aboutDescription.trim(),
        mission: aboutMission.trim(),
        vision: aboutVision.trim(),
      });
      flash("Hakkımızda bölümü kaydedildi");
    } catch (err) {
      console.error("Failed to save about:", err);
      flash("Hata: " + err.message, true);
    } finally {
      savingSection = null;
    }
  }

  async function saveStats() {
    savingSection = "stats";
    try {
      await data.updateContent("stats", {
        projects: statProjects.trim(),
        clients: statClients.trim(),
        years: statYears.trim(),
        services: statServices.trim(),
      });
      flash("İstatistikler kaydedildi");
    } catch (err) {
      console.error("Failed to save stats:", err);
      flash("Hata: " + err.message, true);
    } finally {
      savingSection = null;
    }
  }

  async function saveValues() {
    savingSection = "values";
    try {
      await data.updateContent(
        "values",
        values
          .split("\n")
          .map((v) => v.trim())
          .filter(Boolean),
      );
      flash("Değerler kaydedildi");
    } catch (err) {
      console.error("Failed to save values:", err);
      flash("Hata: " + err.message, true);
    } finally {
      savingSection = null;
    }
  }

  function flash(msg, isError = false) {
    saveMessage = { text: msg, isError };
    setTimeout(() => (saveMessage = ""), 3000);
  }

  async function handleRefresh() {
    await loadContent();
    flash("İçerik yenilendi");
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold" style="color: var(--text);">
        İçerik Yönetimi
      </h1>
      <p class="mt-1 text-sm" style="color: var(--text-secondary);">
        Web sitesi içeriğini düzenleyin
      </p>
    </div>
    <div class="flex items-center gap-3">
      {#if saveMessage}
        <span
          class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium"
          style="background: {saveMessage.isError
            ? 'rgba(239,68,68,0.15)'
            : 'rgba(16,185,129,0.15)'}; color: {saveMessage.isError
            ? '#ef4444'
            : '#10b981'};"
        >
          {#if !saveMessage.isError}
            <Check size={14} />
          {/if}
          {saveMessage.text}
        </span>
      {/if}
      <button
        onclick={handleRefresh}
        disabled={$loadingStates.content}
        class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-50"
        style="background: var(--surface); color: var(--text);"
      >
        <RefreshCw
          size={16}
          class={$loadingStates.content ? "animate-spin" : ""}
        />
      </button>
    </div>
  </div>

  {#if $loadingStates.content && !initialized}
    <!-- Loading skeleton -->
    <div class="space-y-6">
      {#each Array(4) as _}
        <Card>
          <div class="animate-pulse space-y-4">
            <div class="flex items-center gap-2">
              <div class="h-5 w-5 rounded bg-gray-700"></div>
              <div class="h-5 w-32 rounded bg-gray-700"></div>
            </div>
            <div class="h-10 w-full rounded bg-gray-700"></div>
            <div class="h-10 w-full rounded bg-gray-700"></div>
          </div>
        </Card>
      {/each}
    </div>
  {:else}
    <!-- Hero Section -->
    <Card>
      <div class="mb-4 flex items-center gap-2">
        <Type size={18} style="color: var(--color-primary);" />
        <h3 class="text-base font-semibold" style="color: var(--text);">
          Hero Bölümü
        </h3>
      </div>
      <div class="space-y-3">
        <label
          class="block text-xs font-medium"
          style="color: var(--text-secondary);"
        >
          <span class="mb-1 block">Ana Başlık</span>
          <input
            type="text"
            bind:value={heroHeadline}
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text);"
          />
        </label>
        <label
          class="block text-xs font-medium"
          style="color: var(--text-secondary);"
        >
          <span class="mb-1 block">Alt Başlık</span>
          <input
            type="text"
            bind:value={heroSubheadline}
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text);"
          />
        </label>
        <div class="flex justify-end">
          <button
            onclick={saveHero}
            disabled={savingSection === "hero"}
            class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:opacity-50"
            style="background: var(--color-primary);"
          >
            {#if savingSection === "hero"}
              <Loader2 size={14} class="animate-spin" />
            {:else}
              <Save size={14} />
            {/if}
            Kaydet
          </button>
        </div>
      </div>
    </Card>

    <!-- About Section -->
    <Card>
      <div class="mb-4 flex items-center gap-2">
        <Info size={18} style="color: var(--color-accent-purple);" />
        <h3 class="text-base font-semibold" style="color: var(--text);">
          Hakkımızda
        </h3>
      </div>
      <div class="space-y-3">
        <label
          class="block text-xs font-medium"
          style="color: var(--text-secondary);"
        >
          <span class="mb-1 block">Açıklama</span>
          <textarea
            bind:value={aboutDescription}
            rows="2"
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text);"
          ></textarea>
        </label>
        <label
          class="block text-xs font-medium"
          style="color: var(--text-secondary);"
        >
          <span class="mb-1 block">Misyon</span>
          <textarea
            bind:value={aboutMission}
            rows="2"
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text);"
          ></textarea>
        </label>
        <label
          class="block text-xs font-medium"
          style="color: var(--text-secondary);"
        >
          <span class="mb-1 block">Vizyon</span>
          <textarea
            bind:value={aboutVision}
            rows="2"
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text);"
          ></textarea>
        </label>
        <div class="flex justify-end">
          <button
            onclick={saveAbout}
            disabled={savingSection === "about"}
            class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:opacity-50"
            style="background: var(--color-primary);"
          >
            {#if savingSection === "about"}
              <Loader2 size={14} class="animate-spin" />
            {:else}
              <Save size={14} />
            {/if}
            Kaydet
          </button>
        </div>
      </div>
    </Card>

    <!-- Stats Section -->
    <Card>
      <div class="mb-4 flex items-center gap-2">
        <BarChart3 size={18} style="color: var(--color-accent-orange);" />
        <h3 class="text-base font-semibold" style="color: var(--text);">
          İstatistikler
        </h3>
      </div>
      <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <label
          class="block text-xs font-medium"
          style="color: var(--text-secondary);"
        >
          <span class="mb-1 block">Projeler</span>
          <input
            type="text"
            bind:value={statProjects}
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text);"
          />
        </label>
        <label
          class="block text-xs font-medium"
          style="color: var(--text-secondary);"
        >
          <span class="mb-1 block">Müşteriler</span>
          <input
            type="text"
            bind:value={statClients}
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text);"
          />
        </label>
        <label
          class="block text-xs font-medium"
          style="color: var(--text-secondary);"
        >
          <span class="mb-1 block">Yıl</span>
          <input
            type="text"
            bind:value={statYears}
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text);"
          />
        </label>
        <label
          class="block text-xs font-medium"
          style="color: var(--text-secondary);"
        >
          <span class="mb-1 block">Servisler</span>
          <input
            type="text"
            bind:value={statServices}
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text);"
          />
        </label>
      </div>
      <div class="mt-3 flex justify-end">
        <button
          onclick={saveStats}
          disabled={savingSection === "stats"}
          class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:opacity-50"
          style="background: var(--color-primary);"
        >
          {#if savingSection === "stats"}
            <Loader2 size={14} class="animate-spin" />
          {:else}
            <Save size={14} />
          {/if}
          Kaydet
        </button>
      </div>
    </Card>

    <!-- Values Section -->
    <Card>
      <div class="mb-4 flex items-center gap-2">
        <Heart size={18} style="color: #10b981;" />
        <h3 class="text-base font-semibold" style="color: var(--text);">
          Değerlerimiz
        </h3>
      </div>
      <div class="space-y-3">
        <label
          class="block text-xs font-medium"
          style="color: var(--text-secondary);"
        >
          <span class="mb-1 block">Değerler (her satıra bir tane)</span>
          <textarea
            bind:value={values}
            rows="4"
            class="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text);"
          ></textarea>
        </label>
        <div class="flex justify-end">
          <button
            onclick={saveValues}
            disabled={savingSection === "values"}
            class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white cursor-pointer disabled:opacity-50"
            style="background: var(--color-primary);"
          >
            {#if savingSection === "values"}
              <Loader2 size={14} class="animate-spin" />
            {:else}
              <Save size={14} />
            {/if}
            Kaydet
          </button>
        </div>
      </div>
    </Card>
  {/if}
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

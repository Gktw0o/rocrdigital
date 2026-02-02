<script>
  import { data } from "../stores/data.js";
  import Card from "../components/Card.svelte";
  import { Save, Type, Info, BarChart3, Heart } from "lucide-svelte";

  let heroHeadline = $state($data.content.hero.headline);
  let heroSubheadline = $state($data.content.hero.subheadline);
  let aboutDescription = $state($data.content.about.description);
  let aboutMission = $state($data.content.about.mission);
  let aboutVision = $state($data.content.about.vision);
  let statProjects = $state($data.content.stats.projects);
  let statClients = $state($data.content.stats.clients);
  let statYears = $state($data.content.stats.years);
  let statServices = $state($data.content.stats.services);
  let values = $state($data.content.values.join("\n"));

  let saveMessage = $state("");

  function saveHero() {
    data.updateContent("hero", { headline: heroHeadline, subheadline: heroSubheadline });
    flash("Hero bolumu kaydedildi");
  }

  function saveAbout() {
    data.updateContent("about", {
      description: aboutDescription,
      mission: aboutMission,
      vision: aboutVision,
    });
    flash("Hakkimizda bolumu kaydedildi");
  }

  function saveStats() {
    data.updateContent("stats", {
      projects: statProjects,
      clients: statClients,
      years: statYears,
      services: statServices,
    });
    flash("Istatistikler kaydedildi");
  }

  function saveValues() {
    data.updateContent(
      "values",
      values.split("\n").map((v) => v.trim()).filter(Boolean)
    );
    flash("Degerler kaydedildi");
  }

  function flash(msg) {
    saveMessage = msg;
    setTimeout(() => (saveMessage = ""), 2000);
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold" style="color: var(--text);">Icerik Yonetimi</h1>
      <p class="mt-1 text-sm" style="color: var(--text-secondary);">
        Web sitesi icerigini duzenleyin
      </p>
    </div>
    {#if saveMessage}
      <span class="rounded-lg px-3 py-1.5 text-sm font-medium" style="background: rgba(16,185,129,0.15); color: #10b981;">
        {saveMessage}
      </span>
    {/if}
  </div>

  <!-- Hero Section -->
  <Card>
    <div class="mb-4 flex items-center gap-2">
      <Type size={18} style="color: var(--color-primary);" />
      <h3 class="text-base font-semibold" style="color: var(--text);">Hero Bolumu</h3>
    </div>
    <div class="space-y-3">
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Ana Baslik</label>
        <input
          type="text"
          bind:value={heroHeadline}
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Alt Baslik</label>
        <input
          type="text"
          bind:value={heroSubheadline}
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
      </div>
      <div class="flex justify-end">
        <button
          onclick={saveHero}
          class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white cursor-pointer"
          style="background: var(--color-primary);"
        >
          <Save size={14} /> Kaydet
        </button>
      </div>
    </div>
  </Card>

  <!-- About Section -->
  <Card>
    <div class="mb-4 flex items-center gap-2">
      <Info size={18} style="color: var(--color-accent-purple);" />
      <h3 class="text-base font-semibold" style="color: var(--text);">Hakkimizda</h3>
    </div>
    <div class="space-y-3">
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Aciklama</label>
        <textarea
          bind:value={aboutDescription}
          rows="2"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        ></textarea>
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Misyon</label>
        <textarea
          bind:value={aboutMission}
          rows="2"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        ></textarea>
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Vizyon</label>
        <textarea
          bind:value={aboutVision}
          rows="2"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        ></textarea>
      </div>
      <div class="flex justify-end">
        <button
          onclick={saveAbout}
          class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white cursor-pointer"
          style="background: var(--color-primary);"
        >
          <Save size={14} /> Kaydet
        </button>
      </div>
    </div>
  </Card>

  <!-- Stats Section -->
  <Card>
    <div class="mb-4 flex items-center gap-2">
      <BarChart3 size={18} style="color: var(--color-accent-orange);" />
      <h3 class="text-base font-semibold" style="color: var(--text);">Istatistikler</h3>
    </div>
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Projeler</label>
        <input
          type="text"
          bind:value={statProjects}
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Musteriler</label>
        <input
          type="text"
          bind:value={statClients}
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Yil</label>
        <input
          type="text"
          bind:value={statYears}
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
      </div>
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">Servisler</label>
        <input
          type="text"
          bind:value={statServices}
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        />
      </div>
    </div>
    <div class="mt-3 flex justify-end">
      <button
        onclick={saveStats}
        class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white cursor-pointer"
        style="background: var(--color-primary);"
      >
        <Save size={14} /> Kaydet
      </button>
    </div>
  </Card>

  <!-- Values Section -->
  <Card>
    <div class="mb-4 flex items-center gap-2">
      <Heart size={18} style="color: #10b981;" />
      <h3 class="text-base font-semibold" style="color: var(--text);">Degerlerimiz</h3>
    </div>
    <div class="space-y-3">
      <div>
        <label class="mb-1 block text-xs font-medium" style="color: var(--text-secondary);">
          Degerler (her satira bir tane)
        </label>
        <textarea
          bind:value={values}
          rows="4"
          class="w-full rounded-lg border px-3 py-2 text-sm outline-none resize-none"
          style="background: var(--bg); border-color: var(--border); color: var(--text);"
        ></textarea>
      </div>
      <div class="flex justify-end">
        <button
          onclick={saveValues}
          class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white cursor-pointer"
          style="background: var(--color-primary);"
        >
          <Save size={14} /> Kaydet
        </button>
      </div>
    </div>
  </Card>
</div>

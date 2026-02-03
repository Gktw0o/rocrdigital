<script>
  import { onMount } from "svelte";
  import {
    data,
    unreadContacts,
    activeServices,
    isLoading,
    dataError,
  } from "../stores/data.js";
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

  onMount(async () => {
    console.log("Dashboard: Loading data from API...");
    await data.init();
    initialized = true;
    console.log("Dashboard: Data loaded");
  });

  const stats = $derived([
    {
      label: "Mesajlar",
      value: $data.contacts?.length || 0,
      icon: Mail,
      color: "var(--color-primary)",
      badge:
        $unreadContacts.length > 0 ? `${$unreadContacts.length} yeni` : null,
    },
    {
      label: "Partnerler",
      value: $data.partners?.length || 0,
      icon: Handshake,
      color: "var(--color-accent-purple)",
      badge: null,
    },
    {
      label: "Servisler",
      value: $activeServices.length,
      icon: Briefcase,
      color: "var(--color-accent-orange)",
      badge: null,
    },
    {
      label: "Ekip",
      value: $data.team?.length || 0,
      icon: Users,
      color: "#10b981",
      badge: null,
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
    console.log("Dashboard: Refreshing data...");
    await data.refresh();
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold" style="color: var(--text);">Dashboard</h1>
      <p class="mt-1 text-sm" style="color: var(--text-secondary);">
        ROCR Digital yönetim paneline hoş geldiniz.
      </p>
    </div>
    <button
      onclick={handleRefresh}
      disabled={$isLoading}
      class="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all disabled:opacity-50"
      style="background: var(--surface); color: var(--text);"
    >
      <RefreshCw size={16} class={$isLoading ? "animate-spin" : ""} />
      {$isLoading ? "Yükleniyor..." : "Yenile"}
    </button>
  </div>

  {#if $dataError}
    <Card>
      <div class="flex items-center gap-3 text-red-500">
        <AlertCircle size={20} />
        <span>Veri yüklenirken hata oluştu: {$dataError}</span>
      </div>
    </Card>
  {/if}

  {#if $isLoading && !initialized}
    <!-- Loading skeleton -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {#each Array(4) as _}
        <Card>
          <div class="animate-pulse">
            <div class="h-4 w-24 rounded bg-gray-700"></div>
            <div class="mt-3 h-8 w-16 rounded bg-gray-700"></div>
          </div>
        </Card>
      {/each}
    </div>
  {:else}
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {#each stats as stat}
        <Card>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm" style="color: var(--text-secondary);">
                {stat.label}
              </p>
              <p class="mt-1 text-3xl font-bold" style="color: var(--text);">
                {stat.value}
              </p>
              {#if stat.badge}
                <span
                  class="mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium"
                  style="background: {stat.color}20; color: {stat.color};"
                >
                  {stat.badge}
                </span>
              {/if}
            </div>
            <div
              class="flex h-12 w-12 items-center justify-center rounded-xl"
              style="background: {stat.color}15;"
            >
              <stat.icon size={24} color={stat.color} />
            </div>
          </div>
        </Card>
      {/each}
    </div>

    <!-- Recent Contacts -->
    <Card>
      <div class="mb-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold" style="color: var(--text);">
          Son Mesajlar
        </h3>
        <button
          onclick={() => push("/contacts")}
          class="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer"
          style="color: var(--color-primary);"
          onmouseenter={(e) =>
            (e.currentTarget.style.background = "var(--hover)")}
          onmouseleave={(e) =>
            (e.currentTarget.style.background = "transparent")}
        >
          Tümünü Gör <ArrowRight size={14} />
        </button>
      </div>
      <div class="space-y-3">
        {#each recentContacts as contact}
          <div
            class="flex items-center justify-between rounded-xl p-3 transition-colors"
            style="background: var(--hover);"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium" style="color: var(--text);"
                  >{contact.name}</span
                >
                <span
                  class="rounded-full px-2 py-0.5 text-[10px] font-medium {getStatusColor(
                    contact.status,
                  )}"
                >
                  {getStatusLabel(contact.status)}
                </span>
              </div>
              <p class="mt-0.5 text-xs" style="color: var(--text-secondary);">
                {contact.subject}
              </p>
            </div>
            <span class="text-xs" style="color: var(--text-secondary);"
              >{formatDate(contact.createdAt || contact.date)}</span
            >
          </div>
        {/each}
        {#if recentContacts.length === 0}
          <p
            class="py-4 text-center text-sm"
            style="color: var(--text-secondary);"
          >
            {$isLoading ? "Yükleniyor..." : "Henüz mesaj yok."}
          </p>
        {/if}
      </div>
    </Card>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card
        class="cursor-pointer hover:scale-[1.02] transition-transform"
        onclick={() => push("/partners")}
      >
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg"
            style="background: var(--color-accent-purple)15;"
          >
            <Handshake size={20} color="var(--color-accent-purple)" />
          </div>
          <div>
            <p class="text-sm font-medium" style="color: var(--text);">
              Yeni Partner
            </p>
            <p class="text-xs" style="color: var(--text-secondary);">
              Partner ekle veya düzenle
            </p>
          </div>
        </div>
      </Card>
      <Card
        class="cursor-pointer hover:scale-[1.02] transition-transform"
        onclick={() => push("/content")}
      >
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg"
            style="background: var(--color-accent-orange)15;"
          >
            <Briefcase size={20} color="var(--color-accent-orange)" />
          </div>
          <div>
            <p class="text-sm font-medium" style="color: var(--text);">
              İçerik Düzenle
            </p>
            <p class="text-xs" style="color: var(--text-secondary);">
              Web sitesi içeriğini güncelle
            </p>
          </div>
        </div>
      </Card>
      <Card
        class="cursor-pointer hover:scale-[1.02] transition-transform"
        onclick={() => push("/team")}
      >
        <div class="flex items-center gap-3">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-lg"
            style="background: #10b98115;"
          >
            <Users size={20} color="#10b981" />
          </div>
          <div>
            <p class="text-sm font-medium" style="color: var(--text);">
              Ekip Yönetimi
            </p>
            <p class="text-xs" style="color: var(--text-secondary);">
              Ekip üyelerini yönet
            </p>
          </div>
        </div>
      </Card>
    </div>
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

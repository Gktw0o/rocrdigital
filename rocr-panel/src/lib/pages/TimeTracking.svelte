<script>
  import { onMount, onDestroy } from "svelte";
  import { timeApi } from "../stores/api.js";
  import { auth } from "../stores/auth.js";
  import {
    Play,
    Square,
    Clock,
    Calendar,
    DollarSign,
    Loader2,
    Plus,
    TrendingUp,
  } from "lucide-svelte";

  let clockStatus = $state(null);
  let todaySummary = $state(null);
  let entries = $state([]);
  let isLoading = $state(true);
  let error = $state(null);
  let showManualEntry = $state(false);

  // Timer
  let elapsedTime = $state(0);
  let timerInterval = null;

  // Manual entry form
  let manualEntry = $state({
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "17:00",
    description: "",
    projectId: "",
    isBillable: true,
  });
  let isCreating = $state(false);

  // Report filters
  let reportRange = $state("week");

  onMount(async () => {
    await loadAll();
    startTimer();
  });

  onDestroy(() => {
    if (timerInterval) clearInterval(timerInterval);
  });

  async function loadAll() {
    try {
      isLoading = true;
      await Promise.all([loadStatus(), loadToday(), loadEntries()]);
    } finally {
      isLoading = false;
    }
  }

  async function loadStatus() {
    try {
      const response = await timeApi.getStatus();
      clockStatus = response.data;
    } catch (err) {
      console.error("Failed to load status:", err);
    }
  }

  async function loadToday() {
    try {
      const response = await timeApi.getToday();
      todaySummary = response.data;
    } catch (err) {
      console.error("Failed to load today:", err);
    }
  }

  async function loadEntries() {
    try {
      const response = await timeApi.listEntries({ limit: 20 });
      entries = response.data || [];
    } catch (err) {
      console.error("Failed to load entries:", err);
    }
  }

  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (clockStatus?.isClockedIn && clockStatus?.currentEntry) {
        const start = new Date(clockStatus.currentEntry.startTime);
        elapsedTime = Math.floor((Date.now() - start.getTime()) / 1000);
      }
    }, 1000);
  }

  async function clockIn() {
    try {
      error = null;
      await timeApi.clockIn();
      await loadStatus();
      await loadToday();
    } catch (err) {
      error = err.message;
    }
  }

  async function clockOut() {
    try {
      error = null;
      await timeApi.clockOut();
      await loadAll();
    } catch (err) {
      error = err.message;
    }
  }

  async function createManualEntry() {
    try {
      isCreating = true;
      error = null;

      const startTime = new Date(
        `${manualEntry.date}T${manualEntry.startTime}:00`,
      );
      const endTime = new Date(`${manualEntry.date}T${manualEntry.endTime}:00`);

      await timeApi.createEntry({
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        description: manualEntry.description || undefined,
        projectId: manualEntry.projectId || undefined,
        isBillable: manualEntry.isBillable,
      });

      showManualEntry = false;
      manualEntry = {
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "17:00",
        description: "",
        projectId: "",
        isBillable: true,
      };

      await loadAll();
    } catch (err) {
      error = err.message;
    } finally {
      isCreating = false;
    }
  }

  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  function formatHours(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  function formatTime(date) {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold" style="color: var(--text-primary);">
        Time Tracking
      </h1>
      <p class="text-sm mt-1" style="color: var(--text-secondary);">
        Track your work hours and earnings
      </p>
    </div>
    <button
      onclick={() => (showManualEntry = true)}
      class="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium"
      style="border-color: var(--border); color: var(--text-primary);"
    >
      <Plus size={18} />
      Manual Entry
    </button>
  </div>

  {#if error}
    <div
      class="rounded-xl p-4 border border-red-500/20 bg-red-500/10 text-red-400 text-sm"
    >
      {error}
    </div>
  {/if}

  {#if isLoading}
    <div class="flex items-center justify-center py-12">
      <Loader2
        size={32}
        class="animate-spin"
        style="color: var(--color-primary);"
      />
    </div>
  {:else}
    <!-- Clock In/Out Card -->
    <div
      class="rounded-2xl p-8 border text-center"
      style="background: var(--bg-secondary); border-color: var(--border);"
    >
      <!-- Timer Display -->
      <div class="mb-6">
        <p
          class="text-6xl font-mono font-bold tracking-wider"
          style="color: var(--text-primary);"
        >
          {#if clockStatus?.isClockedIn}
            {formatDuration(elapsedTime)}
          {:else}
            00:00:00
          {/if}
        </p>
        <p class="text-sm mt-2" style="color: var(--text-secondary);">
          {#if clockStatus?.isClockedIn}
            Started at {formatTime(clockStatus.currentEntry?.startTime)}
          {:else}
            Not clocked in
          {/if}
        </p>
      </div>

      <!-- Clock Button -->
      {#if clockStatus?.isClockedIn}
        <button
          onclick={clockOut}
          class="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold text-white transition-all hover:scale-105"
          style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);"
        >
          <Square size={24} fill="currentColor" />
          Clock Out
        </button>
      {:else}
        <button
          onclick={clockIn}
          class="inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-lg font-semibold text-white transition-all hover:scale-105"
          style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);"
        >
          <Play size={24} fill="currentColor" />
          Clock In
        </button>
      {/if}
    </div>

    <!-- Today's Summary -->
    {#if todaySummary}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          class="rounded-xl p-5 border"
          style="background: var(--bg-secondary); border-color: var(--border);"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 rounded-lg bg-blue-500/10">
              <Clock size={20} class="text-blue-400" />
            </div>
            <p
              class="text-sm font-medium"
              style="color: var(--text-secondary);"
            >
              Today's Hours
            </p>
          </div>
          <p class="text-2xl font-bold" style="color: var(--text-primary);">
            {formatHours(todaySummary.totalMinutes || 0)}
          </p>
        </div>

        <div
          class="rounded-xl p-5 border"
          style="background: var(--bg-secondary); border-color: var(--border);"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 rounded-lg bg-green-500/10">
              <DollarSign size={20} class="text-green-400" />
            </div>
            <p
              class="text-sm font-medium"
              style="color: var(--text-secondary);"
            >
              Today's Earnings
            </p>
          </div>
          <p class="text-2xl font-bold" style="color: var(--text-primary);">
            ${todaySummary.earnings?.toFixed(2) || "0.00"}
          </p>
        </div>

        <div
          class="rounded-xl p-5 border"
          style="background: var(--bg-secondary); border-color: var(--border);"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="p-2 rounded-lg bg-purple-500/10">
              <TrendingUp size={20} class="text-purple-400" />
            </div>
            <p
              class="text-sm font-medium"
              style="color: var(--text-secondary);"
            >
              Entries Today
            </p>
          </div>
          <p class="text-2xl font-bold" style="color: var(--text-primary);">
            {todaySummary.entryCount || 0}
          </p>
        </div>
      </div>
    {/if}

    <!-- Recent Entries -->
    <div
      class="rounded-xl border overflow-hidden"
      style="background: var(--bg-secondary); border-color: var(--border);"
    >
      <div class="p-4 border-b" style="border-color: var(--border);">
        <h3 class="font-semibold" style="color: var(--text-primary);">
          Recent Time Entries
        </h3>
      </div>

      {#if entries.length === 0}
        <div class="p-8 text-center">
          <Clock
            size={48}
            class="mx-auto mb-4 opacity-40"
            style="color: var(--text-secondary);"
          />
          <p class="text-sm" style="color: var(--text-secondary);">
            No time entries yet
          </p>
        </div>
      {:else}
        <div class="divide-y" style="border-color: var(--border);">
          {#each entries as entry}
            <div
              class="p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-500/10"
                >
                  <Clock size={18} class="text-blue-400" />
                </div>
                <div>
                  <p class="font-medium" style="color: var(--text-primary);">
                    {formatTime(entry.startTime)} — {entry.endTime
                      ? formatTime(entry.endTime)
                      : "In Progress"}
                  </p>
                  <p class="text-sm" style="color: var(--text-secondary);">
                    {formatDate(entry.startTime)}
                    {#if entry.description}
                      • {entry.description}{/if}
                  </p>
                </div>
              </div>
              <div class="text-right">
                <p class="font-medium" style="color: var(--text-primary);">
                  {#if entry.durationMinutes}
                    {formatHours(entry.durationMinutes)}
                  {:else}
                    —
                  {/if}
                </p>
                {#if entry.isBillable}
                  <span class="text-xs text-green-400">Billable</span>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<!-- Manual Entry Modal -->
{#if showManualEntry}
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    onclick={() => (showManualEntry = false)}
  >
    <div
      class="w-full max-w-md rounded-2xl p-6 border"
      style="background: var(--bg-secondary); border-color: var(--border);"
      onclick={(e) => e.stopPropagation()}
    >
      <h2 class="text-xl font-bold mb-6" style="color: var(--text-primary);">
        Manual Time Entry
      </h2>

      <form
        onsubmit={(e) => {
          e.preventDefault();
          createManualEntry();
        }}
        class="space-y-4"
      >
        <div>
          <label
            class="block text-sm font-medium mb-1"
            style="color: var(--text-secondary);">Date</label
          >
          <input
            type="date"
            bind:value={manualEntry.date}
            required
            class="w-full px-4 py-2 rounded-lg border text-sm"
            style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label
              class="block text-sm font-medium mb-1"
              style="color: var(--text-secondary);">Start Time</label
            >
            <input
              type="time"
              bind:value={manualEntry.startTime}
              required
              class="w-full px-4 py-2 rounded-lg border text-sm"
              style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-1"
              style="color: var(--text-secondary);">End Time</label
            >
            <input
              type="time"
              bind:value={manualEntry.endTime}
              required
              class="w-full px-4 py-2 rounded-lg border text-sm"
              style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
            />
          </div>
        </div>

        <div>
          <label
            class="block text-sm font-medium mb-1"
            style="color: var(--text-secondary);">Description</label
          >
          <input
            type="text"
            bind:value={manualEntry.description}
            class="w-full px-4 py-2 rounded-lg border text-sm"
            style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
            placeholder="What did you work on?"
          />
        </div>

        <div class="flex items-center gap-2">
          <input
            type="checkbox"
            id="billable"
            bind:checked={manualEntry.isBillable}
            class="rounded"
          />
          <label
            for="billable"
            class="text-sm"
            style="color: var(--text-secondary);">Billable hours</label
          >
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="button"
            onclick={() => (showManualEntry = false)}
            class="flex-1 py-2 rounded-lg border text-sm font-medium"
            style="border-color: var(--border); color: var(--text-secondary);"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            class="flex-1 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
            style="background: var(--color-primary);"
          >
            {isCreating ? "Saving..." : "Save Entry"}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

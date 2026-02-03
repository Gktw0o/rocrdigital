<script>
  import { onMount } from "svelte";
  import { scheduleApi } from "../stores/api.js";
  import { auth } from "../stores/auth.js";
  import {
    Clock,
    Calendar,
    Plus,
    Check,
    X,
    Loader2,
    Sun,
    Coffee,
  } from "lucide-svelte";

  let mySchedule = $state([]);
  let myOffDays = $state([]);
  let pendingOffDays = $state([]);
  let isLoading = $state(true);
  let error = $state(null);
  let showOffDayModal = $state(false);
  let showScheduleModal = $state(false);

  // Off day request form
  let offDayRequest = $state({
    date: "",
    type: "pto",
    reason: "",
  });
  let isRequesting = $state(false);

  // Schedule editing
  let editSchedule = $state([]);
  let isSavingSchedule = $state(false);

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const dayLabels = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

  const offDayTypes = [
    { value: "pto", label: "Paid Time Off" },
    { value: "sick", label: "Sick Leave" },
    { value: "holiday", label: "Holiday" },
    { value: "other", label: "Other" },
  ];

  let currentUser = $state(null);

  // Subscribe to auth store
  auth.subscribe((user) => {
    currentUser = user;
  });

  let isManager = $derived(
    currentUser?.role === "admin" || currentUser?.role === "manager",
  );

  onMount(async () => {
    await loadAll();
  });

  async function loadAll() {
    try {
      isLoading = true;
      await Promise.all([
        loadSchedule(),
        loadOffDays(),
        isManager && loadPendingOffDays(),
      ]);
    } finally {
      isLoading = false;
    }
  }

  async function loadSchedule() {
    try {
      const response = await scheduleApi.getMySchedule();
      mySchedule = response.data || [];
    } catch (err) {
      console.error("Failed to load schedule:", err);
    }
  }

  async function loadOffDays() {
    try {
      const response = await scheduleApi.getMyOffDays();
      myOffDays = response.data || [];
    } catch (err) {
      console.error("Failed to load off days:", err);
    }
  }

  async function loadPendingOffDays() {
    try {
      const response = await scheduleApi.getPendingOffDays();
      pendingOffDays = response.data || [];
    } catch (err) {
      console.error("Failed to load pending off days:", err);
    }
  }

  function openScheduleModal() {
    // Initialize edit schedule with current schedule or defaults
    editSchedule = daysOfWeek.map((day) => {
      const existing = mySchedule.find((s) => s.dayOfWeek === day);
      return {
        dayOfWeek: day,
        startTime: existing?.startTime || "09:00",
        endTime: existing?.endTime || "17:00",
        isActive:
          existing?.isActive ?? (day !== "saturday" && day !== "sunday"),
      };
    });
    showScheduleModal = true;
  }

  async function saveSchedule() {
    try {
      isSavingSchedule = true;
      const activeSchedules = editSchedule.filter((s) => s.isActive);
      await scheduleApi.setSchedule(activeSchedules);
      showScheduleModal = false;
      await loadSchedule();
    } catch (err) {
      error = err.message;
    } finally {
      isSavingSchedule = false;
    }
  }

  async function requestOffDay() {
    try {
      isRequesting = true;
      error = null;
      await scheduleApi.requestOffDay(offDayRequest);
      showOffDayModal = false;
      offDayRequest = { date: "", type: "pto", reason: "" };
      await loadOffDays();
    } catch (err) {
      error = err.message;
    } finally {
      isRequesting = false;
    }
  }

  async function approveOffDay(id, isApproved) {
    try {
      await scheduleApi.approveOffDay(id, isApproved);
      await loadPendingOffDays();
    } catch (err) {
      error = err.message;
    }
  }

  function getScheduleForDay(day) {
    return mySchedule.find((s) => s.dayOfWeek === day && s.isActive);
  }

  function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  function getOffDayTypeLabel(type) {
    return offDayTypes.find((t) => t.value === type)?.label || type;
  }

  function getOffDayTypeColor(type) {
    const colors = {
      pto: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      sick: "bg-red-500/10 text-red-400 border-red-500/20",
      holiday: "bg-green-500/10 text-green-400 border-green-500/20",
      other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    };
    return colors[type] || colors.other;
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold" style="color: var(--text-primary);">
        Schedule
      </h1>
      <p class="text-sm mt-1" style="color: var(--text-secondary);">
        Manage your work hours and time off
      </p>
    </div>
    <button
      onclick={() => (showOffDayModal = true)}
      class="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
      style="background: var(--color-primary);"
    >
      <Plus size={18} />
      Request Time Off
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
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Weekly Schedule -->
      <div
        class="rounded-xl border overflow-hidden"
        style="background: var(--bg-secondary); border-color: var(--border);"
      >
        <div
          class="p-4 border-b flex items-center justify-between"
          style="border-color: var(--border);"
        >
          <h3 class="font-semibold" style="color: var(--text-primary);">
            Weekly Schedule
          </h3>
          <button
            onclick={openScheduleModal}
            class="text-sm font-medium"
            style="color: var(--color-primary);"
          >
            Edit
          </button>
        </div>

        <div class="divide-y" style="border-color: var(--border);">
          {#each daysOfWeek as day}
            {@const schedule = getScheduleForDay(day)}
            <div class="p-4 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-10 h-10 rounded-lg flex items-center justify-center {schedule
                    ? 'bg-green-500/10'
                    : 'bg-gray-500/10'}"
                >
                  {#if schedule}
                    <Sun size={18} class="text-green-400" />
                  {:else}
                    <Coffee size={18} class="text-gray-400" />
                  {/if}
                </div>
                <span class="font-medium" style="color: var(--text-primary);"
                  >{dayLabels[day]}</span
                >
              </div>
              {#if schedule}
                <span class="text-sm" style="color: var(--text-secondary);">
                  {schedule.startTime} — {schedule.endTime}
                </span>
              {:else}
                <span class="text-sm" style="color: var(--text-secondary);"
                  >Off</span
                >
              {/if}
            </div>
          {/each}
        </div>
      </div>

      <!-- Time Off Requests -->
      <div
        class="rounded-xl border overflow-hidden"
        style="background: var(--bg-secondary); border-color: var(--border);"
      >
        <div class="p-4 border-b" style="border-color: var(--border);">
          <h3 class="font-semibold" style="color: var(--text-primary);">
            My Time Off
          </h3>
        </div>

        {#if myOffDays.length === 0}
          <div class="p-8 text-center">
            <Calendar
              size={48}
              class="mx-auto mb-4 opacity-40"
              style="color: var(--text-secondary);"
            />
            <p class="text-sm" style="color: var(--text-secondary);">
              No time off requests
            </p>
          </div>
        {:else}
          <div
            class="divide-y max-h-80 overflow-y-auto"
            style="border-color: var(--border);"
          >
            {#each myOffDays as offDay}
              <div class="p-4 flex items-center justify-between">
                <div>
                  <p class="font-medium" style="color: var(--text-primary);">
                    {formatDate(offDay.date)}
                  </p>
                  {#if offDay.reason}
                    <p class="text-sm" style="color: var(--text-secondary);">
                      {offDay.reason}
                    </p>
                  {/if}
                </div>
                <div class="flex items-center gap-2">
                  <span
                    class="px-2 py-1 rounded-md text-xs font-medium border {getOffDayTypeColor(
                      offDay.type,
                    )}"
                  >
                    {getOffDayTypeLabel(offDay.type)}
                  </span>
                  {#if offDay.isApproved}
                    <span
                      class="px-2 py-1 rounded-md text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20"
                    >
                      Approved
                    </span>
                  {:else}
                    <span
                      class="px-2 py-1 rounded-md text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    >
                      Pending
                    </span>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </div>
    </div>

    <!-- Pending Approvals (Manager Only) -->
    {#if isManager && pendingOffDays.length > 0}
      <div
        class="rounded-xl border overflow-hidden"
        style="background: var(--bg-secondary); border-color: var(--border);"
      >
        <div class="p-4 border-b" style="border-color: var(--border);">
          <h3 class="font-semibold" style="color: var(--text-primary);">
            Pending Approvals
          </h3>
        </div>

        <div class="divide-y" style="border-color: var(--border);">
          {#each pendingOffDays as request}
            <div class="p-4 flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                  style="background: var(--color-primary);"
                >
                  {request.user?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p class="font-medium" style="color: var(--text-primary);">
                    {request.user?.name}
                  </p>
                  <p class="text-sm" style="color: var(--text-secondary);">
                    {formatDate(request.date)} • {getOffDayTypeLabel(
                      request.type,
                    )}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  onclick={() => approveOffDay(request.id, true)}
                  class="p-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors"
                >
                  <Check size={18} />
                </button>
                <button
                  onclick={() => approveOffDay(request.id, false)}
                  class="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}
  {/if}
</div>

<!-- Request Off Day Modal -->
{#if showOffDayModal}
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    onclick={() => (showOffDayModal = false)}
  >
    <div
      class="w-full max-w-md rounded-2xl p-6 border"
      style="background: var(--bg-secondary); border-color: var(--border);"
      onclick={(e) => e.stopPropagation()}
    >
      <h2 class="text-xl font-bold mb-6" style="color: var(--text-primary);">
        Request Time Off
      </h2>

      <form
        onsubmit={(e) => {
          e.preventDefault();
          requestOffDay();
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
            bind:value={offDayRequest.date}
            required
            class="w-full px-4 py-2 rounded-lg border text-sm"
            style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium mb-1"
            style="color: var(--text-secondary);">Type</label
          >
          <select
            bind:value={offDayRequest.type}
            class="w-full px-4 py-2 rounded-lg border text-sm"
            style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
          >
            {#each offDayTypes as type}
              <option value={type.value}>{type.label}</option>
            {/each}
          </select>
        </div>

        <div>
          <label
            class="block text-sm font-medium mb-1"
            style="color: var(--text-secondary);">Reason (optional)</label
          >
          <textarea
            bind:value={offDayRequest.reason}
            rows="3"
            class="w-full px-4 py-2 rounded-lg border text-sm resize-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
            placeholder="Why are you requesting this time off?"
          ></textarea>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="button"
            onclick={() => (showOffDayModal = false)}
            class="flex-1 py-2 rounded-lg border text-sm font-medium"
            style="border-color: var(--border); color: var(--text-secondary);"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isRequesting || !offDayRequest.date}
            class="flex-1 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
            style="background: var(--color-primary);"
          >
            {isRequesting ? "Requesting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Edit Schedule Modal -->
{#if showScheduleModal}
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    onclick={() => (showScheduleModal = false)}
  >
    <div
      class="w-full max-w-md rounded-2xl p-6 border max-h-[90vh] overflow-y-auto"
      style="background: var(--bg-secondary); border-color: var(--border);"
      onclick={(e) => e.stopPropagation()}
    >
      <h2 class="text-xl font-bold mb-6" style="color: var(--text-primary);">
        Edit Weekly Schedule
      </h2>

      <form
        onsubmit={(e) => {
          e.preventDefault();
          saveSchedule();
        }}
        class="space-y-4"
      >
        {#each editSchedule as day, i}
          <div
            class="flex items-center gap-3 p-3 rounded-lg border"
            style="border-color: var(--border);"
          >
            <input
              type="checkbox"
              bind:checked={editSchedule[i].isActive}
              class="rounded"
            />
            <span class="w-24 font-medium" style="color: var(--text-primary);"
              >{dayLabels[day.dayOfWeek]}</span
            >
            {#if editSchedule[i].isActive}
              <input
                type="time"
                bind:value={editSchedule[i].startTime}
                class="flex-1 px-2 py-1 rounded border text-sm"
                style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
              />
              <span style="color: var(--text-secondary);">—</span>
              <input
                type="time"
                bind:value={editSchedule[i].endTime}
                class="flex-1 px-2 py-1 rounded border text-sm"
                style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
              />
            {:else}
              <span class="flex-1 text-sm" style="color: var(--text-secondary);"
                >Off</span
              >
            {/if}
          </div>
        {/each}

        <div class="flex gap-3 pt-4">
          <button
            type="button"
            onclick={() => (showScheduleModal = false)}
            class="flex-1 py-2 rounded-lg border text-sm font-medium"
            style="border-color: var(--border); color: var(--text-secondary);"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSavingSchedule}
            class="flex-1 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
            style="background: var(--color-primary);"
          >
            {isSavingSchedule ? "Saving..." : "Save Schedule"}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

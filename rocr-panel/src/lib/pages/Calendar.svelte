<script>
  import { onMount } from "svelte";
  import { calendarApi } from "../stores/api.js";
  import { auth } from "../stores/auth.js";
  import {
    Plus,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Users,
    Loader2,
  } from "lucide-svelte";

  let events = $state([]);
  let isLoading = $state(true);
  let error = $state(null);
  let currentDate = $state(new Date());
  let showCreateModal = $state(false);
  let selectedEvent = $state(null);

  // Calendar view
  let view = $state("month"); // month, week

  // New event form
  let newEvent = $state({
    title: "",
    description: "",
    eventType: "meeting",
    visibility: "private",
    startTime: "",
    endTime: "",
    isAllDay: false,
    location: "",
  });
  let isCreating = $state(false);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  onMount(async () => {
    await loadEvents();
  });

  async function loadEvents() {
    try {
      isLoading = true;
      error = null;
      const startOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const endOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );

      const response = await calendarApi.listEvents({
        startDate: startOfMonth.toISOString(),
        endDate: endOfMonth.toISOString(),
      });
      events = response.data || [];
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }

  async function createEvent() {
    try {
      isCreating = true;
      await calendarApi.createEvent({
        ...newEvent,
        startTime: new Date(newEvent.startTime).toISOString(),
        endTime: new Date(newEvent.endTime).toISOString(),
      });
      showCreateModal = false;
      resetNewEvent();
      await loadEvents();
    } catch (err) {
      error = err.message;
    } finally {
      isCreating = false;
    }
  }

  function resetNewEvent() {
    newEvent = {
      title: "",
      description: "",
      eventType: "meeting",
      visibility: "private",
      startTime: "",
      endTime: "",
      isAllDay: false,
      location: "",
    };
  }

  function previousMonth() {
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1,
    );
    loadEvents();
  }

  function nextMonth() {
    currentDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    );
    loadEvents();
  }

  function goToToday() {
    currentDate = new Date();
    loadEvents();
  }

  function getCalendarDays() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];

    // Previous month padding
    for (let i = 0; i < firstDay.getDay(); i++) {
      const d = new Date(year, month, -i);
      days.unshift({ date: d, isCurrentMonth: false });
    }

    // Current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    // Next month padding
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), isCurrentMonth: false });
    }

    return days;
  }

  function getEventsForDay(date) {
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate.toDateString() === date.toDateString();
    });
  }

  function isToday(date) {
    return date.toDateString() === new Date().toDateString();
  }

  function getEventColor(type) {
    const colors = {
      meeting: "bg-blue-500",
      deadline: "bg-red-500",
      reminder: "bg-amber-500",
      holiday: "bg-green-500",
      other: "bg-purple-500",
    };
    return colors[type] || colors.other;
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
        Calendar
      </h1>
      <p class="text-sm mt-1" style="color: var(--text-secondary);">
        Schedule meetings and track deadlines
      </p>
    </div>
    <button
      onclick={() => (showCreateModal = true)}
      class="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
      style="background: var(--color-primary);"
    >
      <Plus size={18} />
      New Event
    </button>
  </div>

  <!-- Calendar Navigation -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <button
        onclick={goToToday}
        class="px-4 py-2 rounded-lg border text-sm font-medium"
        style="border-color: var(--border); color: var(--text-primary);"
      >
        Today
      </button>
      <div class="flex items-center gap-2">
        <button
          onclick={previousMonth}
          class="p-2 rounded-lg hover:bg-white/5 transition-colors"
          style="color: var(--text-secondary);"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onclick={nextMonth}
          class="p-2 rounded-lg hover:bg-white/5 transition-colors"
          style="color: var(--text-secondary);"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      <h2 class="text-xl font-semibold" style="color: var(--text-primary);">
        {months[currentDate.getMonth()]}
        {currentDate.getFullYear()}
      </h2>
    </div>
  </div>

  <!-- Calendar Grid -->
  {#if isLoading}
    <div class="flex items-center justify-center py-12">
      <Loader2
        size={32}
        class="animate-spin"
        style="color: var(--color-primary);"
      />
    </div>
  {:else}
    <div
      class="rounded-xl border overflow-hidden"
      style="background: var(--bg-secondary); border-color: var(--border);"
    >
      <!-- Day Headers -->
      <div
        class="grid grid-cols-7 border-b"
        style="border-color: var(--border);"
      >
        {#each daysOfWeek as day}
          <div
            class="p-3 text-center text-sm font-medium"
            style="color: var(--text-secondary);"
          >
            {day}
          </div>
        {/each}
      </div>

      <!-- Calendar Days -->
      <div class="grid grid-cols-7">
        {#each getCalendarDays() as day, i}
          {@const dayEvents = getEventsForDay(day.date)}
          <div
            class="min-h-[120px] p-2 border-b border-r relative"
            style="border-color: var(--border); {!day.isCurrentMonth
              ? 'opacity: 0.4;'
              : ''}"
          >
            <span
              class="inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium mb-1"
              style={isToday(day.date)
                ? "background: var(--color-primary); color: white;"
                : `color: var(--text-primary);`}
            >
              {day.date.getDate()}
            </span>

            <!-- Events -->
            <div class="space-y-1">
              {#each dayEvents.slice(0, 3) as event}
                <button
                  onclick={() => (selectedEvent = event)}
                  class="w-full text-left px-2 py-1 rounded text-xs font-medium text-white truncate {getEventColor(
                    event.eventType,
                  )}"
                >
                  {event.title}
                </button>
              {/each}
              {#if dayEvents.length > 3}
                <p class="text-xs px-2" style="color: var(--text-secondary);">
                  +{dayEvents.length - 3} more
                </p>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<!-- Create Event Modal -->
{#if showCreateModal}
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    onclick={() => (showCreateModal = false)}
  >
    <div
      class="w-full max-w-md rounded-2xl p-6 border max-h-[90vh] overflow-y-auto"
      style="background: var(--bg-secondary); border-color: var(--border);"
      onclick={(e) => e.stopPropagation()}
    >
      <h2 class="text-xl font-bold mb-6" style="color: var(--text-primary);">
        New Event
      </h2>

      <form
        onsubmit={(e) => {
          e.preventDefault();
          createEvent();
        }}
        class="space-y-4"
      >
        <div>
          <label
            class="block text-sm font-medium mb-1"
            style="color: var(--text-secondary);">Title *</label
          >
          <input
            type="text"
            bind:value={newEvent.title}
            required
            class="w-full px-4 py-2 rounded-lg border text-sm"
            style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
            placeholder="e.g., Team Meeting"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label
              class="block text-sm font-medium mb-1"
              style="color: var(--text-secondary);">Type</label
            >
            <select
              bind:value={newEvent.eventType}
              class="w-full px-4 py-2 rounded-lg border text-sm"
              style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
            >
              <option value="meeting">Meeting</option>
              <option value="deadline">Deadline</option>
              <option value="reminder">Reminder</option>
              <option value="holiday">Holiday</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-1"
              style="color: var(--text-secondary);">Visibility</label
            >
            <select
              bind:value={newEvent.visibility}
              class="w-full px-4 py-2 rounded-lg border text-sm"
              style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
            >
              <option value="private">Private</option>
              <option value="team">Team</option>
              <option value="all">Everyone</option>
            </select>
          </div>
        </div>

        <div>
          <label
            class="block text-sm font-medium mb-1"
            style="color: var(--text-secondary);">Start Time *</label
          >
          <input
            type="datetime-local"
            bind:value={newEvent.startTime}
            required
            class="w-full px-4 py-2 rounded-lg border text-sm"
            style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium mb-1"
            style="color: var(--text-secondary);">End Time *</label
          >
          <input
            type="datetime-local"
            bind:value={newEvent.endTime}
            required
            class="w-full px-4 py-2 rounded-lg border text-sm"
            style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium mb-1"
            style="color: var(--text-secondary);">Location</label
          >
          <input
            type="text"
            bind:value={newEvent.location}
            class="w-full px-4 py-2 rounded-lg border text-sm"
            style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
            placeholder="e.g., Meeting Room 1"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium mb-1"
            style="color: var(--text-secondary);">Description</label
          >
          <textarea
            bind:value={newEvent.description}
            rows="3"
            class="w-full px-4 py-2 rounded-lg border text-sm resize-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
            placeholder="Event details..."
          ></textarea>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="button"
            onclick={() => (showCreateModal = false)}
            class="flex-1 py-2 rounded-lg border text-sm font-medium"
            style="border-color: var(--border); color: var(--text-secondary);"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating ||
              !newEvent.title ||
              !newEvent.startTime ||
              !newEvent.endTime}
            class="flex-1 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
            style="background: var(--color-primary);"
          >
            {isCreating ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Event Detail Modal -->
{#if selectedEvent}
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    onclick={() => (selectedEvent = null)}
  >
    <div
      class="w-full max-w-md rounded-2xl p-6 border"
      style="background: var(--bg-secondary); border-color: var(--border);"
      onclick={(e) => e.stopPropagation()}
    >
      <div class="flex items-start justify-between mb-4">
        <div>
          <span
            class="inline-block px-2 py-1 rounded text-xs font-medium text-white mb-2 {getEventColor(
              selectedEvent.eventType,
            )}"
          >
            {selectedEvent.eventType}
          </span>
          <h2 class="text-xl font-bold" style="color: var(--text-primary);">
            {selectedEvent.title}
          </h2>
        </div>
      </div>

      <div class="space-y-3">
        <div
          class="flex items-center gap-3"
          style="color: var(--text-secondary);"
        >
          <Clock size={16} />
          <span class="text-sm">
            {formatTime(selectedEvent.startTime)} - {formatTime(
              selectedEvent.endTime,
            )}
          </span>
        </div>

        <div
          class="flex items-center gap-3"
          style="color: var(--text-secondary);"
        >
          <CalendarIcon size={16} />
          <span class="text-sm">
            {new Date(selectedEvent.startTime).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {#if selectedEvent.location}
          <div
            class="flex items-center gap-3"
            style="color: var(--text-secondary);"
          >
            <MapPin size={16} />
            <span class="text-sm">{selectedEvent.location}</span>
          </div>
        {/if}

        {#if selectedEvent.description}
          <p
            class="text-sm pt-3 border-t"
            style="color: var(--text-secondary); border-color: var(--border);"
          >
            {selectedEvent.description}
          </p>
        {/if}
      </div>

      <button
        onclick={() => (selectedEvent = null)}
        class="w-full mt-6 py-2 rounded-lg border text-sm font-medium"
        style="border-color: var(--border); color: var(--text-secondary);"
      >
        Close
      </button>
    </div>
  </div>
{/if}

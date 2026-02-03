<script>
  import { onMount } from "svelte";
  import Card from "../components/Card.svelte";
  import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Plus,
  } from "lucide-svelte";
  import { calendarApi } from "../stores/api.js";

  let currentDate = $state(new Date());
  let events = $state([]);
  let loading = $state(true);

  onMount(async () => {
    await loadEvents();
  });

  async function loadEvents() {
    loading = true;
    try {
      events = await calendarApi.getAll();
    } catch (e) {
      console.error(e);
    }
    loading = false;
  }

  const currentMonth = $derived(currentDate.getMonth());
  const currentYear = $derived(currentDate.getFullYear());

  const monthName = $derived(
    currentDate.toLocaleDateString("tr-TR", { month: "long", year: "numeric" }),
  );

  const daysInMonth = $derived(
    new Date(currentYear, currentMonth + 1, 0).getDate(),
  );

  const firstDayOfMonth = $derived(
    new Date(currentYear, currentMonth, 1).getDay(),
  );

  const days = $derived(() => {
    const result = [];
    const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = 0; i < startDay; i++) {
      result.push({ day: null, events: [] });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const dayEvents = events.filter((e) => e.date?.startsWith(dateStr));
      result.push({ day: i, events: dayEvents });
    }

    return result;
  });

  function prevMonth() {
    currentDate = new Date(currentYear, currentMonth - 1, 1);
  }

  function nextMonth() {
    currentDate = new Date(currentYear, currentMonth + 1, 1);
  }

  function today() {
    currentDate = new Date();
  }
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Takvim</h1>
      <p class="page-subtitle">Etkinlik ve randevu takvimi</p>
    </div>
  </header>

  <Card>
    <div class="calendar-header">
      <div class="calendar-nav">
        <button class="nav-btn" onclick={prevMonth}>
          <ChevronLeft size={20} />
        </button>
        <h2 class="month-title">{monthName}</h2>
        <button class="nav-btn" onclick={nextMonth}>
          <ChevronRight size={20} />
        </button>
      </div>
      <button class="today-btn" onclick={today}>Bugün</button>
    </div>

    <div class="calendar-grid">
      <div class="weekdays">
        {#each ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"] as day}
          <div class="weekday">{day}</div>
        {/each}
      </div>

      <div class="days">
        {#each days() as { day, events: dayEvents }}
          <div
            class="day"
            class:empty={!day}
            class:today={day === new Date().getDate() &&
              currentMonth === new Date().getMonth() &&
              currentYear === new Date().getFullYear()}
          >
            {#if day}
              <span class="day-number">{day}</span>
              {#if dayEvents.length > 0}
                <div class="day-events">
                  {#each dayEvents.slice(0, 2) as event}
                    <div
                      class="event"
                      style="background: {event.color || '#3b82f6'}"
                    >
                      {event.title}
                    </div>
                  {/each}
                  {#if dayEvents.length > 2}
                    <div class="more">+{dayEvents.length - 2} daha</div>
                  {/if}
                </div>
              {/if}
            {/if}
          </div>
        {/each}
      </div>
    </div>
  </Card>
</div>

<style>
  .page {
    padding: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .page-title {
    font-size: 28px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 4px;
  }

  .page-subtitle {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .calendar-nav {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text);
    cursor: pointer;
    transition: all 0.15s;
  }

  .nav-btn:hover {
    background: var(--bg-tertiary);
  }

  .month-title {
    font-size: 20px;
    font-weight: 600;
    color: var(--text);
    min-width: 180px;
    text-align: center;
    text-transform: capitalize;
  }

  .today-btn {
    padding: 10px 20px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s;
  }

  .today-btn:hover {
    background: var(--bg-tertiary);
  }

  .calendar-grid {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border);
  }

  .weekday {
    padding: 12px;
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
  }

  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
  }

  .day {
    min-height: 100px;
    padding: 8px;
    border-right: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    background: var(--bg-secondary);
  }

  .day:nth-child(7n) {
    border-right: none;
  }

  .day.empty {
    background: var(--bg);
  }

  .day.today {
    background: rgba(59, 130, 246, 0.05);
  }

  .day.today .day-number {
    background: var(--primary);
    color: white;
  }

  .day-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    border-radius: 50%;
  }

  .day-events {
    margin-top: 4px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .event {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 4px;
    color: white;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .more {
    font-size: 11px;
    color: var(--text-muted);
    padding: 2px 0;
  }
</style>

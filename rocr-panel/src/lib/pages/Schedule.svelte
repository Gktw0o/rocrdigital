<script>
  import { onMount } from "svelte";
  import Card from "../components/Card.svelte";
  import Modal from "../components/Modal.svelte";
  import { CalendarDays, Plus, Clock, Edit, Trash2 } from "lucide-svelte";
  import { scheduleApi } from "../stores/api.js";

  let schedules = $state([]);
  let loading = $state(true);
  let showModal = $state(false);
  let editingSchedule = $state(null);
  let formData = $state({
    title: "",
    dayOfWeek: 0,
    startTime: "",
    endTime: "",
    description: "",
  });

  const daysOfWeek = [
    "Pazar",
    "Pazartesi",
    "Salı",
    "Çarşamba",
    "Perşembe",
    "Cuma",
    "Cumartesi",
  ];

  onMount(async () => {
    await loadSchedules();
  });

  async function loadSchedules() {
    loading = true;
    try {
      schedules = await scheduleApi.getAll();
    } catch (e) {
      console.error(e);
    }
    loading = false;
  }

  const schedulesByDay = $derived(() => {
    const result = {};
    for (let i = 1; i <= 6; i++) {
      result[i] = schedules.filter((s) => s.dayOfWeek === i);
    }
    result[0] = schedules.filter((s) => s.dayOfWeek === 0);
    return result;
  });

  function openModal(schedule = null) {
    editingSchedule = schedule;
    formData = schedule
      ? { ...schedule }
      : {
          title: "",
          dayOfWeek: 1,
          startTime: "09:00",
          endTime: "10:00",
          description: "",
        };
    showModal = true;
  }

  async function handleSubmit() {
    if (editingSchedule) {
      await scheduleApi.update(editingSchedule.id, formData);
    } else {
      await scheduleApi.create(formData);
    }
    await loadSchedules();
    showModal = false;
  }

  async function handleDelete(id) {
    if (confirm("Bu programı silmek istediğinize emin misiniz?")) {
      await scheduleApi.delete(id);
      await loadSchedules();
    }
  }
</script>

<div class="page">
  <header class="page-header">
    <div>
      <h1 class="page-title">Program</h1>
      <p class="page-subtitle">Haftalık çalışma programı</p>
    </div>
    <button class="primary-btn" onclick={() => openModal()}>
      <Plus size={18} />
      <span>Yeni Program</span>
    </button>
  </header>

  <Card>
    {#if loading}
      <div class="loading">Yükleniyor...</div>
    {:else}
      <div class="schedule-grid">
        {#each [1, 2, 3, 4, 5, 6, 0] as dayIndex}
          <div class="day-column">
            <div class="day-header">{daysOfWeek[dayIndex]}</div>
            <div class="day-schedules">
              {#each schedulesByDay()[dayIndex] || [] as schedule}
                <div class="schedule-item">
                  <div class="schedule-time">
                    <Clock size={12} />
                    <span>{schedule.startTime} - {schedule.endTime}</span>
                  </div>
                  <div class="schedule-title">{schedule.title}</div>
                  {#if schedule.description}
                    <div class="schedule-desc">{schedule.description}</div>
                  {/if}
                  <div class="schedule-actions">
                    <button onclick={() => openModal(schedule)}>
                      <Edit size={14} />
                    </button>
                    <button onclick={() => handleDelete(schedule.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              {:else}
                <div class="no-schedule">Boş</div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </Card>
</div>

<Modal
  bind:open={showModal}
  title={editingSchedule ? "Program Düzenle" : "Yeni Program"}
>
  <form
    class="form"
    onsubmit={(e) => {
      e.preventDefault();
      handleSubmit();
    }}
  >
    <div class="form-group">
      <label>Başlık</label>
      <input type="text" bind:value={formData.title} required />
    </div>
    <div class="form-group">
      <label>Gün</label>
      <select bind:value={formData.dayOfWeek}>
        {#each daysOfWeek as day, i}
          <option value={i}>{day}</option>
        {/each}
      </select>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Başlangıç</label>
        <input type="time" bind:value={formData.startTime} required />
      </div>
      <div class="form-group">
        <label>Bitiş</label>
        <input type="time" bind:value={formData.endTime} required />
      </div>
    </div>
    <div class="form-group">
      <label>Açıklama</label>
      <textarea bind:value={formData.description} rows="2"></textarea>
    </div>
    <div class="form-actions">
      <button
        type="button"
        class="btn-secondary"
        onclick={() => (showModal = false)}>İptal</button
      >
      <button type="submit" class="btn-primary">Kaydet</button>
    </div>
  </form>
</Modal>

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

  .primary-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: var(--primary);
    border: none;
    border-radius: var(--radius-sm);
    color: white;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  .loading {
    text-align: center;
    padding: 64px;
    color: var(--text-muted);
  }

  .schedule-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: var(--border);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
  }

  .day-column {
    background: var(--bg-secondary);
    min-height: 400px;
  }

  .day-header {
    padding: 12px;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    color: var(--text);
    background: var(--bg-tertiary);
    border-bottom: 1px solid var(--border);
  }

  .day-schedules {
    padding: 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .schedule-item {
    padding: 10px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    font-size: 12px;
  }

  .schedule-time {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--text-muted);
    margin-bottom: 4px;
  }

  .schedule-title {
    font-weight: 500;
    color: var(--text);
  }

  .schedule-desc {
    color: var(--text-secondary);
    margin-top: 4px;
  }

  .schedule-actions {
    display: flex;
    gap: 4px;
    margin-top: 8px;
  }

  .schedule-actions button {
    padding: 4px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
  }

  .schedule-actions button:hover {
    color: var(--text);
  }

  .no-schedule {
    text-align: center;
    padding: 20px;
    color: var(--text-muted);
    font-size: 12px;
  }

  /* Form */
  .form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    padding: 12px 14px;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--bg);
    color: var(--text);
    font-size: 14px;
    outline: none;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding-top: 8px;
  }

  .btn-secondary,
  .btn-primary {
    padding: 12px 24px;
    border: none;
    border-radius: var(--radius-sm);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
  }

  .btn-secondary {
    background: var(--bg-tertiary);
    color: var(--text);
  }
  .btn-primary {
    background: var(--primary);
    color: white;
  }
</style>

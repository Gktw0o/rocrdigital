<script>
  import { onMount } from "svelte";
  import { projectsApi, tasksApi } from "../stores/api.js";
  import { auth } from "../stores/auth.js";
  import {
    Plus,
    FolderKanban,
    Calendar,
    Users,
    MoreVertical,
    ChevronRight,
    Loader2,
  } from "lucide-svelte";

  let projects = $state([]);
  let stats = $state(null);
  let isLoading = $state(true);
  let error = $state(null);
  let selectedProject = $state(null);
  let showCreateModal = $state(false);
  let filter = $state("all");
  let currentUser = $state(null);

  // Subscribe to auth store
  auth.subscribe((user) => {
    currentUser = user;
  });

  // New project form
  let newProject = $state({
    name: "",
    description: "",
    clientName: "",
    budget: "",
    dueDate: "",
  });
  let isCreating = $state(false);

  onMount(async () => {
    await loadProjects();
    await loadStats();
  });

  async function loadProjects() {
    try {
      isLoading = true;
      error = null;
      const params = {};
      if (filter !== "all") params.status = filter;
      const response = await projectsApi.list(params);
      projects = response.data || [];
    } catch (err) {
      error = err.message;
    } finally {
      isLoading = false;
    }
  }

  async function loadStats() {
    try {
      const response = await projectsApi.getStats();
      stats = response.data;
    } catch (err) {
      console.error("Failed to load stats:", err);
    }
  }

  async function createProject() {
    try {
      isCreating = true;
      await projectsApi.create({
        ...newProject,
        budget: newProject.budget ? parseFloat(newProject.budget) : undefined,
        dueDate: newProject.dueDate
          ? new Date(newProject.dueDate).toISOString()
          : undefined,
      });
      showCreateModal = false;
      newProject = {
        name: "",
        description: "",
        clientName: "",
        budget: "",
        dueDate: "",
      };
      await loadProjects();
      await loadStats();
    } catch (err) {
      error = err.message;
    } finally {
      isCreating = false;
    }
  }

  async function updateStatus(project, status) {
    try {
      await projectsApi.update(project.id, { status });
      await loadProjects();
      await loadStats();
    } catch (err) {
      error = err.message;
    }
  }

  function getStatusColor(status) {
    const colors = {
      planning: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      in_progress: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      on_hold: "bg-gray-500/10 text-gray-400 border-gray-500/20",
      review: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      completed: "bg-green-500/10 text-green-500 border-green-500/20",
      archived: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    };
    return colors[status] || colors.planning;
  }

  function formatDate(date) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  $effect(() => {
    if (filter) loadProjects();
  });

  let canManage = $derived(
    currentUser?.role === "admin" || currentUser?.role === "manager",
  );
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold" style="color: var(--text-primary);">
        Projects
      </h1>
      <p class="text-sm mt-1" style="color: var(--text-secondary);">
        Manage and track all your projects
      </p>
    </div>
    {#if canManage}
      <button
        onclick={() => (showCreateModal = true)}
        class="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium transition-colors"
        style="background: var(--color-primary);"
      >
        <Plus size={18} />
        New Project
      </button>
    {/if}
  </div>

  <!-- Stats -->
  {#if stats}
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {#each [{ label: "Total", value: stats.total, color: "text-white" }, { label: "Planning", value: stats.planning, color: "text-blue-400" }, { label: "In Progress", value: stats.inProgress, color: "text-amber-400" }, { label: "Review", value: stats.review, color: "text-purple-400" }, { label: "Completed", value: stats.completed, color: "text-green-400" }, { label: "On Hold", value: stats.onHold, color: "text-gray-400" }] as stat}
        <div
          class="rounded-xl p-4 border"
          style="background: var(--bg-secondary); border-color: var(--border);"
        >
          <p class="text-xs font-medium" style="color: var(--text-secondary);">
            {stat.label}
          </p>
          <p class="text-2xl font-bold mt-1 {stat.color}">{stat.value}</p>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Filter -->
  <div class="flex gap-2 overflow-x-auto pb-2">
    {#each [{ value: "all", label: "All" }, { value: "planning", label: "Planning" }, { value: "in_progress", label: "In Progress" }, { value: "review", label: "Review" }, { value: "completed", label: "Completed" }, { value: "on_hold", label: "On Hold" }] as f}
      <button
        onclick={() => (filter = f.value)}
        class="px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors"
        style={filter === f.value
          ? "background: var(--color-primary); color: white;"
          : "background: var(--bg-secondary); color: var(--text-secondary); border: 1px solid var(--border);"}
      >
        {f.label}
      </button>
    {/each}
  </div>

  <!-- Projects Grid -->
  {#if isLoading}
    <div class="flex items-center justify-center py-12">
      <Loader2
        size={32}
        class="animate-spin"
        style="color: var(--color-primary);"
      />
    </div>
  {:else if error}
    <div
      class="rounded-xl p-6 border border-red-500/20 bg-red-500/10 text-red-400"
    >
      {error}
    </div>
  {:else if projects.length === 0}
    <div
      class="rounded-xl p-12 text-center border"
      style="background: var(--bg-secondary); border-color: var(--border);"
    >
      <FolderKanban
        size={48}
        class="mx-auto mb-4 opacity-40"
        style="color: var(--text-secondary);"
      />
      <p class="text-lg font-medium" style="color: var(--text-primary);">
        No projects yet
      </p>
      <p class="text-sm mt-1" style="color: var(--text-secondary);">
        Create your first project to get started
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each projects as project}
        <div
          class="rounded-xl p-5 border transition-all hover:border-opacity-50 cursor-pointer group"
          style="background: var(--bg-secondary); border-color: var(--border);"
          onclick={() => (selectedProject = project)}
        >
          <!-- Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1 min-w-0">
              <h3
                class="font-semibold truncate"
                style="color: var(--text-primary);"
              >
                {project.name}
              </h3>
              {#if project.clientName}
                <p
                  class="text-sm truncate"
                  style="color: var(--text-secondary);"
                >
                  {project.clientName}
                </p>
              {/if}
            </div>
            <span
              class="px-2 py-1 rounded-md text-xs font-medium border capitalize {getStatusColor(
                project.status,
              )}"
            >
              {project.status.replace("_", " ")}
            </span>
          </div>

          <!-- Description -->
          {#if project.description}
            <p
              class="text-sm line-clamp-2 mb-4"
              style="color: var(--text-secondary);"
            >
              {project.description}
            </p>
          {/if}

          <!-- Footer -->
          <div
            class="flex items-center justify-between pt-3 border-t"
            style="border-color: var(--border);"
          >
            <div
              class="flex items-center gap-3 text-xs"
              style="color: var(--text-secondary);"
            >
              {#if project.dueDate}
                <span class="flex items-center gap-1">
                  <Calendar size={14} />
                  {formatDate(project.dueDate)}
                </span>
              {/if}
              {#if project.budget}
                <span>${parseFloat(project.budget).toLocaleString()}</span>
              {/if}
            </div>
            <ChevronRight
              size={18}
              class="opacity-0 group-hover:opacity-100 transition-opacity"
              style="color: var(--text-secondary);"
            />
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<!-- Create Modal -->
{#if showCreateModal}
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    onclick={() => (showCreateModal = false)}
  >
    <div
      class="w-full max-w-md rounded-2xl p-6 border"
      style="background: var(--bg-secondary); border-color: var(--border);"
      onclick={(e) => e.stopPropagation()}
    >
      <h2 class="text-xl font-bold mb-6" style="color: var(--text-primary);">
        New Project
      </h2>

      <form
        onsubmit={(e) => {
          e.preventDefault();
          createProject();
        }}
        class="space-y-4"
      >
        <div>
          <label
            class="block text-sm font-medium mb-1"
            style="color: var(--text-secondary);">Project Name *</label
          >
          <input
            type="text"
            bind:value={newProject.name}
            required
            class="w-full px-4 py-2 rounded-lg border text-sm"
            style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
            placeholder="e.g., Website Redesign"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium mb-1"
            style="color: var(--text-secondary);">Client Name</label
          >
          <input
            type="text"
            bind:value={newProject.clientName}
            class="w-full px-4 py-2 rounded-lg border text-sm"
            style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
            placeholder="e.g., Acme Corp"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium mb-1"
            style="color: var(--text-secondary);">Description</label
          >
          <textarea
            bind:value={newProject.description}
            rows="3"
            class="w-full px-4 py-2 rounded-lg border text-sm resize-none"
            style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
            placeholder="Project details..."
          ></textarea>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label
              class="block text-sm font-medium mb-1"
              style="color: var(--text-secondary);">Budget</label
            >
            <input
              type="number"
              bind:value={newProject.budget}
              class="w-full px-4 py-2 rounded-lg border text-sm"
              style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
              placeholder="10000"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-1"
              style="color: var(--text-secondary);">Due Date</label
            >
            <input
              type="date"
              bind:value={newProject.dueDate}
              class="w-full px-4 py-2 rounded-lg border text-sm"
              style="background: var(--bg); border-color: var(--border); color: var(--text-primary);"
            />
          </div>
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
            disabled={isCreating || !newProject.name}
            class="flex-1 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-50"
            style="background: var(--color-primary);"
          >
            {isCreating ? "Creating..." : "Create Project"}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>

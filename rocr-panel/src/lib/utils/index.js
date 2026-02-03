export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getStatusColor(status) {
  const colors = {
    unread: "bg-blue-500/20 text-blue-400",
    read: "bg-gray-500/20 text-gray-400",
    in_progress: "bg-purple-500/20 text-purple-400",
    replied: "bg-green-500/20 text-green-400",
    archived: "bg-yellow-500/20 text-yellow-400",
    // Project statuses
    planning: "bg-blue-500/20 text-blue-400",
    active: "bg-green-500/20 text-green-400",
    on_hold: "bg-yellow-500/20 text-yellow-400",
    completed: "bg-gray-500/20 text-gray-400",
    cancelled: "bg-red-500/20 text-red-400",
    // Task statuses
    todo: "bg-gray-500/20 text-gray-400",
    in_progress: "bg-blue-500/20 text-blue-400",
    review: "bg-purple-500/20 text-purple-400",
    done: "bg-green-500/20 text-green-400",
  };
  return colors[status] || colors.read;
}

export function getStatusLabel(status) {
  const labels = {
    unread: "Okunmadı",
    read: "Okundu",
    in_progress: "İşleniyor",
    replied: "Yanıt Verildi",
    archived: "Arşivlendi",
    // Project statuses
    planning: "Planlama",
    active: "Aktif",
    on_hold: "Beklemede",
    completed: "Tamamlandı",
    cancelled: "İptal",
    // Task statuses
    todo: "Yapılacak",
    review: "İnceleme",
    done: "Bitti",
    // Event statuses
    pending: "Bekliyor",
    accepted: "Kabul Edildi",
    declined: "Reddedildi",
    maybe: "Belki",
  };
  return labels[status] || status;
}

export function getPriorityColor(priority) {
  const colors = {
    low: "bg-gray-500/20 text-gray-400",
    medium: "bg-yellow-500/20 text-yellow-400",
    high: "bg-orange-500/20 text-orange-400",
    urgent: "bg-red-500/20 text-red-400",
  };
  return colors[priority] || colors.medium;
}

export function getPriorityLabel(priority) {
  const labels = {
    low: "Düşük",
    medium: "Orta",
    high: "Yüksek",
    urgent: "Acil",
  };
  return labels[priority] || priority;
}

export function truncate(str, length = 50) {
  if (!str) return "";
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function formatCurrency(amount, currency = "TRY") {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency,
  }).format(amount);
}

export function formatDuration(minutes) {
  if (!minutes) return "-";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}dk`;
  if (mins === 0) return `${hours}sa`;
  return `${hours}sa ${mins}dk`;
}

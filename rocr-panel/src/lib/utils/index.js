export function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getStatusColor(status) {
  const colors = {
    unread: "bg-blue-500/20 text-blue-400",
    read: "bg-gray-500/20 text-gray-400",
    replied: "bg-green-500/20 text-green-400",
    archived: "bg-yellow-500/20 text-yellow-400",
  };
  return colors[status] || colors.read;
}

export function getStatusLabel(status) {
  const labels = {
    unread: "Okunmadi",
    read: "Okundu",
    replied: "Yanit Verildi",
    archived: "Arsivlendi",
  };
  return labels[status] || status;
}

export function truncate(str, length = 50) {
  if (!str) return "";
  return str.length > length ? str.slice(0, length) + "..." : str;
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

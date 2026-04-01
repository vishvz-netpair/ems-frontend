export function formatDate(isoOrDate?: string | null) {
  if (!isoOrDate) return "-";

  try {
    const d = new Date(isoOrDate);
    return d.toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch {
    return isoOrDate;
  }
}

export function formatDateTime(value?: string | null) {
  if (!value) return "-";

  try {
    return new Date(value).toLocaleString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return value;
  }
}

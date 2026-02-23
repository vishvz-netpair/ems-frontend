export function formatDate(isoOrDate: string) {
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
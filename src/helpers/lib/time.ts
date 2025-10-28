

export function getTimeRangeResult(date: Date = new Date()): number {
  const hour = date.getHours();
  if (hour >= 0 && hour < 11) return 0;
  else if (hour >= 11 && hour < 13) return 1;
  else return 2;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const formatSqlDatetime = (sqlDatetime: string): { date: string, time: string } => {
  // Split date & time
  const [datePart, timePart] = sqlDatetime.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);

  // Nama bulan Indonesia
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return {
    date: `${day} ${monthNames[month - 1]} ${year}`,
    time: timePart
  }
}
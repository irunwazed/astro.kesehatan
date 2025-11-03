

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

export function getTimeNow(): string {
  const now = new Date();

  // Gunakan waktu UTC agar selalu konsisten dengan +00 offset
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");

  // Dapatkan milidetik dan ubah menjadi 6 digit mikrodetik (SSSSSS)
  const microseconds = String(now.getUTCMilliseconds() * 1000).padStart(6, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${microseconds}+00`;
}
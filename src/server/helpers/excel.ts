import ExcelJS from 'exceljs';

function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_') // ganti semua bukan alnum jadi _
    .replace(/^_+|_+$/g, '');    // hapus underscore di awal/akhir
}

export async function excelToArray(filePath: string): Promise<Record<string, any>[]> {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  console.log("workbook.worksheets", workbook.worksheets.length)

  const worksheet = workbook.worksheets[0];
  if (!worksheet) return [];

  const headerRow = worksheet.getRow(1);
  const rawHeaders = headerRow.values as (string | null)[];

  const headers = rawHeaders.map((h) => (typeof h === 'string' ? normalizeHeader(h) : ''));

  console.log("headers", headers)

  const rows: Record<string, any>[] = [];

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header
    const rowData: Record<string, any> = {};
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber];
      if (typeof header === 'string') {
        rowData[header] = cell.value;
      }
    });
    rows.push(rowData);
  });

  return rows;
}

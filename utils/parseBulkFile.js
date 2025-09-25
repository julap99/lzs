export function parseBulkFile(rawContent) {
  if (typeof rawContent !== \"string\") {
    return [];
  }

  const trimmed = rawContent.trim();
  if (!trimmed) {
    return [];
  }

  const rows = trimmed.split(/\r?\n/).filter((line) => line.trim().length);
  if (rows.length < 2) {
    return [];
  }

  const headers = rows.shift().split(\",\").map((header) => header.trim());

  return rows.map((row) => {
    const values = row.split(\",\").map((value) => value.trim());
    return headers.reduce((accumulator, header, index) => {
      accumulator[header] = values[index] ?? \"\";
      return accumulator;
    }, {});
  });
}

export default parseBulkFile;

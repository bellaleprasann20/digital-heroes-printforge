
import Papa from 'papaparse';

const MAX_CSV_SIZE = 10 * 1024 * 1024;
const MAX_ROWS = 10000;
const MAX_COLUMNS = 100;

export const parseCsv = (buffer) => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw new Error('A valid CSV file buffer is required.');
  }

  if (buffer.length > MAX_CSV_SIZE) {
    throw new Error('CSV file exceeds the 10 MB limit.');
  }

  // Reject UTF-16 and binary-looking input. UTF-8 BOM is supported.
  const text = buffer.toString('utf8').replace(/^\uFEFF/, '');

  if (text.includes('\u0000')) {
    throw new Error('CSV must be a UTF-8 text file.');
  }

  const result = Papa.parse(text, {
    header: true,
    skipEmptyLines: 'greedy',
    transformHeader: (header) => header.trim(),
    transform: (value) => value.trim(),
    dynamicTyping: false
  });

  if (result.errors.length > 0) {
    throw new Error(
      `CSV parsing failed: ${result.errors
        .slice(0, 5)
        .map((item) => item.message)
        .join('; ')}`
    );
  }

  const fields = result.meta.fields || [];

  if (fields.length === 0) {
    throw new Error('CSV must contain a header row.');
  }

  if (fields.length > MAX_COLUMNS) {
    throw new Error(`CSV cannot contain more than ${MAX_COLUMNS} columns.`);
  }

  const normalizedFields = fields.map((field) => field.trim());

  if (normalizedFields.some((field) => !field)) {
    throw new Error('CSV contains an empty column name.');
  }

  if (new Set(normalizedFields).size !== normalizedFields.length) {
    throw new Error('CSV contains duplicate column names.');
  }

  if (result.data.length === 0) {
    throw new Error('CSV contains no data rows.');
  }

  if (result.data.length > MAX_ROWS) {
    throw new Error(`CSV cannot contain more than ${MAX_ROWS} records.`);
  }

  const rows = result.data.map((row, index) => {
    const normalizedRow = {};

    for (const field of normalizedFields) {
      normalizedRow[field] = String(row[field] ?? '').trim();
    }

    return {
      rowNumber: index + 2,
      data: normalizedRow
    };
  });

  return {
    headers: normalizedFields,
    rows,
    totalRows: rows.length
  };
};

export default parseCsv;

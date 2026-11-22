
const normalizeColumnName = (value) =>
  String(value || '').trim().toLowerCase();

export const validateVariableData = ({
  headers,
  rows,
  requiredFields = [],
  maxFieldLength = 500,
  uniqueFields = []
}) => {
  if (!Array.isArray(headers) || !Array.isArray(rows)) {
    throw new Error('CSV headers and rows are required.');
  }

  const normalizedHeaders = new Map(
    headers.map((header) => [
      normalizeColumnName(header),
      header
    ])
  );

  const missingFields = requiredFields.filter(
    (field) => !normalizedHeaders.has(normalizeColumnName(field))
  );

  if (missingFields.length > 0) {
    throw new Error(
      `Required CSV columns are missing: ${missingFields.join(', ')}`
    );
  }

  for (const field of uniqueFields) {
    if (!normalizedHeaders.has(normalizeColumnName(field))) {
      throw new Error(`Unique field "${field}" is not present in the CSV.`);
    }
  }

  const seenValues = new Map();
  const validRows = [];
  const invalidRows = [];

  for (const row of rows) {
    const errors = [];
    const values = row.data || {};

    for (const field of requiredFields) {
      const actualField = normalizedHeaders.get(
        normalizeColumnName(field)
      );

      if (!String(values[actualField] ?? '').trim()) {
        errors.push(`Missing required value: ${field}`);
      }
    }

    for (const [field, value] of Object.entries(values)) {
      if (String(value).length > maxFieldLength) {
        errors.push(
          `${field} exceeds the ${maxFieldLength} character limit.`
        );
      }
    }

    for (const field of uniqueFields) {
      const actualField = normalizedHeaders.get(
        normalizeColumnName(field)
      );

      const value = String(values[actualField] ?? '').trim();

      if (!value) continue;

      const key = `${normalizeColumnName(field)}:${value.toLowerCase()}`;

      if (seenValues.has(key)) {
        errors.push(
          `Duplicate ${field} value. First used in row ${seenValues.get(key)}.`
        );
      } else {
        seenValues.set(key, row.rowNumber);
      }
    }

    if (errors.length > 0) {
      invalidRows.push({
        rowNumber: row.rowNumber,
        errors,
        data: values
      });
    } else {
      validRows.push(row);
    }
  }

  return {
    valid: invalidRows.length === 0,
    totalRows: rows.length,
    validCount: validRows.length,
    invalidCount: invalidRows.length,
    validRows,
    invalidRows
  };
};

export default validateVariableData;

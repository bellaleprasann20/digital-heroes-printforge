
import crypto from 'node:crypto';

const generateOrderNumber = (date = new Date()) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new Error('A valid date is required.');
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  const datePart = `${year}${month}${day}`;
  const uniquePart = crypto.randomBytes(4).toString('hex').toUpperCase();

  return `PF-${datePart}-${uniquePart}`;
};

export default generateOrderNumber;

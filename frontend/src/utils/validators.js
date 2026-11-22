export const validators = {
  required(value, fieldName = 'This field') {
    if (value === null || value === undefined || String(value).trim() === '') {
      return `${fieldName} is required.`;
    }

    return null;
  },

  name(value) {
    const requiredError = this.required(value, 'Name');
    if (requiredError) return requiredError;

    const name = value.trim();

    if (name.length < 2) return 'Name must contain at least 2 characters.';
    if (name.length > 100) return 'Name cannot exceed 100 characters.';

    return null;
  },

  email(value) {
    const requiredError = this.required(value, 'Email');
    if (requiredError) return requiredError;

    const email = value.trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return 'Please enter a valid email address.';
    }

    return null;
  },

  password(value) {
    const requiredError = this.required(value, 'Password');
    if (requiredError) return requiredError;

    if (value.length < 8) {
      return 'Password must contain at least 8 characters.';
    }

    if (!/[A-Z]/.test(value)) {
      return 'Password must contain at least one uppercase letter.';
    }

    if (!/[a-z]/.test(value)) {
      return 'Password must contain at least one lowercase letter.';
    }

    if (!/[0-9]/.test(value)) {
      return 'Password must contain at least one number.';
    }

    return null;
  },

  confirmPassword(password, confirmation) {
    if (!confirmation) return 'Please confirm your password.';

    if (password !== confirmation) {
      return 'Passwords do not match.';
    }

    return null;
  },

  phone(value) {
    const requiredError = this.required(value, 'Phone number');
    if (requiredError) return requiredError;

    const normalized = value.replace(/[\s()-]/g, '');

    if (!/^\+?[0-9]{10,15}$/.test(normalized)) {
      return 'Please enter a valid phone number.';
    }

    return null;
  },

  positiveNumber(value, fieldName = 'Value') {
    if (value === '' || value === null || value === undefined) {
      return `${fieldName} is required.`;
    }

    const number = Number(value);

    if (!Number.isFinite(number) || number <= 0) {
      return `${fieldName} must be greater than zero.`;
    }

    return null;
  },

  quantity(value, min = 1, max = 100000) {
    const number = Number(value);

    if (!Number.isInteger(number) || number < min || number > max) {
      return `Quantity must be between ${min} and ${max}.`;
    }

    return null;
  },

  message(value, min = 5, max = 2000) {
    const requiredError = this.required(value, 'Message');
    if (requiredError) return requiredError;

    if (value.trim().length < min) {
      return `Message must contain at least ${min} characters.`;
    }

    if (value.trim().length > max) {
      return `Message cannot exceed ${max} characters.`;
    }

    return null;
  },

  url(value) {
    if (!value) return null;

    try {
      const url = new URL(value);

      if (!['http:', 'https:'].includes(url.protocol)) {
        return 'Please enter a valid HTTP or HTTPS URL.';
      }

      return null;
    } catch {
      return 'Please enter a valid URL.';
    }
  },
};

export function validateForm(values, rules) {
  const errors = {};

  Object.entries(rules).forEach(([field, fieldRules]) => {
    const value = values[field];

    const checks = Array.isArray(fieldRules)
      ? fieldRules
      : [fieldRules];

    for (const check of checks) {
      const error = typeof check === 'function'
        ? check(value, values)
        : null;

      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export default validators;
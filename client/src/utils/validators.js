// Each validator returns `null` when valid, or a short user-facing error
// string when invalid — designed to plug straight into <Input error={...} />.

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_PHONE_RE = /^[6-9]\d{9}$/;
const INDIAN_PINCODE_RE = /^[1-9]\d{5}$/;

export function required(value, label = 'This field') {
    if (value === null || value === undefined) return `${label} is required`;
    if (typeof value === 'string' && value.trim() === '') return `${label} is required`;
    if (Array.isArray(value) && value.length === 0) return `${label} is required`;
    return null;
}

export function validateEmail(value) {
    if (!value || !value.trim()) return 'Email is required';
    if (!EMAIL_RE.test(value.trim())) return 'Enter a valid email address';
    return null;
}

/**
 * Matches the backend policy (Part 2): min 8 chars, at least one letter
 * and one number. Keep this in sync with server/validators/auth.validator.js.
 */
export function validatePassword(value) {
    if (!value) return 'Password is required';
    if (value.length < 8) return 'Password must be at least 8 characters';
    if (!/[a-zA-Z]/.test(value) || !/\d/.test(value)) {
        return 'Password must contain at least one letter and one number';
    }
    return null;
}

export function validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
}

export function validatePhone(value) {
    if (!value) return 'Phone number is required';
    if (!INDIAN_PHONE_RE.test(value.trim())) return 'Enter a valid 10-digit phone number';
    return null;
}

export function validatePincode(value) {
    if (!value) return 'Pincode is required';
    if (!INDIAN_PINCODE_RE.test(value.trim())) return 'Enter a valid 6-digit pincode';
    return null;
}

export function minLength(value, min, label = 'This field') {
    if (!value || value.trim().length < min) return `${label} must be at least ${min} characters`;
    return null;
}

export function maxLength(value, max, label = 'This field') {
    if (value && value.trim().length > max) return `${label} must be under ${max} characters`;
    return null;
}

/**
 * Runs a set of { field: validatorFn } pairs against a values object and
 * returns an { field: errorMessage } map containing only the failures.
 *
 * Usage:
 *   const errors = validateForm(values, {
 *     email: (v) => validateEmail(v.email),
 *     password: (v) => validatePassword(v.password),
 *   });
 *   const isValid = Object.keys(errors).length === 0;
 */
export function validateForm(values, validatorMap) {
    const errors = {};
    for (const field of Object.keys(validatorMap)) {
        const error = validatorMap[field](values);
        if (error) errors[field] = error;
    }
    return errors;
}
function isNonEmptyString(value) {
    return typeof value === 'string' && value.length > 0;
}

function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isStrongPassword(value) {
    return typeof value === 'string' && value.length >= 0;
}

export function validateUser(userData) {
    const errors = {};
    const email = userData.email;
    const password = userData.password;
    const name = userData.name;

    if (!isEmail(email)) errors.email = 'Email is Invalid';
    if (!isStrongPassword(password)) errors.password = 'Password must be strong';
    if (!isNonEmptyString(name)) errors.name = 'Name is required';

    return {
        ok: Object.keys(errors).length === 0,
        errors,
        data: userData
    };
}
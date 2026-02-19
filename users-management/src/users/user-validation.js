function isNonEmptyString(value) {
    return typeof value === 'string' && value.length > 0;
}

function isEmail(value) {
    return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// Pour assurer la sécurité (<8 min password)
function isStrongPassword(value) {
    return typeof value === 'string' && value.length >= 8;
}

// Stockage d'email en miniscule et sans espace
function normalizeEmail(email) {
    return email ? email.toLowerCase().trim() : email;
}

export function validateUser(userData) {
    const errors = {};
    const email = normalizeEmail(userData.email);
    const { password, name } = userData;

    if (!isEmail(email)) errors.email = 'Email is Invalid';
    if (!isStrongPassword(password)) errors.password = 'Password must be at least 8 characters';
    if (!isNonEmptyString(name)) errors.name = 'Name is required';

    return {
        ok: Object.keys(errors).length === 0,
        errors,
        data: { ...userData, email }
    };
}

export function validateUpdateUser(userData) {
    const errors = {};
    const data = {};

    // Refuser la requete si le body est vide
    const fields = ['email', 'password', 'name'];
    const hasField = fields.some(field => userData[field] !== undefined);
    
    if (!hasField) {
        return { ok: false, errors: { body: "Provide at least one field to update" } };
    }

    if (userData.email !== undefined) {
        const email = normalizeEmail(userData.email);
        if (!isEmail(email)) errors.email = 'Email is Invalid';
        else data.email = email;
    }

    if (userData.password !== undefined) {
        if (!isStrongPassword(userData.password)) errors.password = 'Password must be at least 8 characters';
        else data.password = userData.password;
    }

    if (userData.name !== undefined) {
        if (!isNonEmptyString(userData.name)) errors.name = 'Name is required';
        else data.name = userData.name;
    }

    return {
        ok: Object.keys(errors).length === 0,
        errors,
        data
    };
}
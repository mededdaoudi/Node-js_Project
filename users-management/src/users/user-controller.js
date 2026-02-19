import { createUser, findUserByEmail, 
         getUserById, listUsers, 
         deleteUser, updateUser, countUsers } 
    from "./user-service.js";
import { validateUser , validateUpdateUser } 
    from "./user-validation.js";

// supprimer le password dans les réponses JSON 
function excludePassword(user) {
    if (Array.isArray(user)) return user.map(u => excludePassword(u));
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

export async function handleCreateUser(req, res) {
    try {
        const result = validateUser(req.body);
        if (!result.ok) return res.status(400).json({ message: 'Validation failed', errors: result.errors });

        const existingUser = await findUserByEmail(result.data.email);
        if (existingUser) return res.status(409).json({ message: 'User already exists' });

        const user = await createUser(result.data);
        return res.status(201).json(excludePassword(user));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function handleListeUsers(req, res) {
    try {
        const users = await listUsers();
        return res.status(200).json(excludePassword(users));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function handleGetUserById(req, res) {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        return res.status(200).json(excludePassword(user));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function handleDeleteUser(req, res) {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        await deleteUser(id);
        return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Recherche par email 
export async function handleSearchUser(req, res) {
    const { email } = req.query;
    if (!email) return res.status(400).json({ error: "Email parameter is required" }); 

    const user = await findUserByEmail(email.toLowerCase().trim());
    if (!user) return res.status(404).json({ message: "User not found" }); 

    return res.status(200).json(excludePassword(user)); 
}

// Compteur 
export async function handleCountUsers(req, res) {
    const count = await countUsers();
    return res.status(200).json({ "Users count": count }); 
}

export async function handleUpdateUser(req, res) {
    try {
        const { id } = req.params;
        const user = await getUserById(id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const results = validateUpdateUser(req.body);
        if (!results.ok) return res.status(400).json({ error: "Validation error", fields: results.errors }); 

        if (results.data.email && results.data.email !== user.email) {
            const existing = await findUserByEmail(results.data.email);
            if (existing) return res.status(409).json({ error: "Email already in use" });
        }

        const updatedUser = await updateUser(id, results.data);
        return res.status(200).json(excludePassword(updatedUser));
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Changer uniquement le mot de passe
export async function handleUpdatePassword(req, res) {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters" }); 
    }

    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" }); 

    const updated = await updateUser(id, { password });
    return res.status(200).json(excludePassword(updated)); 
}

// Création groupée des users (Bulk)
export async function handleBulkCreate(req, res) {
    const { users } = req.body;
    if (!Array.isArray(users)) return res.status(400).json({ error: "Users list required" });

    for (const uData of users) {
        const validation = validateUser(uData);
        if (!validation.ok) return res.status(400).json({ error: "Validation failed in bulk", details: validation.errors });
        
        const existing = await findUserByEmail(validation.data.email);
        if (existing) return res.status(409).json({ error: `Email ${validation.data.email} already exists` });
    }

    const createdUsers = [];
    for (const uData of users) {
        const validatedData = validateUser(uData).data;
        const newUser = await createUser(validatedData);
        createdUsers.push(excludePassword(newUser));
    }
    
    return res.status(201).json(createdUsers);
}
import { createUser, findUserByEmail, getUserById, listUsers, deleteUser, updateUser } from "./user-service.js";
import { validateUser , validateUpdateUser} from "./user-validation.js";


export async function handleCreateUser(req, res) {
    try {
        const result = validateUser(req.body);

        if (!result.ok) {
            return res.status().json({
                message: 'Validation failed',
                errors: result.errors
            });
        }
            // Check if the user already exists
            const existingUser = await findUserByEmail(req.body.email);
            if (existingUser) {
                return res.status(409).json({ message: 'User already exists' });
            }

            // Create User
            const user = await createUser(req.body);
            return res.status(201).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function handleListeUsers(req, res) {
    try {
        const users = await listUsers();
        return res.status(200).json(users);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function handleGetUserById(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Misssing user ID'});
        }

        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }

        return res.status(200).json(user);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function handleDeleteUser(req, res) {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Misssing user ID'});
        }

        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found'});
        }
        await deleteUser(id);

        return res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export async function handleUpdateUser(req, res) {
  try {
    // Check if user ID exists
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Missing user ID' });
    }

    // Verify if user exists
    const user = await getUserById(id);
    if(!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate user data
    const results = validateUpdateUser(req.body);
    if (!results.ok) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: results.errors
      });
    }

    const updatedUser = await updateUser(id, results.data);
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
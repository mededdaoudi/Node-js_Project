import { createUser, findUserByEmail } from "./user-service.js";
import { validateUser } from "./user-validation.js";


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
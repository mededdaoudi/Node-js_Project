import { Router } from "express";
import { handleCreateUser, handleDeleteUser, handleGetUserById, handleListeUsers, handleUpdateUser } from "./user-controller.js";

const router = Router();

// /users
router.post('/', handleCreateUser);

router.get('/', handleListeUsers);
router.get('/:id', handleGetUserById);

router.delete('/:id', handleDeleteUser);
router.patch('/:id', handleUpdateUser);

export default router;
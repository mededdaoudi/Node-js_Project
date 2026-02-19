import { Router } from "express";
import { 
    handleCreateUser,
    handleDeleteUser,
    handleGetUserById,
    handleListeUsers,
    handleUpdateUser,
    handleCountUsers, 
    handleSearchUser, 
    handleBulkCreate, 
    handleUpdatePassword
} from "./user-controller.js";

const router = Router();

// POST
router.post('/bulk', handleBulkCreate); 
router.post('/', handleCreateUser); 

// GET 
router.get('/count', handleCountUsers); 
router.get('/search', handleSearchUser);
router.get('/', handleListeUsers);
router.get('/:id', handleGetUserById); 

// DELETE et PATCH
router.delete('/:id', handleDeleteUser);
router.patch('/:id/password', handleUpdatePassword);
router.patch('/:id', handleUpdateUser); 

export default router;
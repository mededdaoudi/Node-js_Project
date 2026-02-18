import { Router } from "express";
import { handleCreateUser } from "./user-controller.js";

const router = Router();

// /users
router.post('/', handleCreateUser);

export default router;
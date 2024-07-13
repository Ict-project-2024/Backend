import express from 'express'
import {createRole, deleteRole, getAllRoles, updateRole} from '../controllers/role.controller.js'

const router = express.Router();

router.post("/create", createRole);

router.put("/update/:id", updateRole);

router.get('/',getAllRoles);

router.delete('/:id',deleteRole)

export default router;
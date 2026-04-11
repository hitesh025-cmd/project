import express from 'express';
import { getInventory, updateInventory } from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', getInventory);
router.put('/:bloodGroup', updateInventory);

export default router;

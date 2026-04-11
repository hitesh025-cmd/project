import express from 'express';
import { getDonors, createDonor, updateDonor, deleteDonor } from '../controllers/donorController.js';

const router = express.Router();

router.get('/', getDonors);
router.post('/', createDonor);
router.put('/:id', updateDonor);
router.delete('/:id', deleteDonor);

export default router;

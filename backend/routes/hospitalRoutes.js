import express from 'express';
import { getHospitals, createHospital, updateHospital, deleteHospital } from '../controllers/hospitalController.js';

const router = express.Router();

router.get('/', getHospitals);
router.post('/', createHospital);
router.put('/:id', updateHospital);
router.delete('/:id', deleteHospital);

export default router;

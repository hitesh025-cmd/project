import express from 'express';
import { getRequests, createRequest, updateRequestStatus } from '../controllers/requestController.js';

const router = express.Router();

router.get('/', getRequests);
router.post('/', createRequest);
router.put('/:id', updateRequestStatus);

export default router;

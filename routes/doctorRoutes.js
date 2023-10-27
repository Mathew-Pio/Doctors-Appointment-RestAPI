import express from 'express';
import { updateDoctor, deleteDoctor, getSingleDoctor, getAllDoctors } from '../controllers/doctorController.js';
import { authenticate, restrict } from '../auth/verify-token.js';
import reviewRouter from './reviewRoutes.js';

const router = express.Router();
router.use('/:doctorId/reviews', reviewRouter);

router.put('/:id', authenticate, restrict(["patient"]), updateDoctor);

router.delete('/:id', authenticate, restrict(["patient"]), deleteDoctor);

router.get('/:id', getSingleDoctor);

router.get('/', getAllDoctors);

export default router;
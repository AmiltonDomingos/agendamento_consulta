import { Router } from 'express';
import { appointmentController } from './appointment.controller.js';

const router = Router();

router.get('/',           appointmentController.getAll);
router.get('/:id',        appointmentController.getById);
router.post('/',          appointmentController.create);
router.put('/:id',        appointmentController.update);
router.patch('/:id/cancel', appointmentController.cancel);
router.delete('/:id',     appointmentController.delete);

export default router;

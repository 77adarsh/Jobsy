import express from 'express';
import { trackLocation } from '../controllers/locationController.js';

const router = express.Router();

router.get('/track', trackLocation);

export default router;
import { Router } from 'express';
import * as PostController from '../controllers/post.controller';
const router = new Router();

router.post('/backoffice', PostController.getFromBackoffice);

export default router;

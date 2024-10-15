import { Router } from 'express';
import apiController from '../controller/apiController';

const apiRouter = Router();

apiRouter.route('/self').get(apiController.self);
export default apiRouter;

import express, { Application, NextFunction, Request, Response } from 'express';
import path from 'path';
import apiRouter from './router/apiRouter';
import globalErrorHandler from './middleware/globalErrorHandler';
import responseMessage from './constants/responseMessage';
import httpError from './util/httpError';

const app: Application = express();

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../', '/public')));

// Routes
app.use('/api/v1', apiRouter);

//404 handler
app.use((req: Request, _: Response, next: NextFunction) => {
    try {
        throw new Error(responseMessage.NOT_FOUND('route'));
    } catch (error) {
        httpError(next, error, req, 404);
    }
});

// Global error handler
app.use(globalErrorHandler);
export { app };

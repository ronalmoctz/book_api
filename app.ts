import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ENV } from './src/config/env';
import { httpLogger } from './src/middlewares/httpLogger';
import PublisherRoute from './src/routes/publisher';
import AuthorRoute from './src/routes/authors';
import GenreRoute from './src/routes/genres';
import BookRoute from './src/routes/books';
import { errorHandler } from './src/middlewares/errorHandler';
import multer from 'multer';


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(httpLogger);

app.get('/', (_req, res) => {
    res.send('API is working');
})

app.use('/api/books', BookRoute)
app.use('/api/authors', AuthorRoute)
app.use('/api/publishers', PublisherRoute)
app.use('/api/genres', GenreRoute)

app.use((err: unknown, _req: Request, res: Response, next: NextFunction): void => {
    if (err instanceof multer.MulterError) {
        const msg =
            err.code === 'LIMIT_FILE_SIZE'
                ? 'El archivo excede 1 MB'
                : `Error al procesar archivo: ${err.message}`;
        res.status(400).json({ message: msg });
        return;
    }
    next(err);
}
);


app.use(errorHandler)


const bootstrap = async () => {
    try {
        app.listen(ENV.PORT, () => {
            console.log(`🚀 Server running on http://localhost:${ENV.PORT}`);
        });
    } catch (error) {
        console.error("❌ Error al iniciar el servidor:", error);
        process.exit(1);
    }
};


bootstrap();
import express from 'express';
import cors from 'cors';
import { ENV } from './src/config/env';
import { httpLogger } from './src/middlewares/httpLogger';
import PublisherRoute from './src/routes/publisher';
import AuthorRoute from './src/routes/authors';
import GenreRoute from './src/routes/genres';
import BookRoute from './src/routes/books';



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
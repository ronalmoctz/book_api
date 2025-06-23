import express from 'express';
import cors from 'cors';
import { ENV } from './src/config/env.js';
import { httpLogger } from './src/middlewares/httpLogger.js';
import PublisherRoute from './src/routes/publisher.js';
import AuthorRoute from './src/routes/authors.js';
import GenreRoute from './src/routes/genres.js';
import BookRoute from './src/routes/books.js';



const app = express();
const allowedOrigins = [
    "http://localhost:5173",
    "https://book-ronal.vercel.app"
];



app.use(cors({
    origin: allowedOrigins,
    credentials: true,
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
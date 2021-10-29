import express from 'express';
import news from './routes/news.js';
const PORT = 8000;

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
	res.json('Welcome to my Climate Change News Api');
});

app.use('/news', news);

app.listen(process.env.PORT || PORT, () => {
	console.log('Your server is up and running');
});

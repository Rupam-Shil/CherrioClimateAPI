import express from 'express';
const router = express.Router();
import cheerio from 'cheerio';
import axios from 'axios';

const newspapers = [
	{
		name: 'cityam',
		address:
			'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
		base: '',
	},
	{
		name: 'thetimes',
		address: 'https://www.thetimes.co.uk/environment/climate-change',
		base: '',
	},
	{
		name: 'guardian',
		address: 'https://www.theguardian.com/environment/climate-crisis',
		base: '',
	},
	{
		name: 'telegraph',
		address: 'https://www.telegraph.co.uk/climate-change',
		base: 'https://www.telegraph.co.uk',
	},
	{
		name: 'nyt',
		address: 'https://www.nytimes.com/international/section/climate',
		base: '',
	},
	{
		name: 'latimes',
		address: 'https://www.latimes.com/environment',
		base: '',
	},
	{
		name: 'smh',
		address: 'https://www.smh.com.au/environment/climate-change',
		base: 'https://www.smh.com.au',
	},
	{
		name: 'un',
		address: 'https://www.un.org/climatechange',
		base: '',
	},
	{
		name: 'bbc',
		address: 'https://www.bbc.co.uk/news/science_and_environment',
		base: 'https://www.bbc.co.uk',
	},
	{
		name: 'es',
		address: 'https://www.standard.co.uk/topic/climate-change',
		base: 'https://www.standard.co.uk',
	},
	{
		name: 'sun',
		address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
		base: '',
	},
	{
		name: 'dm',
		address:
			'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
		base: '',
	},
	{
		name: 'nyp',
		address: 'https://nypost.com/tag/climate-change/',
		base: '',
	},
];

const articles = [];
let id = 0;

const fetchData = async (source, uri, base) => {
	try {
		const { data } = await axios.get(uri);
		const $ = cheerio.load(data);
		$('a:contains("climate")', data).each(function () {
			id++;
			const title = $(this).text();
			const url = $(this).attr('href');
			articles.push({ id, title, url: base + url, source });
		});
	} catch (err) {
		console.log(err);
	}
};

newspapers.forEach((newspaper) => {
	const { name, address, base } = newspaper;
	fetchData(name, address, base);
});

router.get('/', async (req, res) => {
	res.json(articles);
});

router.get('/:newspaperId', async (req, res) => {
	id = 0;
	const { newspaperId } = req.params;

	const newspaper = newspapers.filter(
		(newspaper) => newspaper.name == newspaperId
	);
	if (newspaper.length === 0) res.json('Query not satisfied');
	else {
		const { base, address } = newspaper[0];
		try {
			const { data } = await axios.get(address);
			const $ = cheerio.load(data);
			const specificArticles = [];
			$('a:contains("climate")', data).each(function () {
				id++;
				const title = $(this).text();
				const url = $(this).attr('href');
				specificArticles.push({
					id,
					title,
					url: base + url,
					source: newspaperId,
				});
			});

			res.json(specificArticles);
		} catch (err) {
			console.log(err);
		}
	}
});

export default router;

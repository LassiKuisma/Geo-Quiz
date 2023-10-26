import express from 'express';
import { getAllCountries, getCountry } from '../services/countryService';
import { Country } from '../util/types';

const router = express.Router();

router.get('/', async (_req, res) => {
  const result = await getAllCountries();
  if (result.k === 'error') {
    return res.status(500).send(result.message);
  }

  const countries: Array<Country> = result.value;
  return res.json(countries);
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).send(`Invalid country id: ${id}`);
  }

  const result = await getCountry(id);
  if (result.k === 'error') {
    return res.status(500).send(result.message);
  }

  const country: Country | null = result.value;
  if (!country) {
    return res.status(404).send();
  }

  return res.json(country);
});

export default router;

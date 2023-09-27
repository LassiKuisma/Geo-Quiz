import express from 'express';
import {
  Continent,
  CountryModel,
  DrivingSide,
  Language,
  Region,
  Subregion,
} from '../models';

const router = express.Router();

router.get('/', async (_req, res, next) => {
  try {
    const countries = await CountryModel.findAll({
      attributes: {
        exclude: ['drivingSideId', 'regionId', 'subregionId'],
      },
      include: [
        { model: DrivingSide, attributes: ['side'] },
        { model: Region, attributes: ['regionName'] },
        { model: Subregion, attributes: ['subregionName'] },
        {
          model: Continent,
          attributes: ['continentName'],
          through: { attributes: [] },
        },
        {
          model: Language,
          attributes: ['languageName'],
          through: { attributes: [] },
        },
      ],
    });

    res.json(countries);
  } catch (error) {
    return next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = req.params.id;

    const country = await CountryModel.findByPk(id, {
      attributes: {
        exclude: ['drivingSideId', 'regionId', 'subregionId'],
      },
      include: [
        { model: DrivingSide, attributes: ['side'] },
        { model: Region, attributes: ['regionName'] },
        { model: Subregion, attributes: ['subregionName'] },
        {
          model: Continent,
          attributes: ['continentName'],
          through: { attributes: [] },
        },
        {
          model: Language,
          attributes: ['languageName'],
          through: { attributes: [] },
        },
      ],
    });
    if (!country) {
      return res.status(404).send();
    }

    return res.json(country);
  } catch (error) {
    return next(error);
  }
});

export default router;

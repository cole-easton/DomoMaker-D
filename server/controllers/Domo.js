const models = require('../models');

const { Domo } = models;
const makerPage = async (req, res) => res.render('app');

const deleteDomo = async (req, res) => {
  if (!req.body.id) {
    return res.status(400).json({ error: 'id is required' });
  }
  try {
    const deathRowDomo = await Domo.find({ _id: req.body.id }).select('owner').lean().exec();
    if (JSON.stringify(deathRowDomo[0].owner).replaceAll('"', '') === req.session.account._id) {
      await Domo.findByIdAndDelete(req.body.id);
      return res.status(204).json({ message: 'Deletion successful' });
    }

    return res.status(403).json({ error: 'You may only delete your own Domos.' });
  } catch (err) {
    return res.status(500).json({ error: JSON.stringify(err) });
  }
};

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age) {
    return res.status(400).json({ error: 'Both name and age are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    gender: req.body.gender,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, gender: newDomo.gender });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(500).json({ error: 'An error occurred making domo!' });
  }
};

const getDomos = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Domo.find(query).select('name age gender').lean().exec();
    return res.json({ domos: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving domos!' });
  }
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  deleteDomo,
};

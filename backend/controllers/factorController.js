const EmissionFactor = require('../models/EmissionFactor');

// @desc Get all factors
const getFactors = async (req, res) => {
    const factors = await EmissionFactor.find({});
    res.json(factors);
};

// @desc Create or Update a factor
const upsertFactor = async (req, res) => {
    const { type, factorValue } = req.body;
    try {
        // findOneAndUpdate with 'upsert: true' means it updates if exists, creates if not
        const factor = await EmissionFactor.findOneAndUpdate(
            { type }, 
            { factorValue }, 
            { new: true, upsert: true }
        );
        res.status(201).json(factor);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

module.exports = { getFactors, upsertFactor };
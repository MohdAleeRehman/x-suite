const express = require('express');
const router = express.Router();
const Record = require('../models/Record');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Helper: build title from dataset
const buildTitle = (type, dataset) => {
  if (type === 'sale') {
    return `Sale: AED ${Math.round(dataset.sellPrice).toLocaleString('en-AE')}`;
  } else if (type === 'rent') {
    return `Rent: AED ${Math.round(dataset.rentAnnual).toLocaleString('en-AE')} (${dataset.rentCheques} Chqs)`;
  } else {
    return `Prop: ${dataset.pBuilding} (Unit ${dataset.pUnit})`;
  }
};

// Helper: build dataset field based on type
const buildDatasetFields = (type, dataset) => {
  if (type === 'sale') return { saleDataset: dataset };
  if (type === 'rent') return { rentDataset: dataset };
  if (type === 'prop') return { propDataset: dataset };
  return {};
};

// @route   GET /api/records
// @desc    Get all records for the logged-in user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const records = await Record.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    console.error('Get records error:', err);
    res.status(500).json({ message: 'Error fetching records' });
  }
});

// @route   POST /api/records
// @desc    Create a new record
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { type, dataset } = req.body;

    if (!type || !dataset) {
      return res.status(400).json({ message: 'type and dataset are required' });
    }

    if (!['sale', 'rent', 'prop'].includes(type)) {
      return res.status(400).json({ message: 'type must be sale, rent, or prop' });
    }

    const title = buildTitle(type, dataset);
    const datasetFields = buildDatasetFields(type, dataset);

    const record = await Record.create({
      user: req.user._id,
      type,
      title,
      ...datasetFields
    });

    res.status(201).json(record);
  } catch (err) {
    console.error('Create record error:', err);
    res.status(500).json({ message: 'Error creating record' });
  }
});

// @route   GET /api/records/:id
// @desc    Get a single record
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const record = await Record.findOne({ _id: req.params.id, user: req.user._id });
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json(record);
  } catch (err) {
    console.error('Get record error:', err);
    res.status(500).json({ message: 'Error fetching record' });
  }
});

// @route   PUT /api/records/:id
// @desc    Update a record
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const { type, dataset } = req.body;

    const record = await Record.findOne({ _id: req.params.id, user: req.user._id });
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    const updateType = type || record.type;
    const title = buildTitle(updateType, dataset);
    const datasetFields = buildDatasetFields(updateType, dataset);

    const updated = await Record.findByIdAndUpdate(
      req.params.id,
      { title, type: updateType, ...datasetFields },
      { new: true, runValidators: true }
    );

    res.json(updated);
  } catch (err) {
    console.error('Update record error:', err);
    res.status(500).json({ message: 'Error updating record' });
  }
});

// @route   DELETE /api/records/:id
// @desc    Delete a record
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const record = await Record.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ message: 'Record deleted successfully', id: req.params.id });
  } catch (err) {
    console.error('Delete record error:', err);
    res.status(500).json({ message: 'Error deleting record' });
  }
});

module.exports = router;

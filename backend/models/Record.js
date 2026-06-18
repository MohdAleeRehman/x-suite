const mongoose = require('mongoose');

// Sale Dataset sub-schema
const saleDatasetSchema = new mongoose.Schema({
  origPrice: Number,
  sellPrice: Number,
  propStatus: { type: String, enum: ['offplan', 'Ready'], default: 'offplan' },
  paidType: { type: String, enum: ['pct', 'amt'], default: 'pct' },
  paidVal: Number,
  devBal: Number,
  dldPct: { type: Number, default: 2 },
  sldBasePct: { type: Number, default: 2 },
  sldSellPct: { type: Number, default: 1 },
  nocFee: { type: Number, default: 5250 },
  spaFee: { type: Number, default: 1250 },
  titleDeed: { type: Number, default: 520 },
  bcType: { type: String, enum: ['pct', 'amt'], default: 'pct' },
  bcVal: Number,
  scType: { type: String, enum: ['pct', 'amt'], default: 'pct' },
  scVal: Number,
  hasUtil: { type: Boolean, default: true },
  uWater: { type: Number, default: 0 },
  uGas: { type: Number, default: 0 },
  uElec: { type: Number, default: 0 },
  uFire: { type: Number, default: 0 },
  payerMap: {
    Water: { type: String, default: 'buyer' },
    Gas: { type: String, default: 'buyer' },
    Elec: { type: String, default: 'buyer' },
    Fire: { type: String, default: 'buyer' }
  }
}, { _id: false });

// Rent Dataset sub-schema
const rentDatasetSchema = new mongoose.Schema({
  rentAnnual: Number,
  rentCheques: { type: Number, default: 4 },
  rentSewa: { type: Number, default: 2000 },
  rentFurnished: { type: String, enum: ['furnished', 'unfurnished'], default: 'unfurnished' },
  rcType: { type: String, enum: ['pct', 'amt'], default: 'pct' },
  rcVal: Number,
  rentStartDate: String
}, { _id: false });

// Property Dataset sub-schema
const propDatasetSchema = new mongoose.Schema({
  propArchetype: { type: String, enum: ['Apartment', 'Villa'], default: 'Villa' },
  propHandoverVal: { type: String, enum: ['Yes', 'No'], default: 'Yes' },
  pBuilding: String,
  pUnit: String,
  pLevel: String,
  pView: String,
  pType: String,
  pBeds: String,
  pBaths: String,
  pLiving: String,
  pBalcony: String,
  pParking: String,
  pPlotArea: String,
  pSaleArea: String,
  pPrice: String,
  pPriceSqft: String,
  pStatus: String,
  pPaidOwner: String,
  pLeft: String,
  pExpectRent: String,
  pReturn: String
}, { _id: false });

// Main Record schema
const recordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['sale', 'rent', 'prop'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  saleDataset: saleDatasetSchema,
  rentDataset: rentDatasetSchema,
  propDataset: propDatasetSchema
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema);

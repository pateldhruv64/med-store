const Medicine = require('../models/Medicine');

exports.getAll = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { batch: { $regex: search, $options: 'i' } },
        ],
      };
    }
    const medicines = await Medicine.find(query);
    res.json(medicines);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const med = await Medicine.findById(req.params.id);
    if (!med) return res.status(404).json({ message: 'Not found' });
    res.json(med);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const med = await Medicine.create(req.body);
    res.status(201).json(med);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const med = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!med) return res.status(404).json({ message: 'Not found' });
    res.json(med);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const med = await Medicine.findByIdAndDelete(req.params.id);
    if (!med) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};

exports.addStock = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const med = await Medicine.findById(req.params.id);
    if (!med) return res.status(404).json({ message: 'Not found' });
    med.quantity += Number(quantity);
    await med.save();
    res.json(med);
  } catch (err) { next(err); }
};

exports.expiryAlerts = async (req, res, next) => {
  try {
    const soon = new Date();
    soon.setDate(soon.getDate() + 60);
    const expiring = await Medicine.find({ expiry: { $lte: soon } });
    res.json(expiring);
  } catch (err) { next(err); }
};

exports.lowStockAlerts = async (req, res, next) => {
  try {
    const low = await Medicine.find({ $expr: { $lte: ["$quantity", "$lowStockThreshold"] } });
    res.json(low);
  } catch (err) { next(err); }
}; 
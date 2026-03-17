const Sale = require('../models/Sale');
const Medicine = require('../models/Medicine');

exports.getAll = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    let query = {};
    if (from || to) {
      query.date = {};
      if (from) query.date.$gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        query.date.$lte = toDate;
      }
    }
    const sales = await Sale.find(query).populate('medicine').populate('staff', 'username');
    res.json(sales);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id).populate('medicine').populate('staff', 'username');
    if (!sale) return res.status(404).json({ message: 'Not found' });
    res.json(sale);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const { medicine, quantity, price } = req.body;
    const med = await Medicine.findById(medicine);
    if (!med) return res.status(404).json({ message: 'Medicine not found' });
    if (med.quantity < quantity) return res.status(400).json({ message: 'Not enough stock' });
    med.quantity -= quantity;
    await med.save();
    const sale = await Sale.create({ medicine, quantity, price, staff: req.user._id });
    res.status(201).json(sale);
  } catch (err) { next(err); }
};

exports.report = async (req, res, next) => {
  try {
    const sales = await Sale.find().populate('medicine').populate('staff', 'username');
    res.json(sales);
  } catch (err) { next(err); }
};

exports.myStats = async (req, res, next) => {
  try {
    const staffId = req.user._id;
    const sales = await Sale.find({ staff: staffId }).populate('medicine');
    const totalSales = sales.length;
    let totalProfit = 0;
    const profitByDate = {};
    sales.forEach(s => {
      const profit = (s.price - (s.medicine?.purchasePrice || 0)) * s.quantity;
      totalProfit += profit;
      const date = s.date.toISOString().slice(0, 10);
      profitByDate[date] = (profitByDate[date] || 0) + profit;
    });
    res.json({ totalSales, totalProfit, profitByDate });
  } catch (err) { next(err); }
}; 
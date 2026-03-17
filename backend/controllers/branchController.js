const Branch = require('../models/Branch');

exports.getAll = async (req, res, next) => {
  try {
    const branches = await Branch.find();
    res.json(branches);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const branch = await Branch.findById(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Not found' });
    res.json(branch);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const branch = await Branch.create(req.body);
    res.status(201).json(branch);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) return res.status(404).json({ message: 'Not found' });
    res.json(branch);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
}; 
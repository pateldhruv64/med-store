// Dummy in-memory notifications
let notifications = [
  { id: 1, message: 'Paracetamol is expiring soon.' },
  { id: 2, message: 'Low stock: Amoxicillin.' },
];

exports.getAll = (req, res) => {
  res.json(notifications);
};

exports.create = (req, res) => {
  const { message } = req.body;
  const notif = { id: Date.now(), message };
  notifications.push(notif);
  res.status(201).json(notif);
}; 
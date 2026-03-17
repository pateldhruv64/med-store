const Medicine = require('../models/Medicine');
const Sale = require('../models/Sale');
const PDFDocument = require('pdfkit');

exports.stockReport = async (req, res, next) => {
  try {
    const stock = await Medicine.find();
    res.json(stock);
  } catch (err) { next(err); }
};

exports.salesReport = async (req, res, next) => {
  try {
    const sales = await Sale.find().populate('medicine').populate('staff', 'username');
    res.json(sales);
  } catch (err) { next(err); }
};

exports.salesPdf = async (req, res, next) => {
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
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="sales-report.pdf"');
    doc.pipe(res);

    doc.fontSize(18).text('Sales Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);

    // Table header
    const startY = doc.y + 10;
    const rowHeight = 20;
    let y = startY;
    const cols = [
      { label: 'Medicine', x: 30, width: 90 },
      { label: 'Qty', x: 120, width: 40 },
      { label: 'Price', x: 160, width: 60 },
      { label: 'Total', x: 220, width: 70 },
      { label: 'Profit', x: 290, width: 70 },
      { label: 'Date', x: 360, width: 80 },
      { label: 'Staff', x: 440, width: 80 },
    ];
    cols.forEach(col => doc.text(col.label, col.x, y, { width: col.width, align: 'left' }));
    y += rowHeight;
    doc.moveTo(30, y - 5).lineTo(550, y - 5).stroke();

    // Table rows
    let totalProfit = 0;
    sales.forEach(s => {
      const d = new Date(s.date);
      const dateStr = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth()+1).padStart(2, '0')}-${d.getFullYear()}`;
      const profit = (s.price - (s.medicine?.purchasePrice || 0)) * s.quantity;
      totalProfit += profit;
      const row = [
        s.medicine?.name || '',
        s.quantity,
        '₹' + s.price,
        '₹' + (s.quantity * s.price),
        '₹' + profit,
        dateStr,
        s.staff?.username || '',
      ];
      cols.forEach((col, i) => doc.text(row[i], col.x, y, { width: col.width, align: 'left' }));
      y += rowHeight;
      if (y > 750) { doc.addPage(); y = 50; }
    });
    // Total profit row
    doc.font('Helvetica-Bold').text('Total Profit:', 290, y, { width: 70, align: 'left' });
    doc.text('₹' + totalProfit, 360, y, { width: 80, align: 'left' });
    doc.font('Helvetica');
    doc.end();
  } catch (err) { next(err); }
};

exports.expiryReport = async (req, res, next) => {
  try {
    const soon = new Date();
    soon.setDate(soon.getDate() + 60);
    const expiring = await Medicine.find({ expiry: { $lte: soon } });
    res.json(expiring);
  } catch (err) { next(err); }
};

exports.lowStockReport = async (req, res, next) => {
  try {
    const low = await Medicine.find({ $expr: { $lte: ["$quantity", "$lowStockThreshold"] } });
    res.json(low);
  } catch (err) { next(err); }
};

exports.fullPdf = async (req, res, next) => {
  try {
    const { from, to } = req.query;
    // Fetch all reports
    const [stock, sales, expiry, lowStock] = await Promise.all([
      Medicine.find(),
      (() => {
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
        return Sale.find(query).populate('medicine').populate('staff', 'username');
      })(),
      (() => {
        const soon = new Date();
        soon.setDate(soon.getDate() + 60);
        return Medicine.find({ expiry: { $lte: soon } });
      })(),
      Medicine.find({ $expr: { $lte: ["$quantity", "$lowStockThreshold"] } }),
    ]);
    const doc = new PDFDocument({ margin: 30, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="full-report.pdf"');
    doc.pipe(res);

    // Title
    doc.fontSize(20).text('Pharmacy Inventory Full Report', { align: 'center' });
    doc.moveDown(2);

    // --- Stock Report ---
    doc.fontSize(16).text('Stock Report', { underline: true });
    doc.moveDown(0.5);
    let y = doc.y;
    doc.fontSize(12);
    doc.text('Name', 30, y, { width: 120 });
    doc.text('Qty', 160, y, { width: 60 });
    y += 18;
    doc.moveTo(30, y - 5).lineTo(220, y - 5).stroke();
    stock.forEach(s => {
      doc.text(s.name, 30, y, { width: 120 });
      doc.text(s.quantity, 160, y, { width: 60 });
      y += 16;
      if (y > 750) { doc.addPage(); y = 50; }
    });

    doc.addPage();

    // --- Sales Report ---
    doc.fontSize(16).text('Sales Report', { underline: true });
    doc.moveDown(0.5);
    y = doc.y;
    doc.fontSize(12);
    const salesCols = [
      { label: 'Medicine', x: 30, width: 90 },
      { label: 'Qty', x: 120, width: 40 },
      { label: 'Price', x: 160, width: 60 },
      { label: 'Total', x: 220, width: 70 },
      { label: 'Profit', x: 290, width: 70 },
      { label: 'Date', x: 360, width: 80 },
      { label: 'Staff', x: 440, width: 80 },
    ];
    salesCols.forEach(col => doc.text(col.label, col.x, y, { width: col.width, align: 'left' }));
    y += 18;
    doc.moveTo(30, y - 5).lineTo(550, y - 5).stroke();
    let totalProfit = 0;
    sales.forEach(s => {
      const d = new Date(s.date);
      const dateStr = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth()+1).padStart(2, '0')}-${d.getFullYear()}`;
      const profit = (s.price - (s.medicine?.purchasePrice || 0)) * s.quantity;
      totalProfit += profit;
      const row = [
        s.medicine?.name || '',
        s.quantity,
        '₹' + s.price,
        '₹' + (s.quantity * s.price),
        '₹' + profit,
        dateStr,
        s.staff?.username || '',
      ];
      salesCols.forEach((col, i) => doc.text(row[i], col.x, y, { width: col.width, align: 'left' }));
      y += 16;
      if (y > 750) { doc.addPage(); y = 50; }
    });
    // Total profit row
    doc.font('Helvetica-Bold').text('Total Profit:', 290, y, { width: 70, align: 'left' });
    doc.text('₹' + totalProfit, 360, y, { width: 80, align: 'left' });
    doc.font('Helvetica');
    doc.addPage();

    // --- Expiry Report ---
    doc.fontSize(16).text('Expiry Report', { underline: true });
    doc.moveDown(0.5);
    y = doc.y;
    doc.fontSize(12);
    doc.text('Name', 30, y, { width: 120 });
    doc.text('Expiry', 160, y, { width: 100 });
    y += 18;
    doc.moveTo(30, y - 5).lineTo(260, y - 5).stroke();
    expiry.forEach(e => {
      const d = new Date(e.expiry);
      const dateStr = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth()+1).padStart(2, '0')}-${d.getFullYear()}`;
      doc.text(e.name, 30, y, { width: 120 });
      doc.text(dateStr, 160, y, { width: 100 });
      y += 16;
      if (y > 750) { doc.addPage(); y = 50; }
    });

    doc.addPage();

    // --- Low Stock Report ---
    doc.fontSize(16).text('Low Stock Report', { underline: true });
    doc.moveDown(0.5);
    y = doc.y;
    doc.fontSize(12);
    doc.text('Name', 30, y, { width: 120 });
    doc.text('Qty', 160, y, { width: 60 });
    y += 18;
    doc.moveTo(30, y - 5).lineTo(220, y - 5).stroke();
    lowStock.forEach(l => {
      doc.text(l.name, 30, y, { width: 120 });
      doc.text(l.quantity, 160, y, { width: 60 });
      y += 16;
      if (y > 750) { doc.addPage(); y = 50; }
    });

    doc.end();
  } catch (err) { next(err); }
}; 
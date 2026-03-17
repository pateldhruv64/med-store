// Dummy PDF export utility
function exportReport(data, type) {
  // In real app, use pdfkit or similar
  return Buffer.from(`PDF Report: ${type}\n${JSON.stringify(data)}`);
}

module.exports = { exportReport }; 
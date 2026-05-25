const { parseOCRLines } = require('../utils/ocrParser');

describe('OCR Parser', () => {
  it('should parse shop name from first line', () => {
    const lines = ['Sharma General Store', 'Date: 15/05/2024', 'Rice  x2  50.00'];
    const result = parseOCRLines(lines);
    expect(result.shopName).toBe('Sharma General Store');
  });

  it('should extract date from lines', () => {
    const lines = ['My Shop', '12/06/2024', 'Sugar x1 40.00'];
    const result = parseOCRLines(lines);
    expect(result.date).toBe('12/06/2024');
  });

  it('should parse line items correctly', () => {
    const lines = ['Shop', 'Rice  2  50.00', 'Sugar  1  40.00'];
    const result = parseOCRLines(lines);
    expect(result.items).toHaveLength(2);
    expect(result.items[0].productName).toBe('Rice');
    expect(result.items[0].quantity).toBe(2);
    expect(result.items[0].unitPrice).toBe(50);
    expect(result.items[0].total).toBe(100);
  });

  it('should return empty items for unrecognizable text', () => {
    const lines = ['random text', 'no items here'];
    const result = parseOCRLines(lines);
    expect(result.items).toHaveLength(0);
  });
});

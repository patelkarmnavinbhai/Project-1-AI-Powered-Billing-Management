const Tesseract = require('tesseract.js');
const { parseOCRLines } = require('../utils/ocrParser');

/**
 * Extract raw text from an image using Tesseract OCR
 * @param {string} imagePath - Path to the preprocessed image
 * @returns {string} Raw extracted text
 */
const extractTextFromImage = async (imagePath) => {
  const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
    logger: () => {}, // suppress progress logs
  });
  return text.trim();
};

/**
 * Parse raw OCR text into structured bill data
 * @param {string} rawText - Raw text from OCR
 * @returns {object} Parsed bill object with shopName, date, items[]
 */
const parseOCRText = (rawText) => {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  return parseOCRLines(lines);
};

module.exports = { extractTextFromImage, parseOCRText };

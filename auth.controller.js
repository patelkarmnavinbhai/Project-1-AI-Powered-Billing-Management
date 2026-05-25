const path = require('path');
const fs = require('fs');
const { preprocessImage } = require('../services/imageProcessor.service');
const { extractTextFromImage, parseOCRText } = require('../services/ocr.service');
const { successResponse, errorResponse } = require('../utils/responseHelper');

// @desc    Scan an uploaded bill image with OCR
// @route   POST /api/ocr/scan
const scanBill = async (req, res) => {
  if (!req.file) return errorResponse(res, 'No image file uploaded', 400);

  const originalPath = req.file.path;
  const processedPath = originalPath.replace(/(\.[\w]+)$/, '-processed$1');

  try {
    // Step 1: Preprocess image (enhance quality)
    await preprocessImage(originalPath, processedPath);

    // Step 2: Run OCR
    const rawText = await extractTextFromImage(processedPath);

    // Step 3: Parse structured data from raw text
    const parsedData = parseOCRText(rawText);

    // Cleanup processed image
    if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);

    return successResponse(res, {
      rawText,
      parsed: parsedData,
      imagePath: originalPath,
    }, 'Bill scanned successfully');
  } catch (err) {
    // Cleanup on error
    if (fs.existsSync(processedPath)) fs.unlinkSync(processedPath);
    return errorResponse(res, `OCR failed: ${err.message}`, 500);
  }
};

module.exports = { scanBill };

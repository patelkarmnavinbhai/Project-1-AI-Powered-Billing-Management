const sharp = require('sharp');

/**
 * Preprocess bill image for better OCR accuracy
 * - Convert to grayscale
 * - Increase contrast
 * - Sharpen edges
 * - Normalize brightness
 * @param {string} inputPath
 * @param {string} outputPath
 */
const preprocessImage = async (inputPath, outputPath) => {
  await sharp(inputPath)
    .grayscale()                          // Remove color noise
    .normalise()                          // Auto-normalize brightness/contrast
    .sharpen({ sigma: 1.5 })             // Sharpen text edges
    .threshold(128)                       // Binarize for clean black/white
    .png()
    .toFile(outputPath);
};

module.exports = { preprocessImage };

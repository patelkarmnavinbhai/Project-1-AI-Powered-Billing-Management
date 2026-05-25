const twilio = require('twilio');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/**
 * Send invoice details via WhatsApp using Twilio
 * Innovation Zone Feature
 * @param {string} toPhone - Customer's phone number (e.g. "+919876543210")
 * @param {object} bill - Finalized bill document
 * @param {object} user - Shop owner (sender info)
 */
const sendInvoiceWhatsApp = async (toPhone, bill, user) => {
  const itemLines = bill.items
    .map(i => `• ${i.productName} x${i.quantity} = ₹${i.total.toFixed(2)}`)
    .join('\n');

  const message = `
🧾 *Invoice from ${user.shopName}*
Bill No: ${bill.billNumber}
Date: ${new Date(bill.createdAt).toLocaleDateString('en-IN')}

*Items:*
${itemLines}

──────────────
Subtotal: ₹${bill.subtotal.toFixed(2)}
${bill.taxAmount > 0 ? `Tax: ₹${bill.taxAmount.toFixed(2)}` : ''}
${bill.discount > 0 ? `Discount: -₹${bill.discount.toFixed(2)}` : ''}
*Total: ₹${bill.totalAmount.toFixed(2)}*

Payment: ${bill.paymentMethod.toUpperCase()}
Thank you for shopping with us! 🙏
  `.trim();

  await client.messages.create({
    from: process.env.TWILIO_WHATSAPP_FROM,
    to: `whatsapp:${toPhone}`,
    body: message,
  });

  return { sent: true, to: toPhone };
};

module.exports = { sendInvoiceWhatsApp };

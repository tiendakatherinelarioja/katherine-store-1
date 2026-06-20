import { supabase } from './supabaseClient';

/**
 * Sends an email notification using the Supabase Edge Function 'send-email'.
 * 
 * @param {Object} params - The parameters for the email
 * @param {string|string[]} params.to - Recipient email address(es)
 * @param {string} params.subject - Subject line of the email
 * @param {string} params.html - HTML content of the email
 * @returns {Promise<{success: boolean, error?: string, data?: any}>}
 */
export async function sendEmailNotification({ to, subject, html }) {
  try {
    if (!to) {
      console.warn('sendEmailNotification: No recipient email specified.');
      return { success: false, error: 'No recipient email specified.' };
    }

    const { data, error } = await supabase.functions.invoke('send-email', {
      body: { to, subject, html }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (err) {
    console.error('Error invoking send-email Edge Function:', err);
    return { success: false, error: err.message || err };
  }
}

/**
 * Formats a clean HTML email template for order receipts.
 * 
 * @param {Object} order - The order object
 * @returns {string} - The HTML template
 */
export function formatOrderEmailHtml(order) {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px;">
      <h2 style="color: #111827; border-bottom: 2px solid #e5e7eb; padding-bottom: 12px;">Detalle del Pedido</h2>
      <p>Hola, <strong>${order.cliente}</strong>. Tu pedido ha sido registrado con éxito.</p>
      
      <div style="background-color: #f9fafb; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 4px 0;"><strong>ID de Orden:</strong> #${order.id.slice(-6)}</p>
        <p style="margin: 4px 0;"><strong>Estado actual del pedido:</strong> <span style="text-transform: uppercase; font-weight: bold; color: #16a34a;">${order.estado}</span></p>
        <p style="margin: 4px 0;"><strong>Teléfono:</strong> ${order.telefono}</p>
        <p style="margin: 4px 0;"><strong>Método de Envío:</strong> ${order.metodoEnvio === 'envio' ? 'Envío a Domicilio' : 'Retiro en Local'}</p>
        <p style="margin: 4px 0;"><strong>Dirección:</strong> ${order.direccion}</p>
        <p style="margin: 4px 0;"><strong>Método de Pago:</strong> ${order.metodoPago.toUpperCase()}</p>
        ${order.couponApplied ? `<p style="margin: 4px 0; color: #7c3aed;"><strong>Cupón Aplicado:</strong> ${order.couponApplied.codigo} (-$${order.couponApplied.discountAmount.toFixed(2)})</p>` : ''}
      </div>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="background-color: #f3f4f6;">
            <th style="padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; color: #4b5563;">Producto</th>
            <th style="padding: 10px; text-align: center; font-size: 12px; text-transform: uppercase; color: #4b5563;">Cant.</th>
            <th style="padding: 10px; text-align: right; font-size: 12px; text-transform: uppercase; color: #4b5563;">Unitario</th>
            <th style="padding: 10px; text-align: right; font-size: 12px; text-transform: uppercase; color: #4b5563;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: right; margin-top: 20px; font-size: 18px; font-weight: bold; color: #16a34a;">
        Total: $${order.total.toFixed(2)}
      </div>

      <p style="font-size: 11px; color: #9ca3af; text-align: center; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
        Este es un correo automático enviado por Katherine Store. Para coordinar el pago o la entrega, responda a este correo o póngase en contacto vía WhatsApp.
      </p>
    </div>
  `;
}

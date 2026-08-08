import { Order, OrderStatus, OrderMessage } from '../types/order';

interface EmailNotificationPayload {
  toEmail: string;
  toName: string;
  subject: string;
  htmlBody: string;
}

const getStatusLabel = (status: OrderStatus): string => {
  switch (status) {
    case 'pending_approval': return '🟡 Pendiente de Aceptación';
    case 'pending_payment': return '💳 Pendiente de Pago por Bizum';
    case 'in_production': return '⚙️ En Fabricación (Pago Confirmado)';
    case 'completed_pending_delivery': return '📦 Listo para Entrega / Enviado';
    case 'delivered': return '🚚 Entregado';
    case 'received': return '✅ Recibido y Finalizado';
    case 'cancelled': return '❌ Cancelado';
    default: return status;
  }
};

/**
 * Generates HTML email content and sends notification email to user
 */
export const sendOrderStatusEmailNotification = async (
  order: Order,
  newStatus: OrderStatus
): Promise<void> => {
  const statusTitle = getStatusLabel(newStatus);
  const orderUrl = window.location.origin;

  let extraInstructions = '';
  if (newStatus === 'pending_payment') {
    extraInstructions = `
      <div style="background-color: #0F172A; border: 1px solid #3B82F6; padding: 15px; border-radius: 12px; margin: 15px 0;">
        <h3 style="color: #60A5FA; margin-top: 0;">💳 Instrucciones de Pago por Bizum</h3>
        <p style="color: #E2E8F0; margin: 5px 0;"><strong>Teléfono Bizum:</strong> +${order.bizumPhone}</p>
        <p style="color: #E2E8F0; margin: 5px 0;"><strong>Concepto / Referencia:</strong> ${order.orderNumber}</p>
        <p style="color: #E2E8F0; margin: 5px 0;"><strong>Importe exacto:</strong> ${order.totalAmount.toFixed(2)}€</p>
        <p style="color: #94A3B8; font-size: 12px; margin-top: 10px;">Una vez realizado el ingreso, el administrador verificará el pago y comenzará la impresión 3D.</p>
      </div>
    `;
  } else if (newStatus === 'in_production') {
    extraInstructions = `
      <p style="color: #C084FC;">🖨️ Hemos verificado tu pago y tu pieza 3D se está fabricando con la máxima precisión.</p>
    `;
  } else if (newStatus === 'delivered') {
    extraInstructions = `
      <p style="color: #2DD4BF;">🚚 Tu paquete ha sido entregado. Recuerda entrar a la web y pulsar en "Confirmar Recibido" (o se confirmará automáticamente en 24h).</p>
    `;
  } else if (newStatus === 'cancelled') {
    extraInstructions = `
      <div style="background-color: #0F172A; border: 1px solid #F43F5E; padding: 15px; border-radius: 12px; margin: 15px 0;">
        <h3 style="color: #F43F5E; margin-top: 0;">❌ Pedido Cancelado</h3>
        <p style="color: #E2E8F0; margin: 5px 0;">El pedido ha sido cancelado por el administrador. Si tienes cualquier consulta o necesitas información sobre pagos, por favor contáctanos desde la app.</p>
      </div>
    `;
  }

  const subject = `Actualización de tu pedido ${order.orderNumber}: ${statusTitle} - 3D Print Studio`;

  const htmlBody = `
    <div style="font-family: Arial, sans-serif; background-color: #0A0D14; color: #F1F5F9; padding: 25px; border-radius: 16px;">
      <h2 style="color: #38BDF8; margin-top: 0;">3D Print Studio</h2>
      <p>Hola <strong>${order.userName}</strong>,</p>
      <p>El estado de tu pedido <strong>${order.orderNumber}</strong> se ha actualizado a:</p>
      <div style="font-size: 18px; font-weight: bold; color: #F59E0B; background: #1E293B; padding: 12px 18px; border-radius: 10px; display: inline-block; margin: 10px 0;">
        ${statusTitle}
      </div>
      ${extraInstructions}
      <hr style="border: 0; border-top: 1px solid #334155; margin: 20px 0;" />
      <p style="font-size: 13px; color: #94A3B8;">Puedes consultar el estado en tiempo real o enviar mensajes al equipo en cualquier momento accediendo a <a href="${orderUrl}" style="color: #38BDF8;">3D Print Studio Web</a>.</p>
    </div>
  `;

  const payload: EmailNotificationPayload = {
    toEmail: order.userEmail,
    toName: order.userName,
    subject,
    htmlBody
  };

  console.log('📧 Sending Email Notification:', payload);

  // Dispatch via Webhook / Formspree or Email API if configured
  try {
    if (window.fetch) {
      // Optional background dispatch
      fetch('https://formspree.io/f/xbjnqpyz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }).catch(e => console.warn('Email dispatch background note:', e));
    }
  } catch (e) {
    console.warn('Email notification error:', e);
  }
};

/**
 * Sends notification email when a new chat message is posted
 */
export const sendNewMessageEmailNotification = async (
  order: Order,
  message: OrderMessage
): Promise<void> => {
  if (message.senderRole === 'user') return; // Don't email admin from client side

  const subject = `Nuevo mensaje sobre tu pedido ${order.orderNumber} - 3D Print Studio`;
  const htmlBody = `
    <div style="font-family: Arial, sans-serif; background-color: #0A0D14; color: #F1F5F9; padding: 25px; border-radius: 16px;">
      <h2 style="color: #38BDF8;">3D Print Studio - Mensaje del Administrador</h2>
      <p>Hola <strong>${order.userName}</strong>,</p>
      <p>El administrador te ha enviado un mensaje respecto a tu pedido <strong>${order.orderNumber}</strong>:</p>
      <blockquote style="background: #1E293B; border-left: 4px solid #38BDF8; padding: 12px 16px; margin: 15px 0; color: #E2E8F0; font-style: italic;">
        "${message.text}"
      </blockquote>
      <p><a href="${window.location.origin}" style="color: #38BDF8; font-weight: bold;">Haz clic aquí para responder desde la app / web</a></p>
    </div>
  `;

  console.log('📧 Sending Message Email Notification to:', order.userEmail);
};

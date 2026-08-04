import { Product, ProductColor, getProductSku } from '../types/product';

export const buildWhatsAppProductUrl = (
  whatsappNumber: string,
  product: Product,
  selectedColor?: ProductColor,
  customNotes?: string
): string => {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const productSku = getProductSku(product);
  
  const colorText = selectedColor ? `Color deseado: ${selectedColor.name}\n` : '';
  const notesText = customNotes && customNotes.trim() ? `Detalles / Personalización: ${customNotes.trim()}\n` : '';

  const message = `¡Hola! 👋 Vi tu tienda *3D Print Studio* y estoy interesado en pedir el siguiente producto:

🆔 *Ref / ID Producto:* ${productSku}
📌 *Producto:* ${product.name}
💰 *Precio:* ${product.price.toFixed(2)}€
⏱️ *Tiempo estimado:* ${product.printTime}
${colorText}${notesText}
¿Podrías indicarme cómo proceder con la confirmación y el envío? ¡Muchas gracias!`;

  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
};

export const buildWhatsAppGeneralUrl = (whatsappNumber: string, customMessage?: string): string => {
  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const text = customMessage || '¡Hola! 👋 Quisiera hacer una consulta o pedir un producto personalizado en 3D Print Studio.';
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(text)}`;
};

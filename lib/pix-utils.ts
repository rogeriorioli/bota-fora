/**
 * Calculates CRC16 CCITT (0xFFFF) for PIX Payload
 */
function calculateCRC16(payload: string): string {
  let crc = 0xFFFF;
  const polynomial = 0x1021;

  for (let i = 0; i < payload.length; i++) {
    const b = payload.charCodeAt(i);
    for (let j = 0; j < 8; j++) {
      const bit = ((b >> (7 - j)) & 1) === 1;
      const c15 = ((crc >> 15) & 1) === 1;
      crc <<= 1;
      if (c15 !== bit) crc ^= polynomial;
    }
  }

  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

/**
 * Formats a PIX field with ID and length
 */
function formatField(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0');
  return `${id}${len}${value}`;
}

interface PixOptions {
  key: string;
  name: string;
  city: string;
  amount?: number;
  transactionId?: string;
}

/**
 * Generates a dynamic PIX Copy and Paste (EMV QRCPS)
 */
export function generatePixPayload({
  key,
  name,
  city,
  amount,
  transactionId = '***',
}: PixOptions): string {
  const payloadFormatIndicator = formatField('00', '01');
  
  const merchantAccountInfo = formatField('26', 
    formatField('00', 'br.gov.bcb.pix') + 
    formatField('01', key)
  );

  const merchantCategoryCode = formatField('52', '0000');
  const transactionCurrency = formatField('53', '986'); // BRL
  
  let amountField = '';
  if (amount && amount > 0) {
    amountField = formatField('54', amount.toFixed(2));
  }

  const countryCode = formatField('58', 'BR');
  const merchantName = formatField('59', name.substring(0, 25)); // Max 25 chars
  const merchantCity = formatField('60', city.substring(0, 15)); // Max 15 chars
  
  const additionalData = formatField('62', 
    formatField('05', transactionId.substring(0, 25))
  );

  const payload = [
    payloadFormatIndicator,
    merchantAccountInfo,
    merchantCategoryCode,
    transactionCurrency,
    amountField,
    countryCode,
    merchantName,
    merchantCity,
    additionalData,
    '6304' // CRC prefix
  ].join('');

  return payload + calculateCRC16(payload);
}

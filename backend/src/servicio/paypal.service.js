const { paypalConfig } = require('../config/paypal.config');

// Función para obtener el token de acceso de PayPal usando las credenciales del cliente.
function getBasicAuth(){
    return Buffer.from(`${paypalConfig.clientId}:${paypalConfig.clientSecret}`).toString('base64');
}
async function getAccessToken(){
    const response = await fetch(`${paypalConfig.baseUrl}/v1/oauth2/token`, { //FORMA DE URL PARA OBTENER TOKEN DE PAY
        method: 'POST',
        headers: {
            'Authorization': `Basic ${getBasicAuth()}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
    });
    const data = await response.json(); //guardar respuesta en formato JSON
    if(!response.ok){
        throw new Error(`Error obtenido access token: ${JSON.stringify(data)}`);
    }
    return data.access_token;
}

async function createPaypalOrder(orderData) {
  const accessToken = await getAccessToken();

  const body = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'MXN',
          value: Number(orderData.total).toFixed(2),
          breakdown: {
            item_total: {
              currency_code: 'MXN',
              value: Number(orderData.total).toFixed(2)
            }
          }
        },
        items: orderData.items.map(item => ({
          name: item.nombre,
          quantity: String(item.cantidad),
          unit_amount: {
            currency_code: 'MXN',
            value: Number(item.precio).toFixed(2)
          }
        }))
      }
    ]
  };

  const response = await fetch(`${paypalConfig.baseUrl}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(body)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error creando orden PayPal: ${JSON.stringify(data)}`);
  }

  return data;
}

async function capturePaypalOrder(orderId) {
  const accessToken = await getAccessToken();

  const response = await fetch(
    `${paypalConfig.baseUrl}/v2/checkout/orders/${orderId}/capture`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Error capturando orden PayPal: ${JSON.stringify(data)}`);
  }

  return data;
}

module.exports = { getAccessToken, createPaypalOrder, capturePaypalOrder };
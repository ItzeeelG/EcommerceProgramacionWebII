const paypalConfig = {
    clientId: process.env.PAYPAL_CLIENT_ID,
    clientSecret: process.env.PAYPAL_CLIENT_SECRET,
    baseUrl: process.env.PAYPAL_BASE_URL
};
console.log('PayPal config:', paypalConfig);
module.exports = { paypalConfig };

//leer variables del entorno y guardar en un objeto de configuración para PayPal.
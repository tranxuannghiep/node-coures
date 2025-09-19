
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: 'nghiepradeon@gmail.com',
        pass: 'mmbfepeyqzgawrhy'
    }
})

module.exports = transport;
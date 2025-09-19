const { NotFoundError } = require("../core/error.response")
const transport = require("../dbs/init.nodemailer")
const { newOtp } = require("./otp.service")
const { getTemplate } = require("./template.service")

const replacePlaceholder = (template, params) => {
    Object.keys(params).forEach(key => {
        const placeholder = `{{${key}}}`;
        template = template.replace(new RegExp(placeholder, 'g'), params[key]);
    })

    return template
}

const sendEmailLinkVerify = async ({ html, toEmail = null, subject = 'Xác nhận Email đăng ký', text = 'Xác nhận' }) => {
    try {
        const mailOptions = {
            from: ' "ShopDEV" <nghiepradeon@gmail.com>',
            to: toEmail,
            subject: subject,
            text: text,
            html: html
        }

        transport.sendMail(mailOptions, (err, info) => {
            if (err) {
                throw err
            }

            console.log('Message sent: %s', info.messageId);


        })
    } catch (error) {
        console.log('Error: ', error);
    }
}


const sendEmailToken = async ({ email = null }) => {
    try {
        // 1. get token
        const token = await newOtp({ email })

        // 2. get Template
        const template = await getTemplate({
            tem_name: 'HTML EMAIL TOKEN'
        })

        if (!template) {
            throw new NotFoundError('Template not found')
        }

        // 3. replace placeholder

        const content = replacePlaceholder(template.tem_html, {
            link_verify: `http://localhost:3000/verify-email?token=${token.otp_token}`,
        })



        // 4. Send email
        sendEmailLinkVerify({
            html: content,
            toEmail: email,
        })

    } catch (error) {
        console.log(error);

    }
}

module.exports = {
    sendEmailToken
}
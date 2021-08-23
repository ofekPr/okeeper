import dotenv from 'dotenv'
dotenv.config()
import authy from ''

const sendSMSAuth = (userPhoneAreaCode, userphoneNumber) => {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    const client = authy(accountSid, authToken);

    client.messages
    .create({
        body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
        from: '+14014846279',
        to: `+${userPhoneAreaCode}${userphoneNumber}`
    })
}

export default sendSMSAuth
import nodemailer from 'nodemailer';
import mailConfig from '../config/mail';

class Mail{

    constructor(){
        const { host, port, secure, auth } = mailConfig

        this.tranporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: auth ? auth : null,
        })
    }

    sendMail(message){
        return this.tranporter.sendMail({
            ... mailConfig,
            ... message,
        });
    }

}

export default new Mail();
import nodemailer from 'nodemailer';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';

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

        this.configureTemplates();
    }

    configureTemplates(){
        const viewPath = resolve( __dirname,'..','app','views', 'emails');

        this.tranporter.use('compile', nodemailerhbs({
            viewEngine:exphbs.create({
                layoutsDir: resolve(viewPath, 'layouts'),
                partialDir: resolve(viewPath, 'partials'),
                defaultLayout: 'default',
                extname: '.hbs'
            }),
            viewPath,
            extname: '.hbs'
        }))
    }

    sendMail(message){
        return this.tranporter.sendMail({
            ... mailConfig,
            ... message,
        });
    }

}

export default new Mail();
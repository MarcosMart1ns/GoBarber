import 'dotenv/config'

import express from 'express';
import 'express-async-errors';
import routes from './routes';
import path from 'path'
import Youch from 'youch'
import * as Sentry from '@sentry/node'

import './database'
import sentryConfig from './config/sentry'

class App{

    constructor(){
        this.server = express();

        Sentry.init(sentryConfig);

        this.middleware();
        this.routes();
        this.exceptionHandler();
    }
    
    middleware(){
        this.server.use(Sentry.Handlers.requestHandler());
        this.server.use(express.json());
        this.server.use(
            '/files', 
            express.static(
                path.resolve(__dirname, '..','tmp','uploads')
            )
        )
    }

    routes(){
        this.server.use(routes);
        this.server.use(Sentry.Handlers.requestHandler());
    }

    exceptionHandler(){
        if(process.env.NODE_ENV == 'development'){
            this.server.use( async (err, req,res,next) => {
                const errors = await new Youch(err,req).toJSON;
                return res.status(500).json(erros);
            })
        }

        return res.status(500).json({Erro: 'Internal Server Error'});
    }
}

export default new App().server;
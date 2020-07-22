import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import databaseConfig from '../config/database';
import User from '../app/models/User';
import Files from '../app/models/Files';
import Appointment from '../app/models/Appointments'

const models = [User,Files,Appointment];

class Database {
    constructor(){
        this.init();
        this.mongo();
    }

    init(){
       
        this.connection = new Sequelize(databaseConfig); //conexão com a database
        models.map(model=> model.init(this.connection)) //percorre o s modelos e inicia os
        models.map(model=> model.associate && model.associate(this.connection.models));
        
    }

    mongo(){
        this.connection = mongoose.connect(
            process.env.MONGO_URL,
            {
                useNewUrlParser: true,
                useFindAndModify: true,
                useUnifiedTopology: true
            }
        )
    }
}

export default new Database();
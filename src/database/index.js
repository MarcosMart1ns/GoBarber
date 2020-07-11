import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/User';
import Files from '../app/models/Files';

const models = [User,Files];

class Database {
    constructor(){
        this.init();
    }

    init(){
       
        this.connection = new Sequelize(databaseConfig); //conexão com a database
        models.map(model=> model.init(this.connection)) //percorre o s modelos e inicia os
        models.map(model=> model.associate && model.associate(this.connection.models));
        
    }
}

export default new Database();
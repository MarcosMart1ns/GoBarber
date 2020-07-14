import { startOfDay, endOfDay,parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointments from "../models/Appointments";
import Appointments from '../models/Appointments'
import User from '../models/User'


class ScheduleController{
    async index(req, res){
        const checkUser = await User.findOne({
            where:{
                id: req.userId,
                provider: 1
            }
        })
 
        if(!checkUser){
            return res.status(401).json({erro: "O usuário não é prestador de serviços"});
        }

        const { date } = req.query;

        const startDay = startOfDay(parseISO(date));
        const endDay = endOfDay(parseISO(date));

        
        const appointments = await Appointments.findAll({
            where: {
                date:{
                    [Op.between]:[startDay , endDay],
                }
            }
        })

        return res.json(appointments);
    }
}   

export default new ScheduleController();
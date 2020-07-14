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

        const {date} = req.query;
        
        const appointments = await Appointments.findAll({
            where: {
                date,
            }
        })

        return res.json(appointments);
    }
}

export default new ScheduleController();
import User from '../models/User'
import Appointment from '../models/Appointments'
import * as Yup from 'yup'

class AppointmentController{
    async store(req, res){
        const schema = Yup.object().shape({
            provider_id: Yup.string().required(),
            date: Yup.date().required(),
        });

        if(  !(await schema.isValid(req.body))){
            return res.status(400).json({
                message: "Erro na validação, deve ser enviado data e provider id",
            })
        }

        const { date, provider_id } = req.body;

        const IsProvider = await User.findOne({
            where:{
                id: provider_id,
                provider: 1,
            }
        })

        if( !IsProvider ){
            return res.status(400).json({ erro: "Apenas é possível criar agendamento com um provedor, insira um provedor de serviços"})
        }


        const appointment = await Appointment.create({
            user_id: req.userId,
            date,
            provider_id,
        })

        return res.status(200).json(appointment);
    }
}

export default new AppointmentController();
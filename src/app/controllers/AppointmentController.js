import User from '../models/User'
import Appointments from '../models/Appointments'
import * as Yup from 'yup'
import { parseISO, startOfHour, isBefore } from 'date-fns';

class AppointmentController{
    async index(req,res){
        const appointments = await Appointments.findAll({
            where: {
                user_id: req.userId,
                canceled_at: null,
            },
            order:['date'],
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id','name']
                }
            ]
        });

        return res.json(appointments);
    }

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

        const hourStart = startOfHour(parseISO(date));

        if(isBefore(hourStart,new Date())){
            return res.status(400).json({error: 'Insira uma data posterior a atual'});
        }

        const checkAvaliability = await Appointments.findOne({
            where:{
                provider_id,
                canceled_at: null,
                date: hourStart
            }
        })

        if(checkAvaliability){
            return res.status(400).json({
                error: "Data e hora de agendamento não disponível"
            })
        }

        const appointment = await Appointments.create({
            user_id: req.userId,
            date,
            provider_id,
        })

        return res.status(200).json(appointment);
    }
}

export default new AppointmentController();
import * as Yup from 'yup'
import { parseISO, startOfHour, isBefore, format,subHours } from 'date-fns';

import User from '../models/User'
import File from '../models/Files'
import Appointments from '../models/Appointments'
import Notifications from '../schemas/Notifications'

class AppointmentController{
    async index(req,res){
        const { page = 1 } = req.query

        const appointments = await Appointments.findAll({
            where: {
                user_id: req.userId,
                canceled_at: null,
            },
            order:['date'],
            attributes:['id','date'],
            limit: 20,
            offset: (page-1)*20,
            include: [
                {
                    model: User,
                    as: 'provider',
                    attributes: ['id','name'],
                    include: [ 
                        {
                            model: File,
                            as: 'avatar',
                            attributes: ['id','path','url'],
                        },
                    ],
                }
            ]
        });

        return res.status(200).json(appointments);
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

        const user = await User.findByPk(req.userId);
        const formatedDate = format(
            hourStart,
            "'dia' dd 'de' MMMM 'de' yyyy 'ás' HH:mm'h' ",
            {
                timeZone: 'America/Sao_Paulo',
            }
        );

        await Notifications.create({
            content: `Novo agendamento de ${ user.name } para o ${ formatedDate }`,
            user: provider_id,
        })
        
        return res.status(200).json(appointment);
    }

    async delete(req,res){
        const appointments = await Appointments.findByPk(
            req.params.id
        )
        
        console.log("Usuario logado:"+req.userId);
        console.log("Usuario do agenda"+appointments.user_id)
        console.log(appointments)
        if(appointments.user_id != req.userId){
            return res.status(401).json({ error: 'Você não tem permissão para cancelar esse agendamento'})
        }

        const dateWithSub = subHours(appointments.date,2);

        if(isBefore(dateWithSub, new Date())){
            return res.status(401).json({erro: "Agendamentos apenas podem ser cancelados até 2h antes do agendado"})
        }

        appointments.canceled_at = new Date();

        await appointments.save();

        
        return res.json(appointments);
    }
   
}

export default new AppointmentController();
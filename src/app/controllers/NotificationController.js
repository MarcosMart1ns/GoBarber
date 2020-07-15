import Notifications from '../schemas/Notifications';
import User from '../models/User'

class NotificationController{
    async index(req, res ){
        const checkIsProvider = await User.findOne({
            where:{
                id: req.userId,
                provider: 1,
            }
        })

        if(!checkIsProvider){
            return res.status(400).json('Apenas provedores de serviços podem ter acesso as notificações')
        }

        const notifications = await Notifications.find({
            user: req.userId
        }).sort({createdAt: 'desc'}).limit(20)


        return res.json(notifications);
    }

    async update(req,res){
        const notification = await Notifications.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true},

        )

        return res.json(notification);
    }
}

export default new NotificationController();
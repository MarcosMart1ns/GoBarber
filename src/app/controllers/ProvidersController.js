import User from '../models/User';
import Files from '../models/Files';

class Providers{
    async index(req,res ){ 
        const providers = await User.findAll({
            where:{ provider: 1 },
            attributes: ['id', 'name','email'],
            include: [ {
                model: Files,
                as: 'avatar',
                attributes:['name','path','url']
            } ],
        })

        return res.status(200).json(providers);
    }
}

export default new Providers();
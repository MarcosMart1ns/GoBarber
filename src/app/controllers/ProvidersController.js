import User from '../models/User'

class Providers{
    async index(req,res ){ 
        const providers = User.findAll({
            where:{
                provider: true
            }
        })

        return res.status(200).json(providers);
    }
}

export default new Providers();
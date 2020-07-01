import { Router } from 'express';
import User from './app/models/User;'

const routes = new Router();

routes.get('/',(req,res)=>{

    return res.send({message:"funfou!!"});

})

routes.get('/insert',async (req,res)=>{

    const user = await User.create({
        name: 'Marcos Martins',
        email: 'marcos_36masdas@hotmail.com',
        password_hash: '928193uqjaisjd',
        provider: false
    })

    return res.send({user})
})



export default routes;



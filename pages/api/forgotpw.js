import {customerForgotPassword} from '../../utils/shopify'
export default async function handeler(req,res){
    if(req.method==="POST"){
        const {email}=req.body
        try{
            const result=await customerForgotPassword(email)
            return res.status(200).json({result})
        }catch(error){
            return res.status(400).json({message:error.message})
        }
    }else{
        res.setHeader("Allow",["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`)
    }
}
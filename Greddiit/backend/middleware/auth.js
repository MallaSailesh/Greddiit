import * as dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const auth = async(req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) {
            return res.status(401).send({ auth: false, message: 'No token provided.'});
        }
        // if (decodedDatat.exp < Date.now() / 1000) {
        //     return res.status(401).send({ auth: false, message: 'Token expired.' });
        // }
        
        const isCustomAuth = (token.length < 500) ; // checking if it is a google token or cusotm token
        let decodedData;

        if(token && isCustomAuth){
            decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.userId = decodedData?.id ;
            req.Email = decodedData?.Email;
            req.UserName = decodedData?.UserName;
        } else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.id;
            req.Email = decodedData?.Email;
            req.UserName = decodedData?.UserName ;
        }
        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth ;

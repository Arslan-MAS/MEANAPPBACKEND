const bcrypt = require("bcryptjs");
const User = require ("../models/user.model");
const jwt = require ("jsonwebtoken");

exports.createUser= (req,res,next)=>{
    bcrypt.hash(req.body.password,10).then(

        hash => {
           
            const user =new User(
                {
                    email :req.body.email
                    ,
                    password :hash
                }
            );
            user.save().then(result => {
                res.status(201).json({

                    message: "User Created!",
                    result : result
                });

            }).catch(
                err=> {
                    res.status(500).json({
                        
                            message :"Invalid Authentication Credentials"
                        
                    })
                }
            )


        }


    )
    
}
exports.Login =(req,res,next)=>{
    var loggedInUser ; 
    
    User.findOne({
        email:req.body.email
    }).then(
        user=>{
            
            if (!user){
                
                // console.log("NO USER");
                return res.status(401).json({
                    message:"Invalid Authentication Credentials"
                });
            }
            
            loggedInUser= user; 
            return bcrypt.compare(req.body.password,user.password);
        }
    ).then(
        result =>{
            
            if (loggedInUser== null ){
                return ;
            }
            if (!result ){
                return res.status (401).json ({
                    message:"Auth Failed"
                })
            }
            const token=jwt.sign({
                email:loggedInUser.email,
                userId :loggedInUser._id,
            },
            process.env.JWT_KEY,{
                expiresIn: "1h"
            });

            
            res.status(200).json({
                token:token,
                userId : loggedInUser._id,
                expiresIn:3600,
            });
        }
    ).catch(
        err=>{
             console.log(err);
             res.status(401).json ({
                message:"Invalid Authentication Credentials"
            })
        }
    )


}
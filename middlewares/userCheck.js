const jwt= require('jsonwebtoken');
exports.userCheck=(req,res,next)=>{
    try {
        const token= req.session.username;
        if(!token){
            res.redirect('/')
        }
        
    } catch (error) {
        console.log('error')
    }
    next();
};
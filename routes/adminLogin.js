const express= require('express');
const router= express.Router();

const axios= require('axios');



router.get('/',(req,res)=>{
const username= req.session.username; 
if(req.session.username){
    return res.redirect('/dashboard');
}   

res.render('login',{title:"Login",style:"login.css",layout:'login'})
});

router.post('/login',(req,res)=>{

    const data = {
        username: req.body.username,
        password: req.body.password
}

    axios({
            method: 'post',
            url: 'http://127.0.0.1:5000/admin/login/' ,
            data: data,
            config: { headers: { 'Content-Type': 'application/json' } }
        })
        .then(function(resp){
            const token= resp.data.token;
            req.session.token= resp.data.token
            req.session.username=resp.data.username;
            res.redirect('/dashboard');
        })
        .catch(function(err) {
         const data= err.response.data;
         if(data){
             const msg=data.message;
             res.render('login',{title:"Login",style:"login.css",msg:msg ,layout:'login'})
    
         }

        });
})












module.exports= router;
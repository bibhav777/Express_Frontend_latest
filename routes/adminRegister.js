const express= require('express');
const router= express.Router();
const axios= require('axios');



router.get('/',(req,res)=>{

res.render('register',{title:"Register",style:"register.css",layout:'login'});
})

router.post('/',(req,res)=>{
const data=  {
    first_name:req.body.fname,
    last_name:req.body.lname,
    username:req.body.username,
    password:req.body.password
};
axios({
method:'post',
url:'http://127.0.0.1:5000/admin',
data:data,
config:{headers:{'Content-Type':'application/json'}}
})
.then(function(response){
if(response.status===200){
   return res.render('register',{title:"Register",style:"register.css",layout:'login',smsg:"Registration Sucessfull !!"})
}


}).catch(function(err){
const data= err.response.data;
if(data){
return res.render('register',{title:"Register",style:"register.css",layout:'login',msg:"Username Already exists! !!"})

}




})






})
















module.exports=router;
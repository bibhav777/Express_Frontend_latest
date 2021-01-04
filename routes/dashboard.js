const express= require('express');
const router= express.Router();
const axios= require('axios');

router.get('/',(req,res)=>{
const username= req.session.username;
if(!username){
    return res.redirect('/');
}

const token= req.session.token;
axios({
    method:'get',
    url:'http://127.0.0.1:5000/staffs/total',
    headers:{
        "Authorization" : `Bearer ${token}`,
        'Content-Type':'application/json'
     
    }
})
.then(function(response){
 const staffs= response.data;
 axios({
    method:'get',
    url:'http://127.0.0.1:5000/shipments/total',
    headers:{
        "Authorization" : `Bearer ${token}`,
        'Content-Type':'application/json'
     
    }
})
.then(function(response){
    const shipments = response.data;
    res.render('dashboard',{username:username,layout:'main',title:"Dashboard",staffs:staffs,shipments:shipments});
})
.catch((error)=>console.log(error))})
.catch(function(error){
 console.log(error);

});   
})

module.exports= router;
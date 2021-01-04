const express= require('express');
const router= express.Router();

router.get('/',(req,res)=>{
    req.session.destroy(function(err) {
 if(err){
    res.redirect('/');  
 }
})

res.redirect('/');
});


























module.exports= router;
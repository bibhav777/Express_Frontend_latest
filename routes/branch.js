const express= require('express');
const router= express.Router();
const axios= require('axios');
const multer= require('multer');
const upload=multer();

// router.get('/list',(req,res)=>{
//     res.render('branches/branch',{layout:'main'})
// })

router.get('/add',(req,res)=>{
    const username= req.session.username;
    if(!username){
        return res.redirect('/');
    }
    res.render('branches/addbranch',{layout:'main'});
})


router.post('/add',upload.none(),(req,res)=>{  
    const data= req.body;
    const token=req.session.token; 
   
    axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/branch/add' ,
        data: data,
     headers: { 'Content-Type': 'application/json', 
                              "Authorization":`Bearer ${token}`
    } 
    })
    .then(function(resp){
       console.log(resp);
       res.render('branches/addbranch',{layout:'main',msg:"branch added succesfully!"})
    
    }).catch(function(err){
        console.log(err)
     if(err){
         const msg=err.response.data.msg;
       return res.render('branches/addbranch',{layout:'main',msg:msg})
     }
    
    
    })
    
})

router.get('/list',(req,res)=>{
    const username= req.session.username;
    if(!username){
        return res.redirect('/');
    }
    const token= req.session.token;
    axios({
    method:'get',
    url:'http://127.0.0.1:5000/branch/getall',
    headers:{
        "Authorization" : `Bearer ${token}`,
        'Content-Type':'application/json'
    }
    })
    
    .then(function(response){    
     
    if(response.status==200){
        const datas= response.data.branchModel;
        
        return res.render('branches/branch',{layout:'main',datas:datas})
        
    }
    }).catch(function(error){
    console.log(error);
    })
    
})

router.get('/update/:id',(req,res)=>{
    const id= req.params.id;
    const token= req.session.token;
    axios({
        method:'get',
        url:'http://127.0.0.1:5000/branch/get/'+id,
        headers:{
            "Authorization" : `Bearer ${token}`,
            'Content-Type':'application/json'
        }
    })
    .then(function(response){
     const datas= response.data.data;
     console.log(datas);
     res.render('branches/updatebranch',{layout:'main',datas:datas});
    })
    .catch(function(error){
     console.log(error);

    });

});

router.post('/update/:id',(req,res)=>{  
    const data= req.body;
    const id=req.params.id;
    const token= req.session.token;
    axios({
            method:'patch',
            url:'http://127.0.0.1:5000/branch/update/'+id,
            headers:{
                "Authorization" : `Bearer ${token}`,
                'Content-Type':'application/json'
            },
            data:data

 }).then (resp =>{
         const msg= resp.data.msg;
         res.redirect('/branch/list')
         console.log(branchModel)

 }).catch(function(error){
      if(error.status===401){
        res.render('branches/updatebranch',{layout:'main',datas:datas,msg:"Sorry Cannot update"});

      }
 });
})

router.post('/search',(req,res)=>{

    const data= req.body.search;
    const token=req.session.token
    axios({
        method:'get',
        url:'http://127.0.0.1:5000/branch/search/'+data,
        headers:{
            "Authorization" : `Bearer ${token}`,
            'Content-Type':'application/json'
         
        }
      
    
    }).then(response=>{
        const datas= response.data.data;
        return res.render('branches/branch',{layout:'main',datas:datas})
        
    
    }).
    catch(error=>{
    
        const msg= error.response.data;
        return res.render('branches/branch',{layout:'main',msg:msg})
    
    })
    
})

module.exports = router;
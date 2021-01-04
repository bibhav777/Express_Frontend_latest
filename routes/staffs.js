const express= require('express');
const router= express.Router();
const axios= require('axios');
const multer= require('multer');
const {userCheck}=require('../middlewares/userCheck')

const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null, Date.now()+file.originalname)
    }
    })
    
    //@desc filters of file type
    const fileFilter = (req, file, cb) => {
        if (file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/jpg') {
            cb(null, true)
        } else {
            cb(null, false)
        }
    };
    
const upload=multer({storage:storage, fileFilter:fileFilter});
    


router.get('/add',(req,res)=>{
const username=req.session.username;
if(!username){
    return res.redirect('/');
}

res.render('staffs/addStaffs',{layout:'main'})


})

router.get('/list',(req,res)=>{
const token= req.session.token;
const username= req.session.username;
if(!username){
    return res.redirect('/');
}
axios({
method:'get',
url:'http://127.0.0.1:5000/staffs/all',
headers:{
    "Authorization" : `Bearer ${token}`,
    'Content-Type':'application/json'
 
}
})

.then(function(response){    
   
if(response.status===201){
    const datas= response.data.data;
    return res.render('staffs/listStaff',{layout:'main',datas:datas})
    
}
}).catch(function(error){
console.log(error);
})

})





router.post('/add',upload.single('image'),(req,res)=>{
if(req.file!=null){
req.body.image=req.file.path;
}    
const data= req.body;
const token=req.session.token; 

axios({
    method: 'post',
    url: 'http://127.0.0.1:5000/staffs/add' ,
    data: data,
 headers: { 'Content-Type': 'application/json', 
                          "Authorization":`Bearer ${token}`

} 
})
.then(function(resp){
   console.log(resp);
   res.render('staffs/addStaffs',{layout:'main',msg:'Staff added succesfully!'})

}).catch(function(err){
    console.log(err)
 if(err){
     const msg=err.response.data.msg;
   return res.render('staffs/addStaffs',{layout:'main',msg:msg})
 }


})

})

router.get('/update/:id',(req,res)=>{
    const id= req.params.id;
    const token= req.session.token;
    axios({
        method:'get',
        url:'http://127.0.0.1:5000/staffs/'+id,
        headers:{
            "Authorization" : `Bearer ${token}`,
            'Content-Type':'application/json'
         
        }
    })
    .then(function(response){
     const datas= response.data;
     res.render('staffs/updateStaff',{layout:'main',datas:datas});
    })
    .catch(function(error){
     console.log(error);

    });

});


router.post('/update/:id',upload.single('image'),(req,res)=>{
    if(req.file!=null){
        req.body.image=req.file.path;
        }   
    const data= req.body;
    const id=req.params.id;
    const token= req.session.token;
    axios({
            method:'PATCH',
            url:'http://127.0.0.1:5000/staffs/update/'+id,
            headers:{
                "Authorization" : `Bearer ${token}`,
                'Content-Type':'application/json'
             
            },
            data:data
 }).then(function(resp){
    
         const msg= resp.data.msg;
         res.redirect('/staff/list')
        

 }).catch(function(error){
      if(error.status===401){
        res.render('staffs/updateStaff',{layout:'main',datas:datas,msg:"Sorry Cannot update"});


      }

 });



})



router.post('/delete',(req,res)=>{
const data= req.body;
const token= req.session.token;
axios({
    method:'delete',
    url:'http://127.0.0.1:5000/staffs/delete',
    headers:{
        "Authorization" : `Bearer ${token}`,
        'Content-Type':'application/json'
     
    },
    data:data

})
.then(function(response){
const msg= response.data.msg;
if(response.status===201){
    return res.redirect('/staff/list')

}

})
.catch(function(error){
 console.log(error);

});



})


router.post('/search',(req,res)=>{

const data= req.body.search;
const token=req.session.token;
axios({
    method:'get',
    url:'http://127.0.0.1:5000/staffs/search/'+data,
    headers:{
        "Authorization" : `Bearer ${token}`,
        'Content-Type':'application/json'
     
    }
  

}).then(response=>{
    const datas= response.data.data;
    return res.render('staffs/listStaff',{layout:'main',datas:datas})
    

}).
catch(error=>{

    const msg= error.response.data;
    return res.render('staffs/listStaff',{layout:'main',msg:msg})

})

})

router.post('/filter',async(req,res)=>{
  
const token =req.session.token;
axios({
    method:'get',
    url:'http://127.0.0.1:5000/staffs',
    headers:{
        "Authorization" : `Bearer ${token}`,
        'Content-Type':'application/json'

    },
    params:req.body
}).
then(resp=>{
const datas=resp.data.data;
return res.render('staffs/listStaff',{layout:'main',datas:datas})


}).catch(error=>{
    const msg= error.response.data;
    return res.render('staffs/listStaff',{layout:'main',msg:msg})

})




})




























module.exports=router;
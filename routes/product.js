const express= require('express');
const router= express.Router();
const axios= require('axios');
const multer= require('multer');

const storage= multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads/products');
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

router.get('/',(req,res)=>{
    const token= req.session.token;
axios({
method:'get',
url:'http://127.0.0.1:5000/products/all',
headers:{
    "Authorization" : `Bearer ${token}`,
    'Content-Type':'application/json'
 
}
})

.then(function(response){    
   
if(response.status===200){
    const datas= response.data.products;
    return res.render('products/product',{layout:'main',datas:datas})
    
}
}).catch(function(error){
console.log(error);
})
})

router.get('/add',(req,res)=>{
    const username= req.session.username;
    if(!username){
        return res.redirect('/');
    }
    res.render('products/addproducts',{layout:'main'});
})

router.post('/add',upload.array('product_image', 10),(req,res)=>{
    if(req.files!=null){
        console.log("image was uploaded");
        req.body.product_image = req.files.map(file => {
            const imgPath = file.path;
            return imgPath;
        })
        
    }    
    const data= req.body;
    const token=req.session.token; 
    
    axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/products/add' ,
        data: data,
     headers: { 'Content-Type': 'application/json', 
                              "Authorization":`Bearer ${token}`
    
    } 
    })
    .then(function(resp){
       if(resp.status===200){
        res.render('products/addproducts',{layout:'main',msg:"Product added succesfully!"})
    }
    }).catch(function(err){
    res.render('products/addproducts',{layout:'main',msg:"There was a problem!"})
    
    
    })
    })

router.get('/delete/:productid',(req,res)=>{
    const token=req.session.token; 
    const productId = req.params.productid;
    axios({
        method: 'delete',
        url: `http://127.0.0.1:5000/products/delete/${productId}` ,
        headers: { 'Content-Type': 'application/json', 
                              "Authorization":`Bearer ${token}`
    
    } 
    })
    .then(function(resp){
       if(resp.status===200){
        res.redirect('http://127.0.0.1:8000/product');
    }
    }).catch(function(err){
     console.log(err)
    
    
    })
    })

router.post('/update/:productid',upload.array('product_image', 10),(req,res)=>{
    if(req.files!=null){
        console.log("image was uploaded");
        req.body.frontend_images = req.files.map(file => {
            const imgPath = file.path;
            return imgPath;
        })
    }
    const data= req.body;
    const id = req.params.productid;
    const token=req.session.token; 
    
    axios({
        method:'PATCH',
        url: 'http://127.0.0.1:5000/products/update/'+id ,
        data: data,
     headers: { 'Content-Type': 'application/json', 
                              "Authorization":`Bearer ${token}`
    
    } 
    })
    .then(function(resp){
       if(resp.status===200){
        res.redirect('/product')
    }
    }).catch(function(err){
    res.redirect('/update/'+id,{layout:'main',msg:"There was a problem!"})
    
    
    })    
})


router.get('/update/:id',(req,res)=>{
    const id= req.params.id;
    const token= req.session.token;
    axios({
        method:'get',
        url:'http://127.0.0.1:5000/products/'+id,
        headers:{
            "Authorization" : `Bearer ${token}`,
            'Content-Type':'application/json'
         
        }
    })
    .then(function(response){
     const datas= response.data;
     
     res.render('products/updateproduct',{layout:'main',datas:datas});
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
        url:'http://127.0.0.1:5000/products/search/'+data,
        headers:{
            "Authorization" : `Bearer ${token}`,
            'Content-Type':'application/json'
         
        }
      
    
    }).then(response=>{
        const datas= response.data.data;
        if(datas.length<1 || datas ==undefined){
            return res.render('products/product',{layout:'main',datas:datas,message:'Data not found'}) 
        }
        return res.render('products/product',{layout:'main',datas:datas})
        
    
    }).
    catch(error=>{
    
        const msg= error.response.data;
        return res.render('products/product',{layout:'main',msg:msg})
    
    })
    
    })
module.exports = router;
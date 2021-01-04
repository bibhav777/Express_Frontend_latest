const express= require('express');
const router= express.Router();
const axios= require('axios');

router.get('/',(req,res)=>{
    const data= req.body;
    const username= req.session.username;
    if(!username){
        return res.redirect('/');
    }
    const token= req.session.token;  
    var message = req.flash('shipment');
    axios({
        method: 'GET',
        url: 'http://127.0.0.1:5000/shipments/all' ,
        data: data,
     headers: { 'Content-Type': 'application/json', 
                              "Authorization":`Bearer ${token}`
    
    } 
    })
    .then(function(resp){
       if(resp.status===200){
       const shipments = resp.data.data ;
     
       return res.render('shipment/listshipment',{layout:'main',datas:shipments,message:message})
    }
    }).catch(function(err){
    console.log(err);
    return res.render('shipment/listshipment',{layout:'main',msg:"There was a problem!"})
    
    
    })
});

router.get('/add',(req,res)=>{
    const username= req.session.username
    if(!username){
        return res.redirect('/');
    }
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
    const products= response.data.products;
    const token= req.session.token;  
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
    const staffs= response.data.data;
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
            if(response.status===200){
                const branches = response.data.branchModel;
              
                return res.render('shipment/addshipment',{layout:'main',products:products,staffs:staffs,branches:branches}); 
            }
            
        })
        .catch(function(error){
            console.log(error);
        })
    
    
}
}).catch(function(error){
console.log(error);
})
}
}).catch(function(error){
console.log(error);
})
    
});

router.post('/add',(req,res)=>{
    const data= req.body;
   
    const token= req.session.token;  
    
    axios({
        method: 'post',
        url: 'http://127.0.0.1:5000/shipments/add' ,
        data: data,
     headers: { 'Content-Type': 'application/json', 
                              "Authorization":`Bearer ${token}`
    
    } 
    })
    .then(function(resp){
       if(resp.status===200){
        req.flash('shipment','Added succesfully');
       res.redirect('http://127.0.0.1:8000/shipment');    
    
    }
    }).catch(function(err){
    req.flash('shipment','There was a problem');
    res.redirect('http://127.0.0.1:8000/shipment');
    
    
    
    })
})

router.get('/delete/:shipmentid',(req,res)=>{
    const token=req.session.token; 
    const shipmentid = req.params.shipmentid;
    axios({
        method: 'delete',
        url: `http://127.0.0.1:5000/shipments/${shipmentid}` ,
        headers: { 'Content-Type': 'application/json', 
                              "Authorization":`Bearer ${token}`
    
    } 
    })
    .then(function(resp){
       if(resp.status===200){
        res.redirect('http://127.0.0.1:8000/shipment');
    }
    }).catch(function(err){
     console.log(err)
    
    
    })
})

router.post('/update/:shipmentid',(req,res)=>{
    const id = req.params.shipmentid;
    const data= req.body;
    const token=req.session.token; 

    axios({
        method:'PATCH',
        url: 'http://127.0.0.1:5000/shipments/'+id ,
        data: data,
     headers: { 'Content-Type': 'application/json', 
                              "Authorization":`Bearer ${token}`
    
    } 
    })
    .then(function(resp){
       if(resp.status===200){
        res.redirect('/shipment')
    }
    }).catch(function(err){
    res.redirect('/shipment/update'+id)
    
    
    })    
})

router.get('/update/:shipmentid',(req,res)=>{
    const id= req.params.shipmentid;
    const token= req.session.token;
    axios({
        method:'get',
        url:'http://127.0.0.1:5000/shipments/'+id,
        headers:{
            "Authorization" : `Bearer ${token}`,
            'Content-Type':'application/json'
         
        }
    })
    .then(function(response){ 
     const datas= response.data;
     
     axios({
        method:'get',
        url:'http://127.0.0.1:5000/staffs/all',
        headers:{
            "Authorization" : `Bearer ${token}`,
            'Content-Type':'application/json'
         
        }
        })
        
        .then(function(response){
            const staffs= response.data.data;
            axios({
                method:'get',
                url:'http://127.0.0.1:5000/branch/getall',
                headers:{
                    "Authorization" : `Bearer ${token}`,
                    'Content-Type':'application/json'
                 
                }
                })
                .then(function(response){
                    if(response.status===200){
                        const branches = response.data.branchModel;
                        axios({
                           
                        method:'get',
                        url:'http://127.0.0.1:5000/products/all',
                        headers:{
                            "Authorization" : `Bearer ${token}`,
                            'Content-Type':'application/json'
                        
                        }
                        }).then(function(response){
                            const products =response.data.products;
                            if(response.status===200){
                                return res.render('shipment/updateShipment',{layout:'main',datas:datas,branches:branches,staffs:staffs,products:products});
                            }
                        })
                        .catch(function(error){
                            console.log(error);
                        })
                       
                    }
                    
                })
                .catch(function(error){
                    console.log(error);
                })
        }).catch(function(error){
            console.log(error);
        })
    
    })
    .catch(function(error){
     console.log(error);

    });
})


router.post('/search',(req,res)=>{

    const data= req.body.search;
    const username= req.session.username;
    if(!username){
        return res.redirect('/');
    }
    const token= req.session.token;
    
    axios({
        method:'get',
        url:'http://127.0.0.1:5000/shipments/search/'+data,
        headers:{
            "Authorization" : `Bearer ${token}`,
            'Content-Type':'application/json'
         
        }
      
    
    }).then(response=>{
        
        const shipments = response.data.data ;
        if(shipments.length<1 || shipments ==undefined){
            return res.render('shipment/listshipment',{layout:'main',datas:shipments,message:'Data not found'}) 
        }
       return res.render('shipment/listshipment',{layout:'main',datas:shipments})
        
    
    }).
    catch(error=>{
    
       
        return res.render('shipment/listshipment',{layout:'main',msg:"There was a problem"})
    
    })
    
    })

module.exports = router;
const express= require('express');
const path= require('path')
const dotenv= require('dotenv');
const expbs  = require('express-handlebars');
const bodyParser=require('body-parser');

const adminLogin= require('./routes/adminLogin');
const adminRegister= require('./routes/adminRegister');
const dashboard= require('./routes/dashboard');
const logout= require('./routes/logout');
const product = require('./routes/product');
const staff =require('./routes/staffs');
const branch = require('./routes/branch');


const shipment =require('./routes/shipment');

// configuring enviroment variables here
dotenv.config({path:'./config/config.env'})
const app= express();
// Flash sessions variable
var flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var moment = require('moment');



//set view engine
app.engine( "hbs", expbs({ extname: "hbs", 
defaultLayout:'main', 
layoutsDir: "views/layouts/",
helpers:{
   formatTime:function (date, format) {
      var mmnt = moment(date);
      return mmnt.format(format);
  },
  select:function(selected, option) {
   return (selected == option) ? 'selected="selected"' : '';
}
}}));

app.use(session({
   secret: 'gyapu',
   resave: false,
   saveUninitialized: true
 }))

app.set('view engine','hbs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(flash());


app.use("/uploads",express.static('uploads'));
app.use('/',adminLogin);
app.use('/dashboard',dashboard);
app.use('/logout',logout);
app.use('/register',adminRegister);
app.use('/staff',staff);
app.use('/product',product);

app.use('/branch',branch);

app.use('/shipment',shipment);










const PORT= process.env.PORT || 8000;

app.listen(PORT,()=>{
 console.log(`Server is running on ${process.env.PORT} on ${process.env.ENVIROMENT}`)})
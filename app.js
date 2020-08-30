var express=require('express');
const expressLayouts=require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport=require('passport');

var app = express();

const db = require('./config/keys').MongoURI;
mongoose.connect(db,{useNewUrlParser: true})
.then(()=>console.log("Connected to MongoDB"))
.catch(err => console.log(err));


app.use(expressLayouts);
app.set('view engine','ejs');


//Bodyparser
app.use(express.urlencoded({extended:false}));


//express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { secure: true }
  }))

  //connect flash
  app.use(flash());

  //passport config
  require('./config/passport')(passport);

  //global vars

  app.use((req,res,next)=>{
      res.locals.success_msg=req.flash('success_msg');
      res.locals.error_msg=req.flash('error_msg');
      next();
  });

app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));


//Start the server
app.listen(3000,()=>{
    console.log(`Server is connected to port 3000`);
});



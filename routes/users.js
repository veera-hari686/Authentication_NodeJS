const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport=require('passport');

const User=require('../models/user');

router.get('/login',(req,res)=>
{
    res.render('login');
})

router.get('/register',(req,res)=>
{
    res.render('register');
})

router.post('/register',(req,res)=>{
    
    const{name,email,password,password2}=req.body;
    let errors=[];

    if(!name || !email || !password || !password2)
    {
        errors.push({msg:"Fileds should not be empty"});
    }

    if(password.length<6)
    {   
        errors.push({msg:"password should be of six characters"});
    }
    if(password!=password2)
    {
        errors.push({msg:"password does not match"});
    }

    if(errors.length>0)
    {
        res.render('register',{
            errors:errors,
            name:name,
            email:email,
            password:password,
            password2:password2
        });
    }
    else{
        User.findOne({email:email})
        .then((user)=>{
            if(user)
            {
                errors.push({msg:"email already exists"});
                res.render('register',{
                    errors:errors,
                    name:name,
                    email:email,
                    password:password,
                    password2:password2
                });

            }
            else{
                const newUser= new User({
                    name:name,
                    email:email,
                    password:password
                });

                //hash password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;

                        newUser.password=hash;
                        newUser.save()
                        .then(()=>{
                            req.flash('success_msg','you are now registered');
                            res.redirect('login');
                        })
                        .catch(err=>console.log(err));
                    });
                });
                
            }
        })
    }

})

router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/dashboard',
        failureRedirect:'/users/login',
        failureFlash:true,
    })(req,res,next);
});

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','you are logged out');
    res.redirect('/users/login');
})

module.exports = router;
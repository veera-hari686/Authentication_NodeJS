module.exports={
    ensureAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            return next();            
        }
        req.flash('error-msg','please login to view this resource');
        res.redirect('/users/login');
    }
}
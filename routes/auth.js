const express = require('express');
const router = express.Router();
var User = require('../models/register');
var mid = require('../middleware/index');


router.get('/', function(req, res){
   User.find({},function(err,user){
   	if(err)
   		res.send(err);
   	res.json(user)
   })
});

router.get('/profile',mid.checkstatus,function(req,res){
		User.findById(req.session.userId)
		.exec(function(err,user){
			if(err)
				res.send(err);
			res.render('profile',{name:user.name,email:user.email,title:'profile'})
	})
})

router.get('/login',mid.checklogin, function(req, res){
   res.render('login');
});

router.post('/login', function(req, res){
   if(req.body.email&&req.body.password){
   	User.authenticate(req.body.email,req.body.password,function(err,user){
   		console.log(user)
   		if(err){
   			res.send(err)
   		}
   		else{

   			req.session.userId = user._id;
   			console.log("session",req.session.userId = user._id)
   			return res.redirect('/profile');
   		}
   		
   	})
   }else{
   	res.json({error:'All fields are required'})
   }
});

router.get('/logout',function(req,res,next){
	if(req.session){
		req.session.destroy(function(err){
			if(err)
				res.send(err)
			res.redirect('/login')
		})
	}
})


router.get('/register',mid.checklogin, function(req, res){
   res.render('register');
});

router.post('/register', function(req, res,next){
   if(req.body.email&&
   	req.body.name&&
   	req.body.password&&
   	req.body.confirmPassword){

   	if(req.body.password!==req.body.confirmPassword){
   		res.json({error:"Password do not match"});
   	}
   	var userData = {
   		email:req.body.email,
   		name:req.body.name,
   		password:req.body.password
   	};

   	User.create(userData,function(err,user){
   		if(err){
   			return next(err);
   		}else{
   			req.session.userId = user._id;
	   		res.json(user);
   		}
	   		
   	})

   }else{
  		res.json({error:"All fields required"});
   }
});




module.exports = router;
function checklogin(req,res,next){
	if(req.session && req.session.userId){
		return res.redirect('/profile');
	}
	return next();
}

function checkstatus(req,res,next){
	if(req.session&& req.session.userId){
		return next();
		
	}else{
		res.redirect('/login');
	}
}

//module.exports.checklogin = checklogin;
module.exports = {
    checklogin: checklogin,
    checkstatus: checkstatus
}
var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var UserSchema = new mongoose.Schema({
	email:{
		type:String,
		unique: true,
		required: true,
		trim:true
	},
	name:{
		type:String,
		required: true,
		trim:true
	},
	password:{
		type:String,
		required: true
	}
});

// hash password before saving to database
UserSchema.pre('save',function(next){
	var user = this;
	bcrypt.hash(user.password,10,function(err,hash){
		if(err)
			return next(err);
		user.password = hash;
		next();
	})

});

//authenticate input against the database
UserSchema.statics.authenticate = function(email,password,callback){
	User.findOne({email:email})
	.exec(function(err,user){
		if(err){
			return callback(err)
		}
		else if(!user){
			return callback('user not found')
		}
		else{
			bcrypt.compare(password,user.password,function(err,result){
				if(result==true){
					console.log("===========found==========")
					return callback(null,user);
					
				}
					
				else{
					console.log("=========== NOT found==========")
					return callback("incorrect password");

				}

			})			
		}


	})
}
var User = mongoose.model("User",UserSchema);
module.exports = User;
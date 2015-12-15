var mongoose=require('mongoose');
var bcrypt=require('bcrypt');

var userSchema=mongoose.Schema({
  Name:String,
  email:String,
  password:String,
  Phoneno:String,
  Address:String,
  City:String,
  ZIP:String,
  State:String,
  Country:String,
  passresetToken:String,
  emailVerifyToken:String,
  isverified:{type:Boolean,default:false},
  created:{type:Date,default:Date.now}
});

userSchema.methods.generateHash = function(password, next){

	bcrypt.hash(password, bcrypt.genSaltSync(8), null, next);

};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports=mongoose.model('User',userSchema);

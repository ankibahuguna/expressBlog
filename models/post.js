var mongoose=require('mongoose');


var postSchema=mongoose.Schema({
  Title:String,
  Subtitle:String,
  Content:String,
  Permalink:String,
  Author:String,
  published:Boolean,
  created:{type:Date,default:Date.now},
  FeaturedImage:String
});



module.exports=mongoose.model('Post',postSchema);

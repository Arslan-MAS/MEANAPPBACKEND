const mongoose=  require ("mongoose");
const postSchema = mongoose.Schema({
    Title: {type : String , required :true },
    Content : {type : String , required:true },
    ImagePath : {type :String , required : true },
    Creator : { type : mongoose.Schema.Types.ObjectId, ref :"User",required:true}
});

module.exports = mongoose.model('Post',postSchema);
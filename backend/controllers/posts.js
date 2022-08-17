
const Post= require('../models/post');


exports.createPost= (req,res,next)=>{
    const url = req.protocol + '://' + req.get('host');
    console.log(req.body);
    const post = new Post({
        Title:req.body.Title,
        Content:req.body.Content,
        ImagePath :  url+"/images/"+ req.file.filename ,
        Creator : req.userData.userId,
    });
    post.save().then ( (savedPost) => {
        console.log(savedPost);
        res.status(201).json({
            message:"Post Added Succesfully",
            post :{
                Id : savedPost._id,
                ...savedPost
                // Title : savedPost.Title,
                // Content :savedPost.Content,
                // ImagePath : savedPost.ImagePath
            }
        })
    }).catch((err)=>{
        res.status(500).json({
            message :"Creating Post Failed"
        })
    })
    ;
    
    
}
exports.getPosts=(req,res,next)=>{
    
    console.log(req.query);
    const postsPerPage = +req.query.pagesize ; 
    const currentPage = +req.query.page; 
    const postQuery= Post.find(); 
    let fetchedPosts ; 
    if (postsPerPage && currentPage) {
        postQuery.skip(postsPerPage * (currentPage-1)).limit(postsPerPage);
    }
    postQuery.then((documents)=>{
        fetchedPosts= documents; 
        return Post.count();
    }).then((count)=>{
        //console.log(documents);
        console.log(fetchedPosts);
        res.status(200).json({
            message : "Post Fetched Succesfully",
            posts: fetchedPosts,
            maxPosts : count 

        })
    }).catch((error)=>{
        console.log(error);
        res.status(500).json({
            message:"Fetching Posts Failed",
        })
    });
    
}
exports.getPost= (req,res,next)=>{
    Post.findById(req.params.id).then((post )=>{ 
        if (post){
            res.status(200).json(post);
        }else {
            res.status(404).json({message:"Post Not Found"});
        }
    }).catch((err)=>{
        res.status(500).json({
            message:"Something went wrong at server",
        })
    })
}

exports.updatePost =(req,res,next)=>{
    //console.log ( req.file); 
    let imagePath  = req.body.ImagePath; 
    if (req.file){
        const url = req.protocol + '://' + req.get('host');
        imagePath =  url+"/images/"+ req.file.filename

    }

    const post = new Post ({ 
        _id:req.body.Id,
        Title:req.body.Title,
        Content:req.body.Content,
        ImagePath:imagePath,
        Creator :req.userData.userId,
    })
    Post.updateOne({_id:req.params.id,Creator:req.userData.userId},post).then((result)=>{
        console.log(result);

        if (result.matchedCount>0) {
            res.status(200).json({
                message:"Updated Succesfully!",

            })
        }else {
            res.status(401).json ( {
                message:"UnAuthorized to Update",
            })
        }
    }).catch((errorMessage)=>{
        console.log(errorMessage);
        res.status(500).json({
            message:"Updated UnSuccesfully!",

        })
    })
}
exports.deletePost = (req,res,next)=>{
    Post.deleteOne({_id:req.params.id,Creator:req.userData.userId}).then((result)=>{
        console.log(result);
        if (result.deletedCount>0 ){

        
            res.status(200).json({message:"Post Deleted"});

        }else {
            res.status(401).json ({
                message:"UnAuthorized to delete",
            });
        }
    }).catch((error)=> {console.log("Error Occured") ; 
        res.status(500).json({
            message:"Posts couldn't be deleted"
        });
    })
    
}
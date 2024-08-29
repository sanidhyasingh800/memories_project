
import postmessage from "../models/postmessage.js";
import mongoose from "mongoose";
// abstract the routes and route handling for better scalability
// export functions essentially make them available everywhere until they are intercepted by an import

export const getPosts = async (req, res) => {
    try {
        const postMessages = await postmessage.find(); // model find all instances operation C(READ)UD
        // console.log(postMessages.map((post) => (post.title)));
        res.status(200).json(postMessages); // return a success status (200) and return the postMessages we found in JSON format

    } catch (error) {
        res.status(404).json( {message: error.message}); // return failure status and message (404)
    }
}
 
export const createPost =  async (req, res) => {
    const post = req.body; // obtain the post from the req param
    const newPost = new postmessage(post); // create a new instance of the postmessage model using data from req
    try {
        await newPost.save() // CR(Update)D operation on the db using the model object 
        res.status(201).json(newPost); // if success,  return the post in JSON
    } catch(error) {
        res.status(409).json( {message: error.message}); // return failure status and message (404)
    }
}

export const updatePost =  async (req, res) => {
    const { id: _id } = req.params; // req objects store params that they dynamically expect from the URL so we can access them through destructuring
    const post = req.body;
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    const updatedPost = await postmessage.findByIdAndUpdate(_id, {... post, _id}, { new: true});
    
    res.json(updatedPost);
}


export const deletePost = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

    await postmessage.findByIdAndDelete(id);

    res.json({ message: "Post deleted successfully." });
}


export const likePost =  async (req, res) => {
    const { id: _id } = req.params; // req objects store params that they dynamically expect from the URL so we can access them through destructuring
    const post = await postmessage.findById(_id); // req body usually stores the data (in this case its the post), we have to assume that the front end sends in the post as part of the data, and then implement this on the front end later
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    const updatedPost = await postmessage.findByIdAndUpdate(_id, {likeCount: post.likeCount + 1}, { new: true});
    
    res.json(updatedPost);
}

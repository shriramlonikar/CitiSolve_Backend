import mongoose from "mongoose";

function connect(){
    mongoose.connect(
        "mongodb+srv://shriramlonikar618:shriramlonikar25@mycluster.7gsyqvc.mongodb.net/SIH"
    ).then(()=>{
        console.log("Connected to mongoose")
    })
    .catch((err)=>{
        console.log(err)
    });
}

export default connect;
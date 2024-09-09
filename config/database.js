const mongoose= require("mongoose");


 const connectdb = async () => {
 
  const { connection } = await mongoose.connect(process.env.MONGO_URL);
  console.log(`Database connection successfull with ${connection.host}`);
};

module.exports=connectdb;
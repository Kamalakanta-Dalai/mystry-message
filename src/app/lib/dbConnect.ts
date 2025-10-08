import mongoose from "mongoose";

//Defining the blueprint of a object which can have a property 'isConnected' which is a number
// but if we make an instance of that it will ask to initialise the peoperty that's why '?' is given
//This is a custom type define
type connectionObject = {
  isConnected?: number;
};

// here is an instance of that blueprint named 'connection' and initialised with empty{} but we are using typescript so type is 'connectionObject'
const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("DB connected already");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    // console.log(db);

    connection.isConnected = db.connections[0].readyState;
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("Error Occured: Database Connection Failed", error);
    // Avoid Node-only APIs (like process.exit) to remain compatible with Edge/runtime bundling
    throw error;
  }
}

export default dbConnect;

import mongoose from 'mongoose';

const conectarDB = async () => {
    try {
      const bd = await mongoose.connect(process.env.MONGO_URI, {
           useNewUrlParser: true,
           useUnifiedTopology: true  
        });
        const url = `${bd.connection.host}:${bd.connection.port}`   
        console.log((`MongoDB conectado en ${url}`));
    } catch (error) {
       console.log(`error:${error.message}`);          
       process.exit(1);
    }
}

export default conectarDB;
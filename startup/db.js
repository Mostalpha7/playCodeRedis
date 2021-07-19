const mongoose = require("mongoose");

const uri = `mongodb://localhost/learningRedis`;

module.exports = async() => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,
        });

        let readyState = mongoose.connection.readyState;
        if (readyState !== 1) {
            console.log(
                `Mongoose connection failed with readystate code ${readyState}`
            );
            return false;
        }

        console.log(`Database connection established.`);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
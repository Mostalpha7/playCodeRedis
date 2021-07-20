const mongoose = require("mongoose");
const redis = require("redis");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
const util = require("util");
client.get = util.promisify(client.get);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function() {
    // add the collection name to key to use in  redis
    const key = JSON.stringify(
        Object.assign({}, this.getQuery(), {
            collection: this.mongooseCollection.name,
        })
    );

    // chech if the data is already saved
    const cachedValue = await client.get(key);
    if (cachedValue) {
        // parse the stringfy cached and convert it into the current mongoose model
        const doc = JSON.parse(cachedValue);

        return Array.isArray(doc) ?
            doc.map((d) => new this.model(d)) :
            new this.model(doc);
    }

    // get the data from mongodb
    const result = await exec.apply(this, arguments);

    // save it in cache
    client.set(key, JSON.stringify(result));

    // return the result
    return result;
};
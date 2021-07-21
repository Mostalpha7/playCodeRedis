const mongoose = require("mongoose");
const redis = require("redis");
const redisUrl = "redis://127.0.0.1:6379";
const client = redis.createClient(redisUrl);
const util = require("util");
client.hget = util.promisify(client.hget);

const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
    this._useCache = true;
    this._haskKey = JSON.stringify(options.key || "defaultKey");
    return this;
};

mongoose.Query.prototype.exec = async function() {
    // If the query should not the cache.
    if (!this._useCache) {
        return exec.apply(this, arguments);
    } else {
        // add the collection name to key to use in  redis
        const key = JSON.stringify(
            Object.assign({}, this.getQuery(), {
                collection: this.mongooseCollection.name,
            })
        );

        // chech if the data is already saved
        const cachedValue = await client.hget(this._haskKey, key);
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
        await client.hset(this._haskKey, key, JSON.stringify(result));

        // return the result
        return result;
    }
};

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    },
};
const db = require('mongodb').MongoClient

const state = {
    dbname: null
}

async function connect() {
    const url = "mongodb://localhost:27017/"
    const dbName = 'Workers'
    const client = new db(url)

    try {
        client.connect()
        state.dbname = client.db(dbName)
        if (state.dbname) {
            console.log('mongo db connected successfully')
        }
    } catch (error) {
        console.log(error)
    }
}


connect()

module.exports.get = function(){
    return state.dbname
}
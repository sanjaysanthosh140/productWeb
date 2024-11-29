const db = require('mongodb').MongoClient

const state = {
    dbname: null
}

async function connect() {
    const url = "mongodb+srv://sanju:%230ef%23000%2C%23ffff@mernapp.blnm8.mongodb.net/?retryWrites=true&w=majority&appName=mernapp"
    const dbName = 'Workers'
    const client = new db(url,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000
    })

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

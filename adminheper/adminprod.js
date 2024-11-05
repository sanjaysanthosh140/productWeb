
const { ObjectId } = require("mongodb")
const db = require("../config/config.js")
const e = require("express")
const { promise } = require("bcrypt/promises.js")

module.exports = {
    addproduct: (products) => {
        return new Promise(async (resolve, reject) => {
            try {
                await db.get().collection('productsItem').insertOne(products).then((result) => {
                    console.log(result.insertedId)
                    resolve(result.insertedId)
                })
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    },

    getproducts: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const products = await db.get().collection('productsItem').find().toArray()
                resolve(products)
            } catch (error) {
                reject(error)
            }
        })
    },

    deletproduct: (proId) => {
        return new Promise(async (resolve, reject) => {
            try {
                await db.get().collection('productsItem').deleteOne({ _id: new ObjectId(proId) }).then((data) => {
                    resolve(data)
                    console.log(data)
                })
            } catch (error) {
                reject(error)
            }
        })
    },

    getproduct: (proId) => {
        console.log(proId)
        return new Promise(async (reslove, reject) => {
            try {
                await db.get().collection('productsItem').findOne({ _id: new ObjectId(proId) }).then((result) => {
                    if (reslove) {
                        console.log("re", result)
                        reslove(result)
                    } else {
                        console.log(' no no results')
                    }
                })
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    },

    updataproduct: (proid, prodata) => {
        return new Promise(async (resolve, reject) => {
            try {
                await db.get().collection('productsItem').updateOne({ _id: new ObjectId(proid) }, {
                    $set: {
                        product: prodata.product,
                        price: prodata.price,
                    }
                }).then((result) => {

                    console.log(reject)
                    resolve(result)
                })
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    },

    addServices: (serviceData) => {
        return new Promise((resolve, reject) => {
            try {
                db.get().collection('services').insertOne(serviceData).then((data) => {
                    if (data) {
                        console.log(data.insertedId)
                        resolve(data.insertedId)
                    }
                })
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    },


    getpods: (prodata) => {
        return new Promise( async(reslove, reject) => {
        await  db.get().collection('pods').insertOne(prodata).then((data) => {
                if (data) {
                    reslove(data.insertedId)
                    console.log(data)
                } else {
                    console.log('no data inserted')
                    reject(data)
                }
            })
        })
    }

}
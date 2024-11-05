const { ObjectId } = require('mongodb')
const db = require('../config/config')
const jwt = require('jsonwebtoken')
module.exports = {
    getProducts: () => {
        return new Promise(async (reslove, reject) => {
            try {
                const products = await db.get().collection('productsItem').find().toArray()
                if (products) {
                    reslove(products)
                }
            } catch (error) {
                reject(error)
            }
        })
    },

    getServicesData: () => {
        return new Promise(async (resolve, reject) => {
            try {
                await db.get().collection('services').find({}, {
                    _id: 1,
                    discription: 1,
                    name: 1
                }).sort().toArray()
                    .then((result) => {

                        resolve(result)
                    })
            } catch (error) {
                reject(error)
            }
        })
    },

    getPodsData: () => {
        return new Promise(async (resolve, reject) => {
            let data = await db.get().collection('pods').find({}, {id: 1}).toArray()
            if (data) {
                console.log(data)
                resolve(data)
            } else {
                console.log('data not find')
                reject(error)
            }
        })
    },


    addcart: (proId, usrId) => {
        return new Promise((resolve, reject) => {
            try {
                let proObj = {
                    item: new ObjectId(proId),
                    quantity: 1
                }
                console.log('Encod',usrId)
                jwt.verify(usrId, 'sanjay secrit', async (err, decodedTocken) => {
                    //console.log('decod',decodedTocken.id)
                    if (err) {
                        console.log(err)
                    } else {
                        const user = await db.get().collection('userCarts').findOne({ userId: new ObjectId(decodedTocken.id) })
                        if (user) {
                           
                            
                            let proIndx = user.products.findIndex(product => product.item.toString() === proId)

                            console.log('podId',proIndx)
                            if (proIndx !== -1) {
                                console.log('1st statement')
                                db.get().collection('userCarts').updateOne({
                                    'userId': new ObjectId(decodedTocken.id),
                                    'products.item': new ObjectId(proId),
                                }, {
                                    $inc: { 'products.$.quantity': 1 }
                                })
                            } else {
                                console.log('2nt statement')
                                await db.get().collection('userCarts').updateOne({ userId: new ObjectId(decodedTocken.id) }, {
                                    $push: {
                                        products: proObj
                                    }
                                })
                            }

                        } else if(!user){
                            let userObj = {
                                userId: new ObjectId(decodedTocken.id),
                                products: [proObj]
                            }
                            await db.get().collection('userCarts').insertOne(userObj).then((result) => {
                                console.log(result)
                                resolve(result)
                            })
                        }
                    }

                })
            } catch (error) {
                reject(error)
            }
        })
    },

    getcartPro: (userId) => {
       return new Promise(async (resolve, reject) => {
           try {
               jwt.verify(userId, 'sanjay secrit', async (err, decodedcode) => {
                   if (err) {
                       console.log(err)
                   } else {
                       console.log(decodedcode.id)
                       let cartItems = await db.get().collection('userCarts').aggregate([{
                           $match: { userId: new ObjectId(decodedcode.id) }
                       }, {
                           $unwind: "$products"
                       },{
                           $project:{
                               item:'$products.item',
                               quantity:'$products.quantity'
                           },
                           
                       },{
                           $lookup:{
                               from:'pods',
                               localField:'item',
                               foreignField:'_id',
                               as:'products'
                           }
                       },{
                        $project:{
                            item:1,quantity:1,products:{$arrayElemAt:['$products',0]}
                        }
                       }]).toArray()
                           //console.log(cartItems[0].products)
                           for(i=0; i<=cartItems.length; i++ ){
                               console.log(cartItems[i])
                           }
                           resolve(cartItems)
                   }
               })
           } catch (error) {
               reject(error)
           }
       })
    },

    totalPrice :(usrId)=>{
           return new Promise(async(resolve,reject)=>{
            try {
                jwt.verify(usrId,'sanjay secrit',async(err,decodedToken)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log('f-decode',decodedToken.id)
                        let totalPrice = await db.get().collection('userCarts').aggregate([{
                            $match:{userId: new ObjectId(decodedToken.id)}
                        },{
                            $unwind:"$products"
                        },{
                            $project:{
                                item:'$products.item',
                                quantity:'$products.quantity'
                            }
                        },{
                            $lookup:{
                                from:'pods',
                                localField:'item',
                                foreignField:'_id',
                                as:'product'
                            }
                        },{
                            $group:{
                                _id:null,
                                total:{$sum:{$multiply:['$quantity',{$toInt:{
                                    $arrayElemAt:['$product.price',0]
                                }}
                            ]}}
                           }
                        }
                        ]).toArray()
                        console.log('total',totalPrice)
                        resolve(totalPrice)
                    }
                })
                
            } catch (error) {
                reject(error)
            }

           })
    },

    changeQuantity:(data)=>{
        return new Promise( async(resolve,reject)=>{
            try {
                let count = parseInt(data.count) 
              await  db.get().collection('userCarts').updateOne({
                    _id: new ObjectId(data.cartId),'products.item' : new ObjectId(data.productId)
                },
            {
                $inc:{
                    'products.$.quantity':count
                }
            },{
                $project:{
                    quantity:"$products.quantity"
                }
            }).then((result)=>{
                console.log(result)
                resolve({status:true})
            })
           
            } catch (error) {
                reject(error)
            }
        })

    },

    getCartProductList: (userId)=>{
        return new Promise(async(resolve,reject)=>{
            try {
                jwt.verify(userId,'sanjay secrit',async(err,decodedTocken)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log('encode',decodedTocken.id)
                        let carts = await db.get().collection('userCarts').findOne({userId: new ObjectId(decodedTocken.id)})
                        if(carts){
                            resolve(carts.products)
                        }
                    }
                })
            } catch (error) {
                console.log(error)
            }
        })
    },

    removeItems:(cartId,productId)=>{
        return new Promise(async(resolve,reject)=>{
            try {
                await db.get().collection('userCarts').updateOne({
                    _id: new ObjectId(cartId),
                    //productId: new ObjectId(productId),

                },
            {
                $pull:{
                    products:{
                        item:new ObjectId(productId)
                    }
                }
            }).then((result)=>{
                    console.log(result)
                    resolve(result)
                })
            } catch (error) {
                console.log(error)
                reject(error)
            }
        })
    }

}
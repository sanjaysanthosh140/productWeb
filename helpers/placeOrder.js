const { ObjectId } = require('mongodb')
const db = require('../config/config')

const { promise, reject } = require('bcrypt/promises')
const Razorpay = require('razorpay');

var instance = new Razorpay({
  key_id: 'rzp_test_j7B2kLPTq9IObD',
  key_secret: 'Sqkmw7Tg6slcetKToGxNGMkN',
});

module.exports={

placeOrders:(order,products,total)=>{
    return new Promise(async(resolve,reject)=>{
        try {
          //console.log('orders',order,products,total)
         let status = order.paymentMethod==='cod'?'placed':'pending'
          let OrderObj = {
            DeleveryDetals:{
                mobile:order.phone,
                Address:order.Address,
                pinCod:order.pincode
            },
           // userId: new ObjectId(order.userId),
            paymentMethod:order.paymentMethod,
            product:products,
            status:status,
            price:total,
            Date: new Date()
          }

          await db.get().collection('orders').insertOne(OrderObj).then((response)=>{
            resolve(response.insertedId)
          })
        } catch (error) {
            console.log(error)
            reject(error)
        }
    })
},


generatRazorpay:(orderID,total)=>{
  return new Promise((resolve,reject)=>{
    try {
      
 var options={
   amount: total*100,
   currency: "INR",
   receipt: ""+orderID
  }
   instance.orders.create( options,function(err, order){
       if(err){
        console.log(err)
       }else{
        console.log(order)
        resolve(order)
       }
   })

    } catch (error) {
      reject(error)
      console.log(error)
    }
  })
},

changeStatus:(orderId)=>{
  return new Promise(async(resolve)=>{
    try {
      await db.get().collection('orders').updateOne({_id : new ObjectId(orderId)},{$set:{status:'placed'}}).then((result)=>{
        resolve(result)
      })
    } catch (error) {
      reject(error)
    }
  })
}


}
const passport = require('passport')
const googleStrategy =  require( 'passport-google-oauth20')
const keys = require('../config/keys')
const helper = require('../helpers/googleOauthStor')
passport.use(
    new googleStrategy({
        callbackURL:"/oauth/google/redirect", 
        clientID:keys.google.ClientID,
        clientSecret:keys.google.ClientSecret
    },(accessToken,refreshToken,profile,done)=>{
        try {
            helper.Store(profile).then((data)=>{
                if(data){
                    console.log(data)
                    
                }
        })
        } catch (error) {
            console.log(error)
        }
    //    console.log(profile)
    })
)
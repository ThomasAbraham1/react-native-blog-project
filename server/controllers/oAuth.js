const { userModel } = require('../db');
var jwt = require('jsonwebtoken');
require('dotenv').config();

const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

const GOOGLE_ACCESS_TOKEN_URL = "https://oauth2.googleapis.com/token"
const GOOGLE_TOKEN_INFO_URL = 'https://oauth2.googleapis.com/tokeninfo'

const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
const GOOGLE_OAUTH_SCOPES = [

    "https%3A//www.googleapis.com/auth/userinfo.email",

    "https%3A//www.googleapis.com/auth/userinfo.profile",

];
const GOOGLE_CALLBACK_URL = "http://localhost:3000/google/auth";

//  For facebook
const FACEBOOK_CLIENT_SECRET = "35443b366fdc948a85d1dc5dc45a2926"
const FACEBOOK_OAUTH_URL = "https://www.facebook.com/v19.0/dialog/oauth"

const FACEBOOK_ACCESS_TOKEN_URL = "https://graph.facebook.com/v19.0/oauth/access_token"

const FACEBOOK_CLIENT_ID = '1056503046062039';
const FACEBOOK_TOKEN_INFO_URL = `https://graph.facebook.com/me`
// const GOOGLE_OAUTH_SCOPES = [

//     "https%3A//www.googleapis.com/auth/userinfo.email",

//     "https%3A//www.googleapis.com/auth/userinfo.profile",

// ];
const FACEBOOK_CALLBACK_URL = "http://localhost:3000/facebook/auth";


// https://www.facebook.com/v19.0/dialog/oauth?
//   client_id=1056503046062039
//   &redirect_uri=http://localhost:3000/google/auth
//   &state=state


const oAuthRedirect = async (req, res) => {
    // For facebook
    console.log(req.body.socialLoginType)
    var socialLoginType = req.body.socialLoginType;
    if (socialLoginType == 'facebook') {
        const FACEBOOK_OAUTH_CONSENT_SCREEN_URL = `${FACEBOOK_OAUTH_URL}?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${FACEBOOK_CALLBACK_URL}&state=state&scopes=email`;
        res.send(FACEBOOK_OAUTH_CONSENT_SCREEN_URL);
        return
    }

    const state = "some_state";
    const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
    res.send(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
    // window.location.href=GOOGLE_OAUTH_CONSENT_SCREEN_URL;
}

const logIn = async (email, profilePic, { req, res }) => {
    try {
        const data = await userModel.exists({ username: email });
        console.log(data)
        if (!data) throw "userNotExist"
        // Creating JWT cookie for user
        var id = data._id;
        const token = jwt.sign({ id }, 'bar', { expiresIn: 1 * 24 * 60 * 60 });
        res.cookie("jwt", token, {
            withCredentials: true,
            // httpOnly: true,
            secure: true,
            sameSite:'None',
            maxAge: 1 * 24 * 60 * 60 * 1000, 
        });
        // res.status(200).json({
        //     userId: data._id,
        //     message: "User is welcome!",
        // })
        res.redirect('http://localhost:5173/homepage');
    } catch (err) {
        if (err == 'userNotExist') {
            userModel.create({ username: email }).then((data) => {
                console.log("User doesn't exist")
                var id = data._id;
                const token = jwt.sign({ id }, 'bar', { expiresIn: 1 * 24 * 60 * 60 });
                res.cookie("jwt", token, {
                    withCredentials: true,
                    httpOnly: true,
                    secure: true,
                    sameSite:'None',
                    maxAge: 1 * 24 * 60 * 60 * 1000, 
                });
                // res.status(200).json({
                //     userId: id,
                //     message: "User is welcome!",
                // })
                res.redirect('http://localhost:5173/homepage');

            })
        }
    }
}

const oAuthGoogleCallback = async (req, res) => {
    //  Getting authentication code
    var { code } = req.query;
    console.log(req.query)
    var data = {
        code,
        client_id: GOOGLE_CLIENT_ID,

        client_secret: GOOGLE_CLIENT_SECRET,

        redirect_uri: "http://localhost:3000/google/auth",

        grant_type: "authorization_code",
    }

    // Getting access token
    const response = await fetch(GOOGLE_ACCESS_TOKEN_URL, {
        method: "POST",

        body: JSON.stringify(data),
    });
    try {
        const access_token_data = await response.json();
        if (access_token_data.error) {
            throw access_token_data.error
        }
        var accessToken = access_token_data.access_token;
        if (access_token_data.refresh_token) var refreshToken = access_token_data.refresh_token
        var idToken = access_token_data.id_token
        console.log("Access token: " + accessToken + "\n" + "refreshToken: " + (refreshToken ? refreshToken : '\n') + "Id token: " + idToken);

        //  Getting token information
        var tokenInfoResponse = await fetch(GOOGLE_TOKEN_INFO_URL + "?id_token=" + idToken);
        tokenInfoResponse = await tokenInfoResponse.json();

        var email = tokenInfoResponse.email;
        var profilePic = tokenInfoResponse.picture;
        logIn(email, profilePic, { req: req, res: res });
    } catch (error) {
        console.log(error + "This is an error");
    }
}
const oAuthFacebookCallback = async (req, res) => {
    //  Getting authentication code
    var { code } = req.query;
    console.log(req.query)
    // var data = {
    //     client_id: FACEBOOK_CLIENT_ID,
    //     redirect_uri: "http://localhost:3000/facebook/auth",
    //     client_secret: FACEBOOK_CLIENT_SECRET,
    //     code
    // }

    // Getting access token
    const response = await fetch(`${FACEBOOK_ACCESS_TOKEN_URL}?client_id=${FACEBOOK_CLIENT_ID}&redirect_uri=${FACEBOOK_CALLBACK_URL}&client_secret=${FACEBOOK_CLIENT_SECRET}&code=${code}`, {
        method: "GET",
    });
    // console.log(await response.json())
    try {
        const access_token_data = await response.json();
        console.log(access_token_data)
        if (access_token_data.error) {
            throw access_token_data.error
        }
        var accessToken = access_token_data.access_token;
        if (access_token_data.refresh_token) var refreshToken = access_token_data.refresh_token
        var idToken = access_token_data.id_token
        // console.log("Access token: " + accessToken + "\n" + "refreshToken: " + (refreshToken ? refreshToken : '\n') + "Id token: " + idToken);

        //  Getting token information
        var tokenInfoResponse = await fetch(FACEBOOK_TOKEN_INFO_URL + "?access_token=" + accessToken + "&fields=email,picture")
        tokenInfoResponse = await tokenInfoResponse.json()
        var email = tokenInfoResponse.email;
        var profilePic = tokenInfoResponse.picture.data.url;
        console.log(email + profilePic)
        logIn(email, profilePic, { req: req, res: res });
    } catch (error) {
        console.log(error + "This is an error");
    }
}


module.exports = {
    oAuthGoogleCallback,
    oAuthRedirect,
    oAuthFacebookCallback
}

// grace account refresh token 
1//0g86ukboW24eMCgYIARAAGBASNwF-L9IrlqxnVezILNvcIV5uTB_gO3OZOQVcCN6dWFfacxj0LtRST0sD5QhcRrk3tWdLUwdGnWI

//  grace account access token
// ya29.a0AXooCguhxpeIFaZNhFlfOGA1KEf-PcOe-oWdJtFtdrB2-8C1ljgcnkOm1aaj2lypwiF3MY_yTvoQ1RbJrQMWkY-uu24SciYLWBqfrU-kYBlhZOihlYCGGfAN2JgcmY-EAiIj9BV72dx1GGAQnc3nWQ754YFI2Zx249R1aCgYKAXsSARMSFQHGX2MiPOd-mDrLCDVWZgDdRlHlGA0171
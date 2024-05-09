
const mailMessags = {
    loginMessage: {
        title:"Dear {0}",
        body: "Congratulations on successfully registering with Deklarator.\nBelow are your account details: \nUsername: {0} and password: {1}",
    },
    pinMessage :{
        title:"Your Verification PIN Code",
        body:"You have requested a PIN code for verification purposes.\nPlease find your unique PIN code below.\npinCode :{0}"
    },
    reminder :{
        title:"title",
        body:"This is a body"
    } 
};

module.exports = mailMessags;

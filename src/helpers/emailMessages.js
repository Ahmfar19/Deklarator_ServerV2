const mailMessags = {
    loginMessage: {
        title: 'Dear {0}',
        body:
            'Congratulations on successfully registering with Deklarator.\nBelow are your account details: \nUsername: {0} and password: {1}',
    },
    pinMessage: {
        title: 'Your Verification PIN Code',
        body:
            'You have requested a PIN code for verification purposes.\nPlease find your unique PIN code below.\npinCode :{0}',
    },
    reminder: {
        title: 'Påminnelse',
        body: 'This is a body',
    },
    message: {
        title: 'dek_message_failedToSendReminder_title',
        body: 'dek_message_failedToSendReminder_body',
    },
    guestEmail: {
        title: 'Dear {0}',
        body:
            'Congratulations on successfully registering with Deklarator.\nBelow are your account details: \nUsername: {0} \npassword: {1} \n \n for login : https://system.deklarator.se/reporting',
    },
};

module.exports = mailMessags;

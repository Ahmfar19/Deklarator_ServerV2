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
            'Congratulations on successfully registering with Deklarator.\nBelow are your account details:\n \nUsername: {0} \nPassword: {1}\n \nLogin Here: https://system.deklarator.se/reporting',
    },
    employee: {
        title: 'dek_message_newReport',
        body: 'dek_message_newIncomReport',
    },
};

module.exports = mailMessags;

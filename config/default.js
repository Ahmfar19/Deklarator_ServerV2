module.exports = {
    PORT: process.env.PORT || 80,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_USERNAME: process.env.DB_USERNAME || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'deklarator',
    EMAIL_HOST: process.env.EMAIL_HOST || '',
    EMAIL: process.env.EMAIL || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || '',
    ADMIN_EMAIL: 'ahmad996cyc@gmail.com',
    GENERATE_PASSWORD: process.env.GENERATE_PASSWORD,
    CONNECTION_OPTIONS: {
        deklarator: {
            databaseOption: {
                database: 'deklarator',
                password: ''
            },
            AdminEmail: 'ahmad996cyc@gmail.com'
        },
        mcdonalds: {
            databaseOption: {
                database: 'mcdonalds',
                password: ''
            },
            AdminEmail: 'ahmad996cyc@gmail.com'
        },
    }
};

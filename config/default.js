module.exports = {
    PORT: process.env.PORT || 80,
    DB_HOST: process.env.DB_HOST || 'localhost',
    // DB_PORT: process.env.DB_PORT || '80',
    DB_USERNAME: process.env.DB_USERNAME || 'root',
    DB_PASSWORD: process.env.DB_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'deklarator',
    EMAIL_HOST: process.env.EMAIL_HOST || '',
    EMAIL: process.env.EMAIL || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || ''
};



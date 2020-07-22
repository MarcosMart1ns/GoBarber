require('dotenv/config')

module.exports = {
    dialect: 'sqlite',
    storage: process.env.DB_HOST,
    database: process.env.DB_NAME,
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};

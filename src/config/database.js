module.exports = {
    dialect: 'sqlite',
    storage: './src/database/database.sqlite',
    database: 'gobarber',
    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};

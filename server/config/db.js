const { Sequelize } = require('sequelize');


const sequelize = new Sequelize({
    database: 'test',
    username: 'root',
    password: '',
    port : 2811,
    host: 'localhost',
    dialect: 'mysql'
})

sequelize.authenticate().then(() => {
    console.log('connection established')
}).catch((error) => { console.error('unable to connect database', error) })

module.exports = sequelize;
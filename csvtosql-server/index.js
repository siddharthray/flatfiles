const express = require('express');
const app = express();
const cors = require('cors');
const logger = require('morgan');
const { Sequelize } = require('sequelize');

const router = express.Router();
app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3001;

const sequelize = new Sequelize('csvtomysql', 'root', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});

async function start() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
start();

const users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    age: Sequelize.INTEGER
});

router.get('/', function (req, res, next) {
    console.log("Router Working");
    res.end();
})

router.post('/api/csv-upload', async (req, res) => {
    const { csvData } = req.body;
    if (csvData.length < 1 || !csvData) {
        return;
    }
    try {
        const created = await users.bulkCreate(csvData)
        if (created) {
            console.log("saved successfully in databse");
            console.log("created ", created)
            res.send("Ok")
        }
        console.log("not created ", created)

    } catch (err) {
        console.log("bulk create failed with error: ", err)
    }

})
app.use(router);

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
})
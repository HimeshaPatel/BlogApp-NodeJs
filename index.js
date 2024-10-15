const path = require('path')
const express = require('express');
const mongoose = require('mongoose')
const app = express();
const cookieParser = require('cookie-parser')   

const userRoute = require('./routes/user');
const { checkForAuthenticationCookie } = require('./middlewares/aunthentication');

app.use(express.json());

const PORT = 8000;

mongoose.connect('mongodb://localhost:27017/blogify')
.then(e => console.log('Mongo DB Connected'))

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"))

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'));


app.get('/', (req, res) => {
    res.render("home", {
        user: req.user
    })
})

app.use('/user', userRoute)

app.listen(PORT, () => console.log(`Server started at PORT: ${PORT}`));
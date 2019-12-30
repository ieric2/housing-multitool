require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
var routes = require("./routes.js");
const session = require("express-session");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// app.use(function(req, res, next) {
//  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//  next();
// });

// app.use(cors({credentials: true, origin: `${process.env.CORS_ALLOWED}`}));

// Sessions

app.use(cookieParser());
app.use(session({
	secret: process.env.TOKEN_SECRET,
	resave: true,
    saveUninitialized: true,
	cookie: {
		expires: 20 * 60 * 1000,
		secure: false
	}
}))


/* ROUTES */

/* Login and Signup */
app.post('/login', routes.login);
app.post('/signup', routes.signup);

/* Query 1 */
app.post('/recommendCity', routes.recommendCity);

/* Query 2 */
app.get('/priceAndSalesData/:zipcode', routes.priceAndSalesData);

/* Query 3 */
app.post('/similarZipcodes/', routes.similarZipcodes);

/* Query 4 */
app.post('/bestZipcodeInCity', routes.bestZipcodeInCity);

/* Query 5 */
app.post('/currentPriceAndSales', routes.currentPriceAndSales);

/* Query 6 */
app.post('/marketPeakZipcodes', routes.marketPeakZipcodes);

/* Query 7 */
app.post('/topEarningCitiesByState', routes.topEarningCitiesByState);

app.post('/logout', routes.logout);


app.listen(process.env.PORT, () => {
	console.log(`Server listening on PORT ${process.env.PORT}`);
});

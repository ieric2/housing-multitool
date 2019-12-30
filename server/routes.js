const bcrypt = require('bcrypt')
require('dotenv').config();
var mongo_config = require('./config/mongo_config.js');
var jwt = require('jsonwebtoken');
const oracledb = require('oracledb');

const bluebird = require('bluebird');
const redis = require('redis');
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redis_client = redis.createClient();

var db_config = {
    user          : process.env.DB_USERNAME,
    password      : process.env.DB_PASSWORD,
    connectString : process.env.DB_CONNECTSTRING
}

// Query 1
async function recommendCity(req, res) {
    if (!req.session.user) {
      res.json("User not logged in.");
      return;
    }

    req.session.user = req.session.user;

    const population = req.body.population
    const income = req.body.income
    const price = req.body.price

    var query =
      `SELECT * FROM (WITH Latest_Price AS
        (	SELECT zipcode, avg_price
          FROM Zillow_Price
          WHERE year = 2019 AND month = 9),
      Reduced_Price AS
      (SELECT
        C.zipcode,
        C.population,
        C.median_income,
        L.avg_price
      FROM
        Census_Data C INNER JOIN Latest_Price L ON C.zipcode = L.zipcode
      ),
      Reduced_Price_With_City AS
      (SELECT R.zipcode, Z.city, Z.state, R.median_income, R.population, R.avg_price
      FROM
        Reduced_Price R INNER JOIN Zip_City_State Z ON Z.zipcode = R.zipcode)
      SELECT
        zipcode, city, state, median_income, population, avg_price
      FROM
          Reduced_Price_With_City R
      WHERE
          1.5 * R.median_income > ${income} AND
          0.5 * R.median_income < ${income} AND
          1.5 * R.avg_price > ${price} AND
          0.5 * R.avg_price < ${price} AND
          0.5 * R.population < ${population} AND
          1.5 * R.population > ${population}
      ORDER BY ABS((R.median_income - ${income})*(R.avg_price - ${price})*(R.population - ${population})))
      WHERE ROWNUM <=10`

    redis_client.getAsync('recommendCity:'.concat(population).concat("-").concat(income)
      .concat("-").concat(price)).then((cache_data_str, err) => {
        if (err) {
          res.status(500);
          return;
        }
        else if (cache_data_str) {
          res.json(JSON.parse(cache_data_str));
          return;
        }
        else {
          try {
            oracledb.getConnection(db_config).then(conn => {
              return conn.execute(query);
            }).then(result => {
              redis_client.set('recommendCity:'.concat(population).concat("-").concat(income)
                .concat("-").concat(price), JSON.stringify(result.rows), redis.print);
              res.json(result.rows);
            });
          }
          catch (err) {
            console.log('ERROR: failed to get recommendedCity', err);
          }
        }
      });

}

// Query 2
async function similarZipcodes(req, res) {
  if (!req.session.user) {
    res.json("User not logged in.");
    return;
  }

  req.session.user = req.session.user;

  const zipcode = req.body.zipcode;

  var query = `SELECT * FROM
  (SELECT z.zipcode, z.city, z.state, median_income, population, median_age, percent_adult1 + percent_children
  FROM census_data c
  JOIN zip_city_state z ON z.zipcode = c.zipcode
  WHERE c.population >=  0.5 *
    (SELECT population
    FROM census_data
    WHERE zipcode = ${zipcode})
  AND c.population <= 2 *
    (SELECT population
    FROM census_data
    WHERE zipcode = ${zipcode})
  AND c.percent_children + c.percent_adult1 > 0.75 *
    (SELECT percent_adult1 + percent_children
    FROM census_data
    WHERE zipcode = ${zipcode})
  AND c.percent_children + c.percent_adult1 < 1.25 *
    (SELECT percent_adult1 + percent_children
    FROM census_data
    WHERE zipcode = ${zipcode})
  AND c.median_age >= 0.5 *
    (SELECT median_age
    FROM census_data
    WHERE zipcode = ${zipcode})
  AND c.median_age <= 2 *
    (SELECT median_age
    FROM census_data
    WHERE zipcode = ${zipcode})
  AND c.median_income <= 2 *
    (SELECT median_income
    FROM census_data
    WHERE zipcode = ${zipcode})
  AND c.median_income >= 0.5 *
    (SELECT median_income
    FROM census_data
    WHERE zipcode = ${zipcode})
  ORDER BY ABS((population - (SELECT population FROM census_data WHERE zipcode = 10002))/population *
      (median_income - (SELECT median_income FROM census_data WHERE zipcode = 10002))/median_income))
  WHERE zipcode <> ${zipcode} AND ROWNUM <= 10`;

  redis_client.getAsync('similarZipcodes:'.concat(zipcode)).then((cache_data_str, err) => {
    if (err) {
      res.status(500);
      return;
    }
    else if (cache_data_str) {
      res.json(JSON.parse(cache_data_str));
      return;
    }
    else {
      try {
        oracledb.getConnection(db_config).then(conn => {
          return conn.execute(query);
        }).then(result => {
          redis_client.set('similarZipcodes:'.concat(zipcode), JSON.stringify(result.rows), redis.print);
          res.json(result.rows);
        });
      }
      catch (err) {
        console.log('ERROR: failed to get recommendedCity', err);
      }
    }
  });
}

// Query 3
async function priceAndSalesData(req, res) {
  if (!req.session.user) {
    res.json("User not logged in.");
    return;
  }

  req.session.user = req.session.user;

  var zipcode = req.params.zipcode;

  var query =
    `WITH Price_Per_Year AS
    (SELECT Z.ZIPCODE, year, AVG(avg_price) AS average_price
    FROM Zillow_Price Z
    GROUP BY z.zipcode, year)
    SELECT PPY.year, P.population, PPY.average_price
    FROM
    yearly_population_by_zip P INNER JOIN Price_Per_Year PPY ON P.ZIPCODE = PPY.ZIPCODE
    WHERE P.year = PPY.year AND P.zipcode = ${zipcode}
    ORDER BY PPY.year ASC`;

    redis_client.getAsync('priceAndSalesData:'.concat(zipcode)).then((cache_data_str, err) => {
      if (err) {
        res.status(500);
        return;
      }
      else if (cache_data_str) {
        res.json(JSON.parse(cache_data_str));
        return;
      }
      else {
        try {
          oracledb.getConnection(db_config).then(conn => {
            return conn.execute(query);
          }).then(result => {
            redis_client.set('priceAndSalesData:'.concat(zipcode), JSON.stringify(result.rows), redis.print);
            res.json(result.rows);
          });
        }
        catch (err) {
          console.log('ERROR: failed to get recommendedCity', err);
        }
      }
    });
}

// Query 4
async function bestZipcodeInCity(req, res) {
  if (!req.session.user) {
    res.json("User not logged in.");
    return;
  }

  req.session.user = req.session.user;

  var city = req.body.city

  var query =
    `
    SELECT * FROM
    (SELECT z.zipcode, s.num_sales, p.avg_price, c.median_income, z.city
        FROM census_data c JOIN zip_city_state z ON c.zipcode = z.zipcode
        JOIN Zillow_Sales s ON c.zipcode = s.zipcode
        JOIN Zillow_Price p ON s.zipcode = p.zipcode AND s.year = p.year AND s.month = p.month
        WHERE UTL_MATCH.edit_distance(z.city, '${city}') < 3
        AND s.year = 2019
        AND s.month = 4
        AND s.num_sales IS NOT NULL
        ORDER BY s.num_sales DESC, UTL_MATCH.edit_distance(z.city, '${city}') DESC)
    WHERE ROWNUM <= 10
    `;

    redis_client.getAsync('bestZipcodeCity:'.concat(city)).then((cache_data_str, err) => {
      if (err) {
        res.status(500);
        return;
      }
      else if (cache_data_str) {
        res.json(JSON.parse(cache_data_str));
        return;
      }
      else {
        try {
          oracledb.getConnection(db_config).then(conn => {
            return conn.execute(query);
          }).then(result => {
            redis_client.set('bestZipcodeCity:'.concat(city), JSON.stringify(result.rows), redis.print);
            res.json(result.rows);
          });
        }
        catch (err) {
          console.log('ERROR: failed to get recommendedCity', err);
        }
      }
    });
}

// Query 5
async function currentPriceAndSales(req, res) {
  if (!req.session.user) {
    res.json("User not logged in.");
    return;
  }

  req.session.user = req.session.user;

  var zipcode = req.body.zipcode

  var query =
    `WITH Avg_Price AS (SELECT zipcode, AVG(avg_price) AS average_price
    FROM Zillow_Price
    WHERE zipcode = ${zipcode}
    GROUP BY zipcode),
    Current_Price AS (SELECT zipcode, avg_price AS current_price
    FROM Zillow_Price
    WHERE zillow_price.year = 2019 AND
    	zillow_price.month = 9 AND
    	zipcode = ${zipcode}),
    Avg_Sales AS (SELECT zipcode, AVG(num_sales) AS avg_sales
    FROM Zillow_Sales
    WHERE zipcode = ${zipcode}
    GROUP BY zipcode),
    Current_Sales AS
    (SELECT	zipcode, num_sales
    FROM Zillow_Sales
    WHERE zipcode = ${zipcode} AND	Zillow_Sales.month = 9 AND
    	Zillow_Sales.year = 2019),
    Join_1_2 AS
    (SELECT A.zipcode as zipcode, average_price, current_price
    FROM
    	Avg_Price A INNER JOIN Current_Price C ON A.zipcode = C.zipcode),
    Join_3_4 AS
    (SELECT A.zipcode as zipcode, avg_sales, num_sales
    FROM
    	Avg_Sales A INNER JOIN Current_Sales C ON A.zipcode = C.zipcode)
    SELECT
    	Join_1_2.average_price,
    	Join_1_2.current_price,
    	Join_3_4.avg_sales,
    	Join_3_4.num_sales
    FROM
    	Join_1_2 JOIN Join_3_4 ON Join_1_2.ZIPCODE = Join_3_4.ZIPCODE`


      redis_client.getAsync('currentPriceAndSales:'.concat(zipcode)).then((cache_data_str, err) => {
        if (err) {
          res.status(500);
          return;
        }
        else if (cache_data_str) {
          res.json(JSON.parse(cache_data_str));
          return;
        }
        else {
          try {
            oracledb.getConnection(db_config).then(conn => {
              return conn.execute(query);
            }).then(result => {
              redis_client.set('currentPriceAndSales:'.concat(zipcode), JSON.stringify(result.rows), redis.print);
              res.json(result.rows);
            });
          }
          catch (err) {
            console.log('ERROR: failed to get recommendedCity', err);
          }
        }
      });
}

// Query 6
async function marketPeakZipcodes(req, res) {
  if (!req.session.user) {
    res.json("User not logged in.");
    return;
  }

  req.session.user = req.session.user;

  var year = req.body.year
  var month = req.body.month

  var query =
    `WITH zp AS(
    SELECT zp.zipcode, avg_price
    FROM Zillow_Price zp
    WHERE zp.year=${year} AND zp.month=${month} AND zp.avg_price >= ALL(
        SELECT zp1.avg_price
        FROM Zillow_Price zp1
        WHERE zp1.zipcode=zp.zipcode)
    )
    SELECT zs.zipcode, zcs.city, zcs.state, num_sales, avg_price
    FROM Zillow_Sales zs
    JOIN zp ON zs.zipcode = zp.zipcode
    JOIN Zip_City_State zcs ON zcs.zipcode=zs.zipcode
    WHERE zs.year=${year} AND zs.month=${month} AND zs.num_sales >= ALL(
        SELECT zs1.num_sales
        FROM Zillow_Sales zs1
        WHERE zs1.zipcode=zs.zipcode)
    `;

    redis_client.getAsync('marketPeakZipcodes:'.concat(year).concat("-").concat(month)).then((cache_data_str, err) => {
      if (err) {
        res.status(500);
        return;
      }
      else if (cache_data_str) {
        res.json(JSON.parse(cache_data_str));
        return;
      }
      else {
        try {
          oracledb.getConnection(db_config).then(conn => {
            return conn.execute(query);
          }).then(result => {
            redis_client.set('marketPeakZipcodes:'.concat(year).concat("-").concat(month), JSON.stringify(result.rows), redis.print);
            res.json(result.rows);
          });
        }
        catch (err) {
          console.log('ERROR: failed to get recommendedCity', err);
        }
      }
    });
}

// Query 7
async function topEarningCitiesByState(req, res) {
  if (!req.session.user) {
    res.json("User not logged in.");
    return;
  }

  req.session.user = req.session.user;

  var state = req.body.state;

  var query =
  `WITH income_by_city AS (
    SELECT zcs.zipcode, zcs.state, zcs.city, cd.median_income, PERCENT_RANK()
      OVER (PARTITION BY state ORDER BY median_income DESC) as percentile
    FROM Zip_City_State zcs JOIN CENSUS_DATA cd ON zcs.zipcode=cd.zipcode
    WHERE zcs.state = '${state}'
    AND median_income IS NOT NULL
    )
    SELECT city, zipcode, median_income
    FROM income_by_city
    WHERE percentile < 0.05
    ORDER BY median_income DESC`

  redis_client.getAsync('topEarningCitiesByState:'.concat(state)).then((cache_data_str, err) => {
    if (err) {
      res.status(500);
      return;

    }
    else if (cache_data_str) {
      res.json(JSON.parse(cache_data_str));
      return;
    }
    else {
      try {
        oracledb.getConnection(db_config).then(conn => {
          return conn.execute(query);
        }).then(result => {
          redis_client.set('topEarningCitiesByState:'.concat(state), JSON.stringify(result.rows), redis.print);
          res.json(result.rows);
        });
      }
      catch (err) {
        console.log('ERROR: failed to get recommendedCity', err);
      }
    }
  });
}

/* Login and Authentication */
var login_route = async function(req, res) {

	const username = req.body.username;
	const plainTextPassword = req.body.password;

  console.log(username)
  console.log(plainTextPassword)

	const db = await mongo_config.get_db();
	db.collection('user').findOne({'username': username}, function(err, doc) {
		if (err) {
			res.status(500).send("Error searching Mongo.");
		}
		else if (!doc) {
				res.send("User not found.");
		}
		else {
			bcrypt.compare(plainTextPassword, doc.password, function(err, result) {
				if (err) {
					res.status(500).send("Error creating hash.");
				}
				else if (!result) {
					res.send("Password does not match.");
				}
				else {
					req.session.user = username;
          console.log(req.session.user);
          res.send("Successful login.");
				}
			});
		}
	});
}

var signup_route = async function(req, res) {
	const username = req.body.username;
	const plainTextPassword = req.body.password;

	const db = await mongo_config.get_db();
	db.collection('user').findOne({'username': username}, function(err, doc) {
		if (err) {
			res.status(500).send("MongoDB error.");
		}
		else if (doc) {
			res.send("Username already exists.");
		}
		else {
			const saltRounds = parseInt(process.env.SALT_ROUNDS);
			bcrypt.hash(plainTextPassword, saltRounds, async function(err, hash) {
				if (err) {
					res.status(500).send("Error creating hash.");
				}
				else {
					db.collection('user').insert({username: username, password: hash}, function(err, result) {
						if (err) {
							res.status(500).send("Error inserting into MongoDB.");
						}
						else {
							req.session.user = username;
              res.send("Successful signup.");
						}
					});
				}
			});
		}
	});
}

var logout_route = function(req, res) {
  req.session.user = undefined;
  res.send('Logged out.');
}

module.exports = {
	login: login_route,
	signup: signup_route,
  recommendCity: recommendCity,
  priceAndSalesData: priceAndSalesData,
  similarZipcodes: similarZipcodes,
  bestZipcodeInCity: bestZipcodeInCity,
  currentPriceAndSales: currentPriceAndSales,
  marketPeakZipcodes: marketPeakZipcodes,
  topEarningCitiesByState: topEarningCitiesByState,
  logout: logout_route
};

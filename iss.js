// index.js

// The code below is temporary and can be commented out.
const request = require("request");

const fetchMyIP = function(callback) {
  const address = "https://api.ipify.org?format=json";
  request(address, (error, response, body) => {
    //request accessing the error, response and body from the website we put in address
    if (error) {
      return callback(`Error: ${error}`, null);
    }
    if (response.statusCode !== 200) {
      callback(
        Error(`Status Code ${response.statusCode} when fetching IP: ${body}`),
        null
      );
      return;
    }
    const ip = JSON.parse(body).ip;
    // data = json.parse(body) is taking the body of the website to convert it into an object

    return callback(null, ip);
  });
};

fetchCoordsByIP = (ip, callback) => {
  const address = `http://ipwho.is/${ip}`;

  request(address, (error, response, body) => {
    if (error) return callback(`error: ${error}`, null);

    if (response.statusCode !== 200) {
      callback(
        Error(`Status Code ${response.statusCode} when fetching IP: ${body}`),
        null
      );
      return;
    }
    const data = JSON.parse(body);
    // check if "success" is true or not
    if (!data.success) {
      const message = `Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${data.ip}`;
      callback(Error(message), null);
      return;
    }

    const { latitude, longitude } = data;
    return callback(null, { latitude, longitude });
  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  const address = `https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`;

  request(address, (error, response, body) => {
    if (error) return callback(`Error: ${error}`, null);

    if (body === 'invalid coordinates') return callback('Error: Invalid Coordinates.');

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching IP: ${body}`), null);
      return;
      
    

      
    }

    const flyOverTimes = JSON.parse(body).response;

    return callback(null, flyOverTimes);
  });
};

const nextISSTimesForMyLocation = callBack => {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback("It didnt work!", error)
    }
    
  
    fetchCoordsByIP(ip, (error, data) => {
      if (error) {
        return callback("It didnt work!", error)
      }
      console.log(`My coordinates are ${data}`);
  
      fetchISSFlyOverTimes(data, (error, data) => {
        if (error) {
          return callback("It didnt work!", error)
        }
        return callBack(null, data)
      });
    });
  });
  }



module.exports = { nextISSTimesForMyLocation };



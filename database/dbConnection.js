const mysql = require("mysql");

//When setting up MySQL use the below information
const con = mysql.createConnection({
  host: "34.27.144.22",
  user: "root",
  password: "%%56Hu3#PB:zdy%D",
  database: "ti_workshop_bashir",
  port: 3306,
});
con.connect((error) => {
  if (error) {
    console.log("Failed to connect to Database", error);
  } else {
    console.log("Connected to Database");
  }
});
module.exports = con;

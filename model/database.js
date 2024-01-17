const mysql2 = require("mysql2");

const con = mysql2.createPool({
    host:"localhost",
    user:"root",
    password:"Anis@3474",
    database: "to_do_list"
}).promise();

con.getConnection((err)=>{
    if(err) throw err;
    console.log("Connection Successful");
});

module.exports = con;
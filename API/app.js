require('babel-register')
require('dotenv').config();

const bodyParser = require('body-parser')
const express = require('express')


const path = require('path')
const helmet = require('helmet')
const morgan = require('morgan')('combined')
const config = require('./assets/config')

const router = require('express').Router();


const { exec } = require("child_process");
const fs = require('fs');
const { stdout } = require('process');

// Connection à la base de donnée


console.log('Connected')

const app = express()


app.set('Secret', config.secret)

app.use(helmet())
app.use(morgan)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('build'))

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});



//get user

app.get(config.rootAPI + 'get/user', (req, res) => {

})

//post user

app.post(config.rootAPI + '/john', (req, res) => {
  fs.writeFile("./tmp/johnhash.txt", req.body.hash, function(err){
    if(err){
      console.log('Erreur création de fichier : ', err);
    } else {
      exec("john ./tmp/johnhash.txt ", (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        res.send(stdout);
      });
    }
    
  });
  
})

//delete user

app.delete(config.rootAPI + 'delete/user', (req, res) => {

})

//update user

app.patch(config.rootAPI + 'update/user', (req, res) => {
  console.log(req.body)
})





// Démarrage de l'application

app.listen(config.port, () => console.log(`App running on port ${config.port}!`))


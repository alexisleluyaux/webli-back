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

ValidIpAddressRegex = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$";
ValidHostnameRegex = "^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$";
const regexIpDetector = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi;


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

//post john hash

app.post(config.rootAPI + '/john', (req, res) => {
  fs.writeFile("./tmp/johnhash.txt", req.body.hash, function(err){
    if(err){
      console.log('Erreur création de fichier : ', err);
    } else {
      exec("john ./tmp/johnhash.txt ", (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          res.send(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          res.send(`stderr: ${stderr}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        res.send(stdout);
      });
    }
    
  });
  
})

//post nmap ip/domain

app.post(config.rootAPI + '/nmap', (req, res) => {
  console.log('Commande à executer: ', `nmap -T4 -A -v ${req.body.ipOrDomain}| awk '$1 ~ /^[0-9]/'`)
      exec(`nmap -T4 -A -v ${req.body.ipOrDomain}| awk '$1 ~ /^[0-9]/'`, (error, stdout, stderr) => {
        if (error) {
          console.log('Error: ', error.message)
          res.send(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          res.send(`stderr: ${stderr}`);
          return;
        }
        console.log(`Resp: ${stdout}`);
        res.send(stdout);
      });
})

//post sqlmap ip/domain

app.post(config.rootAPI + '/sqlmap', (req, res) => {
  console.log('Commande à executer: ', `sqlmap -u ${req.body.ipOrDomain}`)
  exec(`sqlmap -u ${req.body.ipOrDomain}`, (error, stdout, stderr) => {
    if (error) {
      console.log('Error: ', error.message)
      res.send(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      res.send(`stderr: ${stderr}`);
      return;
    }
    console.log(`Resp: ${stdout}`);
    res.send(stdout);
  });
})

//post dnsscan ip/domain

app.post(config.rootAPI + '/dnsscan', (req, res) => {
  console.log('Commande à executer: ', `dnsenum ${req.body.ipOrDomain}`)
  exec(`dig ${req.body.ipOrDomain}`, (error, stdout, stderr) => {
    if (error) {
      console.log('Error: ', error.message)
      res.send(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      res.send(`stderr: ${stderr}`);
      return;
    }
    console.log(`Resp: ${stdout}`);
    res.send(stdout);
  });
})

//post wpscan ip/domain

app.post(config.rootAPI + '/wpscan', (req, res) => {
  console.log('Commande à executer: ', `wpscan --url ${req.body.ipOrDomain}`)
  exec(`wpscan --url ${req.body.ipOrDomain}`, (error, stdout, stderr) => {
    if (error) {
      console.log('Error: ', error.message)
      res.send(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      res.send(`stderr: ${stderr}`);
      return;
    }
    console.log(`Resp: ${stdout}`);
    res.send(stdout);
  });
})

//post ddos ip/domain

app.post(config.rootAPI + '/ddos', (req, res) => {
  console.log('Commande à executer: ', `wpscan --url ${req.body.ipOrDomain}`)
  exec(`hping3 -i u1 -S -p 80 -c ${req.body.numberOfPaquets} ${req.body.ipOrDomain}`, (error, stdout, stderr) => {
    if (error) {
      console.log('Error: ', error.message)
      res.send(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      res.send(`stderr: ${stderr}`);
      return;
    }
    console.log(`Resp: ${stdout}`);
    res.send(stdout);
  });
})

//post url extractor ip/domain

app.post(config.rootAPI + '/urlextractor', (req, res) => {
  let matchDomainReggex = req.body.ipOrDomain.match(ValidHostnameRegex)
  let matchIpReggex = req.body.ipOrDomain.match(ValidIpAddressRegex)
  let isAValidIpOrDomain = true
  let ipOrDomain = ''
  if(matchDomainReggex === null && matchIpReggex === null){
    isAValidIpOrDomain= false
  }
  if(isAValidIpOrDomain){
    let isAnIpAdress = false
    if(matchIpReggex!==null){
      isAnIpAdress = regexIpDetector.test(matchIpReggex)
    }
    if(isAnIpAdress){
      ipOrDomain= matchIpReggex
    }
    else{
      ipOrDomain= matchDomainReggex
    }
  }
  else{
    res.send('Neither Ipv4 IP Adress or hostname detected.')
  }
  console.log('Commande à executer: ', `/URLextract/URLextractor/extractor.sh ${ipOrDomain}`)
  exec(`cd /home/webli-back/URLextract/URLextractor/ ; ./extractor.sh ${ipOrDomain}`, (error, stdout, stderr) => {
    if (error) {
      console.log('Error: ', error.message)
      res.send(`error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      res.send(`stderr: ${stderr}`);
      return;
    }
    console.log(`Resp: ${stdout}`);
    res.send(stdout);
  });
})

// Démarrage de l'application

app.listen(config.port, () => console.log(`App running on port ${config.port}!`))


var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.body['url'])
  axios.get(req.body['url'])
  .then((response) => {
    // handle success        
    res.status(200).json(response.data);              
    })
  .catch((error) => {
     // handle errors
     console.log(error)
    res.status(400).json(error.response)        
  }) 
  // res.render('index', { title: 'Express' });
});


router.post('/', (req, res, next) => {     
console.log()
  if (req.body['type'] == "load") {
    axios.get(req.body['url'])
    .then((response) => {
    // handle success        
    res.status(200).json(response.data);              
    })
    .catch((error) => {
     // handle error
    console.log(error) 
    res.status(400).json(error.response)        
  }) 
  } else if (req.body['type'] == "new") {
    axios.post(req.body['url'], {service:req.body['service'], network:req.body['network'], image:req.body['image'], envProcess:req.body['envProcess']})
    .then((response) => {
    // handle success        
    res.status(200).json(response.data);              
    })
    .catch((error) => {
     // handle error
    console.log(error)
    res.status(400).json(error.response)        
  }) 
  } 
  
});
router.delete('/', (req, res, next) => {
  var funct = req.body['functionName']
  axios.delete(req.body['url'], {data: {functionName: funct} })
  .then((response) => {
    // handle success    
    res.status(200).json(response.data);         
    
  })
  .catch((error) => {
    //handle error   
    res.status(400).json(error.response)        
  }) 
});

router.put('/', (req, res, next) => {  
  
  axios.put(req.body['url'], {service:req.body['service'], network:req.body['network'], image:req.body['image'], envProcess:req.body['envProcess']})
  .then((response) => {
    // handle success    
    res.status(200).json(response.data);              
    
  })
  .catch((error) => {
    // handle error    
    res.status(400).json(error)        
  }) 
});
module.exports = router;

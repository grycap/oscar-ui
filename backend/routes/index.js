var express = require('express');
var router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/', (req, res, next) => {
  
      // var data = [];
      // req.on('data', function(body){
      //     console.log(body)
      // })
      console.log(req.body['url'])
      axios.get(req.body['url'])
      .then((response) => {
        // handle success
        res.status(200).json(response.data);              
        
      })
      .catch((error) => {
        // handle error
        res.status(400).json(error.response.data)        
      }) 
});
module.exports = router;

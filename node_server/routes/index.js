var express = require('express');
var router = express.Router();
const axios = require('axios');
var Minio = require ('minio');
let multer = require('multer');
let upload = multer();
var fs = require ('fs');
var archiver = require('archiver');
var path = require('path');
const download = require('download');

var app = express();

/************************OPENFAAS*******************************/
/* GET home page. */

router.get('/', function(req, res, next) {
   res.render('index', { title: 'Express' });
});

router.post('/chargeurl', function(req, res, next) { 

var url = req.body["url"] 
download(url).then(data => {
    var filename = url.split("/");
    fs.writeFileSync(path.join(__dirname,filename[filename.length-1]), data);
    fs.readFile(path.join(__dirname,filename[filename.length-1]), 'utf8', function(err, data) {  
      if (err) throw err;      
      res.write(data)
      res.end()
  });
  fs.unlinkSync(path.join(__dirname,'/',filename[filename.length-1]), function(error){
    if (error){
    throw error;
    }
    console.log("Delete success")    
  })
}); 
});


router.post('/newfaas', (req, res, next) => {  
var params = {name:req.body['service'], 
network:req.body['network'], 
image:req.body['image'], 
// envProcess:req.body['envProcess'], 
script:req.body['script'],
annotations: req.body['annotations'],
constraints: req.body['constraints'],
envVars: req.body['envVars'],
limits: req.body['limits'],
labels: req.body['labels'],
registryAuth: req.body['registryAuth'],
requests: req.body['requests'],
secrets: req.body['secrets']
}
console.log(params)
axios.post(
  req.body['url'], 
  {name:req.body['service'], 
  network:req.body['network'], 
  image:req.body['image'], 
  // envProcess:req.body['envProcess'], 
  script:req.body['script'],
  annotations: req.body['annotations'],
  constraints: req.body['constraints'],
  envVars: req.body['envVars'],
  limits: req.body['limits'],
  labels: req.body['labels'],
  registryAuth: req.body['registryAuth'],
  requests: req.body['requests'],
  secrets: req.body['secrets']
})
    .then((response) => {
    // handle success        
    res.status(200).json(response.data);              
    })
    .catch((error) => {   
    var err = error.response.data
    console.log(err)
    res.status(400).json(err)        
  }) 
});

router.post('/loadfaas', (req, res, next) => {     

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
  
});
router.delete('/deletefaas', (req, res, next) => {
  var funct = req.body['functionName']
  axios.delete(req.body['url'], {data: {name: funct} })
  .then((response) => {
    // handle success    
    res.status(200).json(response.data);         
    
  })
  .catch((error) => {
    //handle error   
    res.status(400).json(error.response)        
  }) 
});

router.put('/editfaas', (req, res, next) => {  
  
  axios.put(req.body['url'], 
  {name:req.body['service'], 
  network:req.body['network'], 
  image:req.body['image'], 
  // envProcess:req.body['envProcess'], 
  script:req.body['script'],
  annotations: req.body['annotations'],
  constraints: req.body['constraints'],
  envVars: req.body['envVars'],
  limits: req.body['limits'],
  labels: req.body['labels'],
  registryAuth: req.body['registryAuth'],
  requests: req.body['requests'],
  secrets: req.body['secrets']
})
  .then((response) => {
    // handle success    
    res.status(200).json(response.data);              
    
  })
  .catch((error) => {
    // handle error    
    res.status(400).json(error)        
  }) 
});


/************************MINIO*******************************/
minioClient = "";
console.log(minioClient)

var minioClient = new Minio.Client({
  endPoint: 'minio-service.minio',    
  port: 9000,   
  useSSL: false,
  accessKey: "$MINIO_ACCESS_KEY",
  secretKey: "$MINIO_SECRET_KEY"
});

router.post('/listbuckets', (req, res, next) => { 
  console.log("buckets")    
      minioClient.listBuckets((err, buckets) => {
        // if (err) return res.status(400).json(err)
        if (err) return res.status(400).json(err)
        res.status(200).json(buckets);        
        
      })
  }); 

router.post('/bucketExists', (req, res, next) => {        
      minioClient.bucketExists(req.body["name"], function(err, exists) {
        if (err) return res.status(400).json(err)        
        res.status(200).json(exists);        
          
      })
  }); 

router.post('/removeFile', (req, res, next) => { 
      console.log(req.body["fileName"])     
      console.log(req.body["bucketName"]) 
       
      var objectList = [];
      objectList = req.body["fileName"]
      console.log(objectList)
      for  (var i=0; i < objectList.length; i++) {
      minioClient.removeObject(req.body["bucketName"], objectList[i], function(err, exists) {
        if (err){ 
        console.log(err)
        res.status(400).json(err)            
        }else{
        res.status(200).json(exists);        
        }
            
      })
    }
  }); 

router.post('/makeBucket', (req, res, next) => {          
    minioClient.makeBucket(req.body["name"], function(err, exists) {
      console.log(exists)
      if (err) return res.status(400).json(err)            
      res.status(200).json(exists);        
          
    })
}); 

router.post('/removeBucket', (req, res, next) => {          
  minioClient.removeBucket(req.body["name"], function(err, exists) {
    
    if (err) return res.status(400).json(err)            
    res.status(200).json(exists);        
        
  })
});

router.post('/listObjects', (req, res, next) => {  
  console.log(req.body["name"])        
  let stream= minioClient.listObjects(req.body["name"], '', true) 
    
    var funct = {
      err : "",
      files: []
    };
    var files = [];
    stream.on('data', function(obj) 
    {       
      funct.files.push(obj);
      
    })    
    stream.on('error', function(err) 
    {       
      funct["err"] = err;
      console.log(err);
    })
    stream.on('end', function(e) 
    {       
      res.status(200).json(funct);
    })
    
    
});



router.post('/minioUpload', upload.any(), (req, res, next) => {   
  var file = req.files; 

   minioClient.putObject(req.body["bucketName"],file[0].originalname,file[0].buffer, function(err, data) {
      if (err){
       console.log(err)
       res.status(400).json({key: req.body["key"], err : err, name : file[0].originalname})
      }else{   
      console.log(data)
       res.status(200).json({
            key: req.body["key"], 
            // etag: data.ETag.replace(/[^A-Z0-9]+/ig, ""), 
            etag: data, 
            name : file[0].originalname
        });
      }
});
    
    
});

router.post('/downloadFile', (req, res, next) => {   
  console.log(req.body["bucketName"])
  console.log(req.body["fileName"]) 
  console.log(req.body["fileName"].length)
  var data = {};
  
  if(req.body["select"]==1){
  for  (var i=0; i < req.body["fileName"].length; i++) {
    minioClient.getObject(req.body["bucketName"], req.body["fileName"][i], function(error, stream) {
    if(error) {
       console.log(error)
        return res.status(500).send(error);
    }
    console.log('sucess')    
    stream.pipe(res)   
    });   
  }
  }else{
    nextFile(0,req,res)
  }

});
function nextFile(i, req, res){  
	minioClient.fGetObject(req.body["bucketName"], req.body["fileName"][i], path.join(__dirname , '/' ,req.body["fileName"][i]), function(err) {
        if (err) {
          return console.log(err)
        } 
        
      if(i < req.body["fileName"].length - 1){
			nextFile(i+1, req, res)
		}else{
			zipFile(req, res);
		}
        
	})
} 

function zipFile(req, res){
	/*Compress files*/ 
	var archive = archiver('zip');
	archive.on('error', function(err) {
	  res.status(500).send({error: err.message});
	});
	//on stream closed we can end the request
	archive.on('end', function() {
	  console.log('Archive wrote %d bytes', archive.pointer());
	  /*Delete files */
	  for  (var i=0; i < req.body["fileName"].length; i++){
		fs.unlinkSync(path.join(__dirname + '/' + req.body["fileName"][i]), function(error){
		  if (error){
			throw error;
		  }
		  console.log("Delete success")    
		})
	  }
	  download_finish = false
	});
	archive.pipe(res);  
	// add a file
	for  (var i=0; i < req.body["fileName"].length; i++){
		archive.file(path.join(__dirname, req.body["fileName"][i]), { name: req.body["fileName"][i] });
	}
	archive.finalize();
}

module.exports = router;

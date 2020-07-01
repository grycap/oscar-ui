import JSZip from "jszip";
import JSZipUtils from "jszip-utils"
export default {
    data: () => {
		return {
            api: 'http://158.42.105.147:30301',  
            minioClient: '',          
		}
    },
    created(){
        var Minio = require('minio')
        this.minioClient = new Minio.Client({
            endPoint: '158.42.105.147',    
            port: 30300,   
            useSSL: true,
            accessKey: "minio",
            secretKey: "M2CvXmUjVbm1q5aIVumS"
        });
        this.minioClient.setRequestOptions({rejectUnauthorized: false})
    },
    methods: {
        //ApiCalls
        listServicesCall(callBackHandler) {
            axios({
                method: 'get',
                url: this.api+'/system/services',
                auth: {
                    username: 'admin',
                    password: 'password'
                }
            }).then(function (response) {
                callBackHandler(response.data);
            }.bind(this)).catch(function (error) {
                callBackHandler(error);
            })
        },
        deleteServiceCall(params, callBackHandler) {
            axios({
                method: 'delete',
                url: this.api + '/system/services/'+params,
                auth: {
                    username: 'admin',
                    password: 'password'
                },
                data:params,
            }).then(function (response) {
                callBackHandler(response);
            }.bind(this)).catch(function (error) {
                callBackHandler(error);
            })
        },
        listJobsCall(serviceName,callBackHandler) {
            axios({
                method: 'get',
                url: this.api+'/system/logs/'+serviceName,
                auth: {
                    username: 'admin',
                    password: 'password'
                }
            }).then(function (response) {
                callBackHandler(response.data);
            }.bind(this)).catch(function (error) {
                callBackHandler(error);
            })
        },
        deleteJobCall(params, callBackHandler) {
            axios({
                method: 'delete',
                url: this.ai + '/system/logs/'+params.serviceName+'/'+params.jobName,
                auth: {
                    username: 'admin',
                    password: 'password'
                },
                data:params,
            }).then(function (response) {
                callBackHandler("success");
            }.bind(this)).catch(function (error) {
                callBackHandler(error);
            })
        },
        listJobNameCall(params,callBackHandler) {
            axios({
                method: 'get',
                url: this.api+'/system/logs/'+params.serviceName+'/'+params.jobName,
                auth: {
                    username: 'admin',
                    password: 'password'
                }
            }).then(function (response) {
                callBackHandler(response.data);
            }.bind(this)).catch(function (error) {
                callBackHandler(error);
            })
        },
        deleteAllJobCall(params,callBackHandler) {
            axios({
                method: 'delete',
                url: this.api+'/system/logs/'+params,
                auth: {
                    username: 'admin',
                    password: 'password'
                }
            }).then(function (response) {
                callBackHandler(response);
            }.bind(this)).catch(function (error) {
                callBackHandler(error);
            })
        },

        createServiceCall(params, callBackHandler){
            axios({
                method: 'post',
                url: this.api+'/system/services',
                auth: {
                    username: 'admin',
                    password: 'password'
                },
                data: params
            }).then(function(response){
                callBackHandler(response)
            }).catch(function(error){
                callBackHandler(error)
            })
        },

        editServiceCall(params, callBackHandler){
            axios({
                method: 'put',
                url: this.api+'/system/services',
                auth: {
                    username: 'admin',
                    password: 'password'
                },
                data: params
            }).then(function(response){
                callBackHandler(response)
            }).catch(function(error){
                callBackHandler(error)
            })
        },
        //******Minio's Call********/
        
        getBucketListCall(callBackHandler){

            this.minioClient.listBuckets((err, buckets) => {
                if (err) {
                    callBackHandler(err)
                }else{
                    callBackHandler(buckets)
                }
                
            })
        },

        createBucketCall(params,callBackHandler){
            this.minioClient.makeBucket(params.name, function(err, exists) {
                if (err) {
                    callBackHandler(err)
                }else{
                    callBackHandler("success")       
                }         
                    
            })
        },

        bucketExistCall(params,callBackHandler){
            this.minioClient.bucketExists(params.name, function(err, exists) {
                if (err){
                    callBackHandler(err)
                    window.getApp.$emit('APP_SHOW_SNACKBAR', {
                        text: err.message,
                        color: 'error'
                    })
                }else{
                    // res.status(200).json(exists);        
                    callBackHandler('success')
                }        
                    
            })
        },

        getBucketFilesCall(params, callBackHandler){
            let stream = this.minioClient.listObjects(params.name, params.prefix, true,) 
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
            })
            stream.on('end', function(e) 
            {       
                callBackHandler(funct);
            })
        },
        previewFileCall(params,callBackHandler){  
            this.minioClient.presignedUrl('GET',params.bucketName, params.fileName, 30000, function(err, presignedUrl) {
                if (err){
                    callBackHandler(err)
                }else{
                    callBackHandler(presignedUrl)
                   
                }
               
              })
            
        },
        urlToPromise(url) {
            return new Promise(function(resolve, reject) {
                JSZipUtils.getBinaryContent(url, function (err, data) {
                    if(err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });
        },
        downloadFileCall(params,callBackHandler){   
            var _this = this     
            if (params.select == 1){
                this.minioClient.presignedGetObject(params.bucketName, params.fileName[0], 1500, function(err, presignedUrl) {
                    if (err){
                        callBackHandler(err)
                    }else{
                        axios({url:presignedUrl,method:'GET',responseType: params.response_type})
                        .then(response => {
                            callBackHandler(response)
                        })
                    }
                })
            }else {
                    let zip = new JSZip();
                    let folder = zip.folder('collection');
                    for (let i = 0; i < params.select; i++) {
                        console.log(params.fileName[i])
                        this.minioClient.presignedGetObject(params.bucketName, params.fileName[i], 30000, function(err, presignedUrl) {
                             if (err){
                                callBackHandler(err)
                             }else{
                                // Fetch the image and parse the response stream as a blob
                                var name = params.fileName[i].substr(params.fileName[i].lastIndexOf('/') + 1);
                                folder.file(name, _this.urlToPromise(presignedUrl), {binary:true});
                            }
                        })                                           
                    }

                    callBackHandler(folder)
                }
        },
        uploadFileCall(params, callBackHandler){
            this.minioClient.presignedPutObject(params.bucketName, params.file_name, 24*60*60, function(err, presignedUrl) {
                if (err) return console.log(err)
                console.log(presignedUrl)
                fetch(presignedUrl, {
                    method: 'PUT',
                    body: params.file
                }).then(() => {
                   callBackHandler('uploaded')
                }).catch((e) => {
                   callBackHandler(e)
                });
            })
        },
        removeFileCall(params,callBackHandler){
            var objectList = [];
            objectList = params.fileName
            console.log(objectList)
            for(var i=0; i < objectList.length; i++) {
                this.minioClient.removeObject(params.bucketName, objectList[i], function(err, exists) {
                    if (err){ 
                        callBackHandler(error)          
                    }else{
                        callBackHandler("success");        
                    }
                        
                })
            }

        },

        removeBucketCall(params,callBackHandler){
            console.log(params)
            this.minioClient.removeBucket(params, function(err, exists) {    
                if (err){
                    callBackHandler(err)
                }else{
                    callBackHandler('success');        
                }             
                    
            })
        },
    }
}
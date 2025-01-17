const AWS = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config();
const s3 = new AWS.S3();

(async() =>{
    await s3.putObject({
        Body: "hello world",
        Bucket: "discover-arch-post",
        Key: "Happu_Singh_2.jpg"
    }).promise();
})();

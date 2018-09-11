const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const result = require('dotenv').config();
const employeeRoutes = require('./routes/EmployeeRoute');
const https = require('https');
const app = new express();
app.listen(process.env.PORT);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
    extended: false
}));

mongoose
    .connect(process.env.DBURI, {
        useNewUrlParser: true
    })
    .then(() => console.log("DB connected successfully."))
    .catch((err) => console.log(`ERROR : ${err}`));


app.use('/api/employee', employeeRoutes);

app.use('/ping', (req, res) => {
    res.status(200).send({
        "msg": "ok"
    })
});


function sleep(millis) {
    return new Promise(async resolve => await setTimeout(resolve, millis));
}
const checkWaterMark = (location, fileName) => {
    return new Promise((resolve, reject) => {
        //logger.info("AWSUtility:CheckWaterMark");
        console.log("in water mark");
        try {

            let isWaterMark = [];

            //logger.error("fhsdfgdsufgdsufgsufgsdf_inside Map");
            let PATH = "/vision/v1/segmentation?model_id=re_logo&image_url=" + location + "&client_key=24141322fabb520a5cfc2342092038815573fab1c14de23acb7ba42815c80102"
            let responseBody = "";
            const options = {
                hostname: 'api-us.restb.ai',
                port: 443,
                path: PATH,
                method: "GET",
            };

            var req = https.request(options, (response) => {
                response.on("data", (d) => {
                    responseBody += d;
                });
                response.on("end", function () {
                    let waterMarkRes = JSON.parse(responseBody);
                    console.log(waterMarkRes);
                    //logger.error("This is in waterMark")
                    let isWM = waterMarkRes.response.objects.includes('watermark')
                    isWaterMark.push({
                        name: fileName,
                        isWaterMark: waterMarkRes.response.objects.includes('watermark')
                    });
                    if (isWM) {
                        reject({
                            "msg": `Image ${fileName} is watermarked.`
                        });
                    } else {
                        resolve();
                    }
                });
            });

            req.on("error", (e) => {
                console.log("in error")
                console.error(e);
                reject({
                    "msg": "Something went wrong !!"
                });
            });
            req.end();



        } catch (err) {
            console.log(err)
            //logger.error("Utilitymodel : checkWaterMark");
            reject({
                "msg": "Something went wrong !!"
            });
        }

    });
}


app.use('/image', async (req, res) => {
    try {
        let promiseArr = []
        let result_s3 = [{
                storage_location: "https://demo.restb.ai/images/demo/demo-1.jpg",
                original_filename: "rizwans_K"
            },
            {
                storage_location: "https://demo.restb.ai/images/demo/demo-1.jpg",
                original_filename: "rizwans_m"
            },
            {
                storage_location: "https://demo.restb.ai/images/demo/demo-1.jpg",
                original_filename: "rizwans_n"
            }
        ]
        let result_watermark = [];
        // result_s3.map((obj) => {
        //     console.log("pushing into arr");
        //     promiseArr.push(sleep(10000));
        //     promiseArr.push(checkWaterMark(obj.storage_location, obj.original_filename));
        //     promiseArr.push(sleep(10000));
        //     console.log("pushing sleep promise");
        //     //result_watermark = checkWaterMark(obj.storage_location, obj.original_filename);
        // });
        // result_watermark = await Promise.all(promiseArr)
        // for (let i = 0; i <= result_s3.length; i++) {
        //     await checkWaterMark(result_s3[i].storage_location, result_s3[i].original_filename)
        // }


        console.log("after map");
        res.status(200).send({
            "msg": result_watermark
        });
    } catch (err) {

        console.log("errr", err);
        res.status(500).send({
            "error": err
        })
    }
})
app.listen(5000,
    () => console.log("Running on Port:%s", process.env.PORT));
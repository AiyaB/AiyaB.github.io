var nodemailer = require("nodemailer");
var request = require("request");
var querystring = require("querystring");

var CONFIG = {
    SMTP_USERNAME: process.env.SMTP_USERNAME || "wallabybooking@gmail.com",
    SMTP_PASSWORD: process.env.SMTP_PASSWORD || "vnskcujnigwvhxho",
    SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
    SMTP_PORT: parseInt(process.env.SMTP_PORT) || 465,
    SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || "Wallaby Hostel",
    SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || "wallabybooking@gmail.com",
    SMTP_FROM_SUBJECT: process.env.SMTP_FROM_SUBJECT || "New Booking For The Wallaby",
    SMTP_TO: process.env.SMTP_TO || "aiyab@sfu.ca,aiya_bowman@sfu.ca",
    RECAPTCHA_SECRET_KEY: process.env.RECAPTCHA_SECRET_KEY || "6Le-sz8mAAAAAMuv9yF1gZ3vi5-x7KFh9nzjymvK",
    REQUIRED_FIELDS: process.env.REQUIRED_FIELDS || "name,phone,email,address",
    SUCCESS_MESSAGE: process.env.SUCCESS_MESSAGE || "We have successfully sent your booking request"
}

function sendEmail(formData,res){
    var smtpConfig = {
        host: CONFIG.SMTP_HOST,
        port: CONFIG.SMTP_PORT,
        auth: {
            user: CONFIG.SMTP_USERNAME,
            pass: CONFIG.SMTP_PASSWORD
        }
    }
    var transporter = nodemailer.createTransport(smtpConfig);
    transporter.verify().then(console.log).catch(console.error);

    
    var mailBody="";
    for(let key in formData){
        if(formData.hasOwnProperty(key)){
            if(key==="g-recaptcha-response"||key==="submit")
                continue;
            mailBody+=("<strong>"+key+":</strong> "+formData[key]+"<br>");
        }
    }
    
    if(mailBody!=""){//...stop sending random empty emails.
        transporter.sendMail({
            from:'"'+CONFIG.SMTP_FROM_NAME+'" <'+CONFIG.SMTP_FROM_EMAIL+'>', //sender address
            to:CONFIG.SMTP_TO,
            subject:CONFIG.SMTP_FROM_SUBJECT,
            html:mailBody
        }, (error,info)=>{
            
            if(error){
                return res.status(500).json(
                    {
                        message:"Booking failed to send. Please try again."
                    }
                )
            }
            return res.status(200).json(
                {
                    message:CONFIG.SUCCESS_MESSAGE
                }
            )
        });
    }
}

function reCaptcha(formData,res){
    var verificationUrl='https://www.google.com/recaptcha/api/siteverify?';
    verificationUrl+=stringify({
        'secret':CONFIG.RECAPTCHA_SECRET_KEY,
        'response':formData['g-recaptcha-response']
    });

    if(formData['g-recaptcha-response']===undefined || formData['g-recaptcha-response']==='' || formData['g-recaptcha-response']===null){
        return res.status(200).json(
            {
                message:"Please select captcha"
            }
            
        );
    }
    
    request(verificationUrl, function (error,response,body){
        body=JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(!body.success && body.success!==undefined) {
            return res.status(200).json(
                {
                    message:"Invalid captcha. Try again if not a bot"
                }
            );
        }
        sendEmail(formData,res);
    });
}

exports.onSubmit=(req,res)=>{
    res.set("Access-Control-Allow-Origin","https://www.aiyabowman.com");
    res.set("Access-Control-Allow-Methods","GET,POST");
    res.set("Access-Control-Allow-Headers","Content-Type");

    var formData=req.body;
    
    var requiredFields=CONFIG.REQUIRED_FIELDS.split(',');
    
    for(let i=0; i<requiredFields.length; i++){
        if(formData[requiredFields[i].trim()]==''){
            res.send(
                "<p>"+requiredFields[i].trim()+" field is required"
            );
            res.status(200).end();
            return;
        }
    }
    /*if(CONFIG.RECAPTCHA_SECRET_KEY){
        reCaptcha(formData,res);
    }
    else{
        sendEmail(formData,res);
    }*/
    sendEmail(formData,res);
}
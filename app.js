const dialogflow = require('@google-cloud/dialogflow');
const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");
var nodemailer = require("nodemailer");
const express = require("express")
const cors = require("cors");
require('dotenv').config();

const MODEL_NAME = "gemini-1.5-pro";
const API_KEY = process.env.API_KEY;

async function runChat(queryText) {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // console.log(genAI)
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
        temperature: 1,
        topK: 0,
        topP: 0.95,
        maxOutputTokens: 50,
    };

    const chat = model.startChat({
        generationConfig,
        history: [
        ],
    });

    const result = await chat.sendMessage(queryText);
    const response = result.response;
    return response.text();
}

const app = express();
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use((req, res, next) => {
    console.log(`Path ${req.path} with Method ${req.method}`);
    next();
});
app.get('/', (req, res) => {
    res.sendStatus(200);
    res.send("Status Okay")
});
app.use(cors());

const PORT = process.env.PORT || 8080;

app.post("/webhook", async (req, res) => {
    var id = (res.req.body.session).substr(43);
    console.log(id)
    const agent = new WebhookClient({ request: req, response: res });
function hi(agent) {
    console.log(`Default Welcome Intent  =>  hi`);
    agent.add("Hi! I'm cattle farm assistant, Welcome to our Cattle farm we are provide animals cow,camel and others")
}

function booking(agent) {
    
  const { Anitype,aniage,number,email,phone,address } = agent.parameters;


        
   agent.add(`Thank you your Animal is ${Anitype} and his age is ${aniage} and your badget is ${number} check it your email ${email} and other's details and messege for ${phone} your location is ${address}`)
}



var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ayanimranayanahmed@gmail.com',
    pass: process.env.APP_PASSWORD,
  }
});

var mailOptions = {
  from: 'ayanimranayanahmed@gmail.com',
  to: ["hammadn788@gmail.com" ,'ayanibnimran@gmail.com'],
  subject: 'Cattle farm',
  html : `<!DOCTYPE html>
<html>
<head>
	<title>Welcome to Cattle farm!</title>
	<style>
		body {
			font-family: Arial, sans-serif;
			background-color: #f5f5f5;
		}
		.container {
			max-width: 600px;
			margin: 40px auto;
			padding: 20px;
			background-color: #fff;
			border: 1px solid #ddd;
			border-radius: 10px;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		}
		.header {
			background-color:#1963eb;
			color: #fff;
			padding: 10px;
			text-align: center;
			border-radius: 10px 10px 0 0;
		}
		.header h1 {
			margin: 0;
			font-size: 24px;
			font-weight: bold;
			color: #fff;
		}
		.content {
			padding: 20px;
		}
		.content h2 {
			margin-top: 0;
			font-size: 18px;
			font-weight: bold;
			color: #333;
		}
		.content table {
			border-collapse: collapse;
			width: 100%;
		}
		.content th,.content td {
			border: 1px solid #ddd;
			padding: 10px;
			text-align: left;
		}
		.content th {
			background-color: #f0f0f0;
		}
		.footer {
			background-color:#1963eb;
			color: #fff;
			padding: 10px;
			text-align: center;
			border-radius: 0 0 10px 10px;
		}
		.footer p {
			margin: 0;
		}
	</style>
</head>
<body>
	<div class="container">
		<div class="header">
			<img src="https://firebasestorage.googleapis.com/v0/b/calculaterayan.appspot.com/o/image%20(1).png?alt=media&token=2e0a5d82-70c6-4240-b220-718c69b955da" alt="SMIt Logo" style="width: 70px; height: 70px; margin: 10px;">
			<h1>Welcome to Cattle farm 🐄!</h1>
		</div>
		<div class="content">
			<p>Dear <strong>cutomer</strong>,</p>
			<p>Thank you for choosing our cattle farm! We’re excited to have you as our guest. Your booking has been confirmed, and we look forward to providing you with an unforgettable experience.</p>

<p>Your booking is done, just stay calm and connect with our form and wait for the email</p>
			<br>
			<h2>Next Steps:</h2>
			<p>Please feel free to reach out if you have any questions or need further assistance. We’ll be happy to help.

                See you soon at the farm!</p>
		</div>
		<div class="footer">
			<h4>Sincerely,</h4>
			<h3>The Cattle farm Team</h3>
		</div>
	</div>
</body>
</html>
` };


transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

async function fallback() {
    let action = req.body.queryResult.action;
    let queryText = req.body.queryResult.queryText;

    if (action === 'input.unknown') {
        let result = await runChat(queryText);
        agent.add(result);
        console.log(result)
    }else{
        agent.add(result);
        console.log(result)
    }
}


let intentMap = new Map();
intentMap.set('Default Welcome Intent', hi); 
intentMap.set('Default Fallback Intent', fallback); 
intentMap.set('booking', booking); 
 
agent.handleRequest(intentMap);
})

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
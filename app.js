const express = require('express');
//const math = require('mathjs');
const app = express();
module.exports = app;

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false}));

app.use(express.static('public'));
var html_dir = './public/';
var count = 0;
var path = require('path');

//doggo details
var people = [{"username":"sashaym","forename":"Sasha","surname":"Miller", "access_token":"concertina"}, {"username":"doctorwhocomposer","forename":"Delia","surname":"Derbyshire", "access_token":"concertina"}, {"username":"bill","forename":"Bill","surname":"Flower", "access_token":"concertina"}, {"username":"ben","forename":"Ben","surname":"Flower", "access_token":"concertina"}];
var accounts = {"sashaym":{"fname":"Sasha", "sname":"Miller", "uname":"sashaym","psw":"boop"}, "doctorwhocomposer":{"fname":"Delia", "sname":"Derbyshire", "uname":"doctorwhocomposer","psw":"beep"}, "bill":{"fname":"Bill", "sname":"Flower", "uname":"bill","psw":"bill"}, "ben":{"fname":"Ben", "sname":"Flower", "uname":"ben","psw":"ben"}};
var dogs = [{"owner":"sashaym","name":"Squishy"}, {"owner":"doctorwhocomposer","name":"Adi"}, {"owner":"bill", "name":"Dragon"}, {"owner":"ben", "name":"Mouse"}];
var sniffs = [{"sniffer":"doctorwhocomposer","sniffed":"sashaym"}, {"sniffer":"bill", "sniffed":"sashaym"}, {"sniffer":"sashaym", "sniffed":"bill"}];
var chats = [];
var messages = [];
var meets = [];

//HOMEPAGE
app.get('/', function(req, res){
	res.sendFile(path.join(__dirname+ '/public/homepage.html'));
});

//LOGIN
app.get('/login', function(req, res){
	//console.log(req);
	var response;
	var found = false;
	var x;
	for (x in accounts){
		if (req.query.uname === accounts[x].uname && req.query.psw === accounts[x].psw){
			response=req.query.uname;
			found = true;				
			}
	}	
	if (found===false){
		console.log(false);
		res.send(false);
		}
	else{
		res.send(response);
		}
			
});

//NEW ACCOUNT
app.post('/people',function(req, res){
	console.log(req.body.access_token);
	console.log(req.body.username);
	//console.log(req);
	var existing = false;
	for (x in people){
		if(req.body.username === people[x].username){
			existing = true;
		}
	}
	
	if(existing === true){
		res.status(400).send("Bad Request");
	}
	else if(req.body.access_token != "concertina"){ //this method makes last test not work 
		res.status(403).send("Forbidden");
	}
	
	else{
		accounts[req.body.username] = {
		fname: req.body.forename,
		sname: req.body.surname,
		uname: req.body.username,
		psw: req.body.psw
		}	
		people.push({
			"username": req.body.username,
			"forename": req.body.forename,
			"surname": req.body.surname,
			"access_token": req.body.access_token
		});
		dogs.push({
			"owner": req.body.username,
			"name": req.body.dogname,
			"bio": req.body.bio
		});
		res.send(req.body.username);
	}	
});

//get all people
app.get('/people', function(req, res){
	res.send(people);
});

//get person
app.get('/people/:username', function(req, res){
	var uname = req.params.username;
	//send more than uname !!
	//send back 404 if issue
	var x = people.find( y => y.username === uname);
	res.send(x);
});

//get all dogs -- PARK
app.get('/park', function(req, res){
	// send all except current
	
	res.send(dogs);	
});

//sniff a butt
app.post('/sniff', function(req, res){
	var sniffer = req.body.sniffer;
	var sniffed = req.body.sniffed;
	//var x = dogs.find(y => y.owner ===sniffer);
	//var dog = x.name;
	sniffs.push({
		"sniffer":sniffer,
		"sniffed":sniffed			
	});
});

//get matches
app.get('/matches', function(req,res){
	console.log("sniffs: ",sniffs);
	var current = req.query.current;
	var sniffedYou = [];
	var mutualSniffs = [];
	for (x in sniffs){
		if (sniffs[x].sniffed === current){
			sniffedYou.push(sniffs[x]);
		}
	}
	console.log("sniffed you: ",sniffedYou);
	for (y in sniffs){
		if (sniffs[y].sniffer === current){
			for(z in sniffedYou){
				if (sniffs[y].sniffed === sniffedYou[z].sniffer){
					if(mutualSniffs.includes(sniffedYou[z].sniffer) === false){
						mutualSniffs.push(sniffedYou[z].sniffer);
					}
				}	
			}
		}
	}
	console.log("mutualsniffs: ",mutualSniffs);
	for (j = 0; j < mutualSniffs.length; j++){
		for (w = 0; w < sniffedYou.length; w++){
			if (sniffedYou[w].sniffer == mutualSniffs[j]){
				sniffedYou.splice(w,1);
			}
		}	
	}
	
	//list of dogs names now 
	
	var mutualSniffsDogs = [];
	for (b in mutualSniffs){
		for (h in dogs){
			if (h.owner === b){
				mutualSniffsDogs.push(h.name);
			}
		}
	}
	response = [mutualSniffs, sniffedYou];
	console.log("response: ",response);
	res.send(response);
});

//send a woof
app.post('/woof', function(req, res){
	console.log(req);
	
});


//set up a meeting
app.post('/meet', function(req, res){
	console.log(req);
	meets.push({
		"owner1": req.body.current,
		"owner2": req.body.second,
		"park":	req.body.park,
		"day": req.body.day,
		"agreed": false
	});
	res.send("hi");
});

app.get('/meetings', function (req,res){
	
	res.send(meets);
});

app.get('/acceptmeet', function(res,req){
	console.log(req);
});
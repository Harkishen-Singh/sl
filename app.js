const express = require('express'),
	app = express(),
	mysql = require('mysql'),
	port=8000,
	url='localhost',
	bodyParser = require('body-parser'),
	dbOperations = require('./locality'),
	campaigns = require('./campaigns',)
	checks=require('./test'),
	multer=require('multer'),
	storage=multer.diskStorage({
		destination: (req,file,cb) => {
			cb(null, './public/image_campaigns')
		},
		filename: (req, file, cb) => {
			cb(null, file.originalname);
			console.log('saved received image at ./public/image_campaigns/'+file.originalname)
		}
	}),
	upload=multer({
		storage: storage
	}),
	pricings=require('./pricings');

app.get('/',(req,res)=>{
	checks('this it');
	res.send('working');
});
// app.use((req,res,next)=>{
// 	res.header('Access-Control-Allow-Origin', '*');
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
// });
app.use((req,response,next)=>{
	response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
}));
/* localities */
	app.post('/localities-add', (req, res)=>{
		console.log('Request IP : '+req.connection.remoteAddress);
		let output=[];
		output.push({'Success':'Y'});
		//console.log(output);
		var x = {
			'success':'yes',
			'err_message' : 'null'
		};
		dbOperations.addLocality(req,res);
		
	});
	app.post('/localities-viewLists', (req,res)=>{
		console.log('Request IP : '+req.connection.remoteAddress);
		dbOperations.viewLocality(req,res);
	});
/* endlocalities */
/* campaigns */
	app.post('/create-campaigns-new', upload.single('image'), (req,res)=>{
		console.log('Request IP for create-campaigns : '+req.connection.remoteAddress);
		campaigns.add(req,res);
	});
	app.post('/campaigns-viewLists', (req,res)=>{
		console.log('Request IP for view-campaigns : '+req.connection.remoteAddress);
		campaigns.view(req,res);
	});
	app.post('/campaigns-edit', (req,res)=>{
		campaigns.edit(req,res);
	});
	app.post('/update-campaigns', (req,res)=>{
		campaigns.update(req,res);
	});
/* endcampaigns */
/* pricings */
	app.post('/pricing_list_fetch', (req,res)=>{
		campaigns.pricing_list_fetch(req,res);
	});
	app.post('/pricing-addAdmin', (req,res)=>{
		pricings.addAdmin(req,res);
	});
	app.post('/pricing-view', (req,res)=>{
		pricings.view(req,res);
	});
	app.post('/edit-pricings-send', (req, res) => {
		pricings.edit(req,res);
	});
	app.post('/update-pricing', (req, res) =>{
		pricings.update(req,res);
	});

var server = app.listen(port, url, function(e) {
	if (e) {throw e;}
	console.log('running at '+server.address().address + '\nport '+server.address().port);
});
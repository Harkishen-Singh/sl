const express = require('express'),
	app = express(),
	mysql = require('mysql'),
	port=8000,
	url='0.0.0.0',
	bodyParser = require('body-parser'),
	dbOperations = require('./locality'),
	campaigns = require('./campaigns'),
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
	pricings=require('./pricings'),
	agent_comission=require('./agent-comission'),
	agent=require('./agent'),
	fetchs=require('./fetchs');

app.get('/',(req,res)=>{
	checks('this it');
	res.send('working');
});
app.use((req,res,next)=>{
	res.header('Access-Control-Allow-Origin', '*');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
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
	app.post('/view-more-campaigns', (req,res)=>{
		console.warn('request for view-more-campaigns')
		campaigns.viewMore(req,res);
	});
	app.post('/fetch-city-types',(req,res)=>{
		fetchs.campaign_city_type(req,res);
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
	app.post('/pricing-deactivate', (req,res)=>{
		pricings.deactivate(req,res);
	})
/* endpricings */
/* agent_comission */
	app.post('/add-agent-comission', (req,res) => {
		console.log('/add-agent-comission called')
		agent_comission.add_agent_comission(req,res);
	});
	app.post('/view-agent-comission', (req,res) => {
		console.log('/view-agent-comission called')
		agent_comission.view(req,res);
	});

/* endagent_comission */
/* agent signup form receiver */

	app.post('/agentSignUp', (req, res) => {
		console.warn('Called up for agentSigning');
		agent.signUp(req,res);
	});
	app.post('/agent-profile', (req, res) => {
		console.warn('profile called');
		agent.profile(req,res);
	});
	app.post('/opt-store', (req, res) => {
		agent.OTPstore(req,res);
	});
	app.post('/opt-sent', (req, res) => {
		agent.retriveOTP(req,res);
	});

/* endagentsignup */
/* agentlogin */

	app.post('/agentLogin',(req,res)=>{
		console.debug('Login agent called')
		agent.login(req,res);
	});

/* endagentlogin */ 
/* fetchs */

	app.post('/fetch-currency', (req, res)=>{
		console.warn('request for fetch-currency')
		fetchs.fetch_currency(req,res);
	});
	app.post('/fetch-country', (req,res)=>{
		console.warn('request for fetch-country')
		fetchs.fetch_country(req,res);
	});

/* endfetchs */



var server = app.listen(port, url, function(e) {
	if (e) {throw e;}
	console.log('running at '+server.address().address + '\nport '+server.address().port);
});

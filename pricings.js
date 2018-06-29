var mysql=require('mysql'),request=require('request');
var q='', count=0;count2=0
let conn = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'hsinghbb',
	database:'mission_sl'
});
var output={
	'Success':'N',
	'err_message':'none',
	'result':[],
	'result_alt':[],
	'result_alt2':[],
	'result_alt3':[],
};

conn.connect((e)=>{
	if (e) {console.log('[ERR] err while connecting database');anyerr=true;
}else{console.log('[SUCCESS] Connected to database, with request from IP : ');}});


/* administration */

function addPricingByAdmin(req,res){
	let isErr = false, uniqueErr=false;
	
	
	if (req.body.plantype=='local') { // for localities part 
		// pricing_localities  
		try{
			q='create table pricing_localities(id int primary key auto_increment, name varchar(100) unique null,\
			 type varchar(10) null,seller varchar(10) null ,start varchar(100) null, expiry varchar(100) null,city_type varchar(10) null,currency varchar(100) null,country \
			 varchar(100) null ,categories varchar(20) null,localities_allowed int null, max_pincodes_allowed int null,\
			 free_days int null, validity int null, amount float null );';
			 conn.query(q, e=>{
			 	if (e) {console.log('[IGNORE] err while creating table pricing_localities. Might Already Exist.');}
			 	else
			 		console.log('[SUCCESS] created table pricing_localities successfully.');
			 });
		}
		catch(e){
			console.log('[IGNORE] err while creating table pricing_localities. Might Already Exist.');
		}
		let name = req.body.planname,
			type = req.body.plantype,
			expiry=req.body.expiry,
			start = req.body.start,
			// expiry='yo',
			num_of_localities = req.body.numberoflocalities,
			max_num_pincodes = req.body.maxpincodes,
			free_days = req.body.freedays,city_type=req.body.citytype,
			validity = req.body.expiryspan,
			amount = req.body.amount,
			currency=req.body.currency,
			seller = req.body.seller,
			categories=req.body.categories,
			country=req.body.country;
		console.log(name+' '+type+' '+expiry+' '+num_of_localities+' '+
			max_num_pincodes+' '+free_days+' '+validity+' '+amount)
		q = 'insert into pricing_localities(name,type,seller,start,expiry,city_type,currency,country,categories,localities_allowed,max_pincodes_allowed,free_days,validity,amount)\
		  values("'+name+'","'+type+'","'+seller+'","'+start+'","'+expiry+'","'+city_type+'","'+currency+'","'+country+'","'+categories+'",'+num_of_localities+','+max_num_pincodes+','+free_days+','+validity+','+amount+');'
		conn.query(q, e=>{
			if (e) {console.log('[ERR] err while inserting into pricing_localities');throw e;isErr=true;uniqueErr=true;console.log(isErr)}
			else
				console.log('[SUCCESS] inserted into pricing_localities');
			if (isErr==false) {output['Success']='Y';}
			if(isErr==true) {
				output['Success']='N';
				if (uniqueErr==true) {
					output['err_message']='uniqueErr';
				}
			}
			isErr=false;
			uniqueErr=false;
			res.send(output);
		});
		
	}
	else if(req.body.plantype=='city') { // for cities part
		// pricing_cities 
		try{
			q='create table pricing_cities(id int primary key auto_increment, name varchar(100) unique null,\
			 type varchar(10) null,seller varchar(10) null,start varchar(100) null,expiry varchar(100) null,currency varchar(100) null,country varchar(100) null ,\
			 categories varchar(20) null, cities_allowed int null, city_type varchar(10) null,\
			 free_days int null, validity int null, amount float null );';
			 conn.query(q, e=>{
			 	if (e) {console.log('[IGNORE] err while creating table pricing_cities. Might Already Exist.');}
			 	else
			 		console.log('[SUCCESS] created table pricing_cities successfully.');
			 });
		}
		catch(e){
			console.log('[IGNORE] err while creating table pricing_cities. Might Already Exist.');
		}
		let name = req.body.planname,
			type = req.body.plantype,expiry=req.body.expiry,
			num_of_cities = req.body.numberofcities,
			start = req.body.start,
			currency=req.body.currency,
			categories=req.body.categories,
			country=req.body.country,
			seller=req.body.seller,
			city_type = req.body.citytype,
			free_days = req.body.freedays,
			validity = req.body.expiryspan,
			amount = req.body.amount;
		q = 'insert into pricing_cities(name,type,seller,start,expiry,currency,country,categories,cities_allowed,city_type,free_days,validity,amount)\
		 values("'+name+'","'+type+'","'+seller+'","'+start+'","'+expiry+'","'+currency+'","'+country+'","'+categories+'",'+num_of_cities+',"'+city_type+'",'+free_days+','+validity+','+amount+');'
		conn.query(q, e=>{
			if (e) {console.log('[ERR] err while inserting into pricing_cities');throw e;isErr=true;uniqueErr=true;}
			else{
				console.log('[SUCCESS] inserted into pricing_cities');

			}
			if (isErr==false) {output['Success']='Y';}
			if(isErr==true) {
				output['Success']='N';				if (uniqueErr==true) {
					output['err_message']='uniqueErr';
				}
			}
			isErr=false;
			uniqueErr=false;
			res.send(output);
		});
		
	}
	else if(req.body.plantype=='state') { // for state part
		// pricing_states 
		try{
			q='create table pricing_states(id int primary key auto_increment, name varchar(100) unique null,\
			 type varchar(10) null,seller varchar(10) null,start varchar(100) null,expiry varchar(100) null,currency varchar(100) null,country varchar(100) null ,\
			 categories varchar(20) null, states_allowed int null, \
			 free_days int null, validity int null, amount float null );';
			 conn.query(q, e=>{
			 	if (e) {console.log('[IGNORE] err while creating table pricing_states. Might Already Exist.');}
			 	else
			 		console.log('[SUCCESS] created table pricing_states successfully.');
			 });
		}
		catch(e){
			console.log('[IGNORE] err while creating table pricing_cities. Might Already Exist.');
		}
		let name = req.body.planname,
			type = req.body.plantype,expiry=req.body.expiry,
			num_of_states = req.body.numberofstates,
			start = req.body.start,
			currency=req.body.currency,
			categories=req.body.categories,
			seller=req.body.seller,
			country=req.body.country,
			free_days = req.body.freedays,
			validity = req.body.expiryspan,
			amount = req.body.amount;
			console.log(name + type+expiry+num_of_states+start+currency+categories+country+free_days+validity+amount);
		q = 'insert into pricing_states(name,type,seller,start,expiry,currency,country,categories,states_allowed,free_days,validity,amount)\
		 values("'+name+'","'+type+'","'+seller+'","'+start+'","'+expiry+'","'+currency+'","'+country+'","'+categories+'",'+num_of_states+','+free_days+','+validity+','+amount+');'
		conn.query(q, e=>{
			if (e) {console.log('[ERR] err while inserting into pricing_states');throw e;isErr=true;uniqueErr=true;}
			else{
				console.log('[SUCCESS] inserted into pricing_states');

			}
			if (isErr==false) {output['Success']='Y';}
			if(isErr==true) {
				output['Success']='N';				
				if (uniqueErr==true) {
					output['err_message']='uniqueErr';
				}
			}
			isErr=false;
			console.log('coming');
			uniqueErr=false;
			res.send(output);
		});
		
	}
	else if(req.body.plantype=='national') { // for nations part
		// pricing_cities 
		try{
			q='create table pricing_nations(id int primary key auto_increment, name varchar(100) unique null,\
			 type varchar(10) null,seller varchar(10) null,start varchar(100) null,expiry varchar(100) null,currency varchar(100) null,country varchar(100) null ,\
			 categories varchar(20) null, nations_allowed int null, \
			 free_days int null, validity int null, amount float null );';
			 conn.query(q, e=>{
			 	if (e) {console.log('[IGNORE] err while creating table pricing_nations. Might Already Exist.');}
			 	else
			 		console.log('[SUCCESS] created table pricing_nations successfully.');
			 });
		}
		catch(e){
			console.log('[IGNORE] err while creating table pricing_cities. Might Already Exist.');
		}
		let name = req.body.planname,
			type = req.body.plantype,expiry=req.body.expiry,
			num_of_nations = req.body.numberofnations,
			start = req.body.start,
			currency=req.body.currency,
			categories=req.body.categories,
			country=req.body.country,
			seller=req.body.seller,
			free_days = req.body.freedays,
			validity = req.body.expiryspan,
			amount = req.body.amount;
		q = 'insert into pricing_nations(name,type,seller,start,expiry,currency,country,categories,nations_allowed,free_days,validity,amount)\
		 values("'+name+'","'+type+'","'+seller+'","'+start+'","'+expiry+'","'+currency+'","'+country+'","'+categories+'",'+num_of_nations+','+free_days+','+validity+','+amount+');'
		conn.query(q, e=>{
			if (e) {console.log('[ERR] err while inserting into pricing_nations');throw e;isErr=true;uniqueErr=true;}
			else{
				console.log('[SUCCESS] inserted into pricing_nations');

			}
			if (isErr==false) {output['Success']='Y';}
			if(isErr==true) {
				output['Success']='N';				
				if (uniqueErr==true) {
					output['err_message']='uniqueErr';
				}
			}
			isErr=false;
			uniqueErr=false;
			res.send(output);
		});
		
	}
	else{
		console.log('[ERR] wrong request body for POST method');isErr=true;
		console.log(req.body.plantype);
		if (isErr==false) {output['Success']='Y';}
		if(isErr==true) {
			output['Success']='N';
			if (uniqueErr==true) {
				output['err_message']='uniqueErr';
			}
		}
		isErr=false;
		uniqueErr=false;
		res.send(output);
	}
}

function viewPricing(req,res) {
	let list_localities =[],list_cities=[],list_states=[],list_nations=[];

	q = 'select * from pricing_localities;'
	conn.query(q, (e,result) => {
		try{
		for(let r=0; r<result.length; r++) {
			obj = {
				'id' : result[r]['id'],
				'name': result[r]['name'],
				'type': result[r]['type'],
				'expiry':result[r]['expiry'],
				'start':result[r]['start'],
				'city_type':result[r]['city_type'],
				'categories':result[r]['categories'],
				'seller':result[r]['seller'],
				'currency':result[r]['currency'],
				'country':result[r]['country'],
				'localities_allowed':result[r]['localities_allowed'],
				'max_pincodes_allowed':result[r]['max_pincodes_allowed'],
				'free_days':result[r]['free_days'],
				'validity':result[r]['validity'],
				'amount':result[r]['amount'],
			};
			list_localities.push(obj);
			output['result'].push(obj);
		}
	}
	catch(e){
		console.log('Empty table pricing_localities');
	}
	});
	console.log(output['result']);

	q = 'select * from pricing_cities;'
	conn.query(q, (e,result) => {
		try{
		for(let r=0; r<result.length; r++) {
			obj = {
				'id' : result[r]['id'],
				'name': result[r]['name'],
				'type': result[r]['type'],
				'expiry':result[r]['expiry'],
				'start':result[r]['start'],
				'city_type':result[r]['city_type'],
				'categories':result[r]['categories'],
				'seller':result[r]['seller'],
				'currency':result[r]['currency'],
				'country':result[r]['country'],
				'cities_allowed':result[r]['cities_allowed'],
				'free_days':result[r]['free_days'],
				'validity':result[r]['validity'],
				'amount':result[r]['amount'],
			};

			console.log('obj is '+ result[r]['name'] );
			list_cities.push(obj);
			output['result_alt'].push(obj);
		}
	}
	catch(e){
		console.log('Empty table pricing_cities');
	}
	console.log(output['result_alt']);
	});

	q = 'select * from pricing_states;'
	conn.query(q, (e,result) => {
		try{
		for(let r=0; r<result.length; r++) {
			obj = {
				'id' : result[r]['id'],
				'name': result[r]['name'],
				'type': result[r]['type'],
				'expiry':result[r]['expiry'],
				'start':result[r]['start'],
				'categories':result[r]['categories'],
				'seller':result[r]['seller'],
				'currency':result[r]['currency'],
				'country':result[r]['country'],
				'states_allowed':result[r]['states_allowed'],
				'free_days':result[r]['free_days'],
				'validity':result[r]['validity'],
				'amount':result[r]['amount'],
			};
			list_states.push(obj);
			output['result_alt2'].push(obj);
		}
	}
	catch(e){
		console.log('Empty table pricing_states');
	}
	console.log(output['result_alt2']);
	});

	q = 'select * from pricing_nations;'
	conn.query(q, (e,result) => {
		try{
		for(let r=0; r<result.length; r++) {
			obj = {
				'id' : result[r]['id'],
				'name': result[r]['name'],
				'type': result[r]['type'],
				'seller':result[r]['seller'],
				'expiry':result[r]['expiry'],
				'start':result[r]['start'],
				'categories':result[r]['categories'],
				'currency':result[r]['currency'],
				'country':result[r]['country'],
				'nations_allowed':result[r]['nations_allowed'],
				'free_days':result[r]['free_days'],
				'validity':result[r]['validity'],
				'amount':result[r]['amount'],
			};
			list_nations.push(obj);
			output['result_alt3'].push(obj);
		}
	}
	catch(e){
		console.log('Empty table pricing_nations');
	}
	console.log(output['result_alt3']);
	res_send(res);
	});

}
function res_send(res) {
	output['Success']='Y';
	res.send(output);
	output['result']=[];
	output['result_alt']=[];
	output['result_alt2']=[];
	output['result_alt3']=[];
	output['Success']='N';
	output['err_message']='none';
}

function editPricingsGet(req,res) {
	console.log('Type search : '+req.body.type)
	if(req.body.type=='local') {
		let id = req.body.id;
		q = 'select * from pricing_localities where id='+id+';';
		conn.query(q, (e, result) => {
			if (e) {console.log('[ERR] err while searching record in pricing_localities');}
			else {
				obj = {
				'id' : result[0]['id'],
				'name': result[0]['name'],
				'type': result[0]['type'],
				'expiry':result[0]['expiry'],
				'city_type':result[0]['city_type'],
				'categories':result[0]['categories'],
				'seller':result[0]['seller'],
				'currency':result[0]['currency'],
				'country':result[0]['country'],
				'localities_allowed':result[0]['localities_allowed'],
				'max_pincodes_allowed':result[0]['max_pincodes_allowed'],
				'free_days':result[0]['free_days'],
				'validity':result[0]['validity'],
				'amount':result[0]['amount'],
			};
			console.log('city_type was '+result[0]['city_type'])
			output['result'].push(obj);
			res_send(res);
			}
		});
	}
	else if (req.body.type=='city') {
		let id = req.body.id;
		q = 'select * from pricing_cities where id='+id+';';
		conn.query(q, (e, result) => {
			if (e) {console.log('[ERR] err while searching record in pricing_cities');}
			else {
				obj = {
				'id' : result[0]['id'],
				'name': result[0]['name'],
				'type': result[0]['type'],
				'seller':result[0]['seller'],
				'expiry':result[0]['expiry'],
				'start':result[0]['start'],
				'categories':result[0]['categories'],
				'currency':result[0]['currency'],
				'country':result[0]['country'],
				'cities_allowed':result[0]['cities_allowed'],
				'city_type':result[0]['city_type'],
				'free_days':result[0]['free_days'],
				'validity':result[0]['validity'],
				'amount':result[0]['amount'],
			};

			output['result'].push(obj);
			console.log(output['result'])
			res_send(res);
			}
		});
	}
	else if (req.body.type=='state') {
		let id = req.body.id;
		q = 'select * from pricing_states where id='+id+';';
		conn.query(q, (e, result) => {
			if (e) {console.log('[ERR] err while searching record in pricing_states');}
			else {
				obj = {
				'id' : result[0]['id'],
				'name': result[0]['name'],
				'type': result[0]['type'],
				'seller':result[0]['seller'],
				'expiry':result[0]['expiry'],
				'start':result[0]['start'],
				'categories':result[0]['categories'],
				'currency':result[0]['currency'],
				'country':result[0]['country'],
				'states_allowed':result[0]['states_allowed'],
				'free_days':result[0]['free_days'],
				'validity':result[0]['validity'],
				'amount':result[0]['amount'],
			};

			output['result'].push(obj);
			console.log(output['result'])
			res_send(res);
			}
		});
	}
	else if (req.body.type=='national') {
		let id = req.body.id;
		q = 'select * from pricing_nations where id='+id+';';
		conn.query(q, (e, result) => {
			if (e) {console.log('[ERR] err while searching record in pricing_nations');}
			else {
				obj = {
				'id' : result[0]['id'],
				'name': result[0]['name'],
				'type': result[0]['type'],
				'seller':result[0]['seller'],
				'expiry':result[0]['expiry'],
				'start':result[0]['start'],
				'categories':result[0]['categories'],
				'currency':result[0]['currency'],
				'country':result[0]['country'],
				'nations_allowed':result[0]['nations_allowed'],
				'free_days':result[0]['free_days'],
				'validity':result[0]['validity'],
				'amount':result[0]['amount'],
			};

			output['result'].push(obj);
			console.log(output['result'])
			res_send(res);
			}
		});
	}

	else {
		console.log('[ERR] wrong type in editPricingsGet function ');

	}
}

function updatePricings(req,res) {
	uniqueErr=false;isErr=false;
	console.log('udpate type is ' + req.body.plantype)
	console.log('udpate id is ' + req.body.id)
	if (req.body.plantype=='local') {
		console.log('updating local')
		let name = req.body.planname,
			type = req.body.plantype,expiry=req.body.expiry,
			start = req.body.start,
			num_of_localities = req.body.numberoflocalities,
			max_num_pincodes = req.body.maxpincodes,
			categories=req.body.categories,
			currency=req.body.currency,city_type = req.body.citytype,
			country=req.body.country,
			seller=req.body.seller,
			free_days = req.body.freedays,
			validity = req.body.expiryspan,
			amount = req.body.amount;
		q = 'update pricing_localities set type="'+type+'",seller="'+seller+'",expiry="'+expiry +'",start="'+start+'",currency="'+currency+'",country="'+
			country+'",categories="'+categories+'",localities_allowed='+num_of_localities+',max_pincodes_allowed='+max_num_pincodes
			+',free_days='+free_days+',validity='+validity+',amount='+amount+',city_type="'+city_type+'" where id = '+req.body.id+';';
		conn.query(q, e => {
			if (e) {console.log('[ERR] err while updating pricing_localities');uniqueErr=true;isErr=true;throw e;}
			if (isErr) {
				output['Success']='N';
			}
			res_send(res);
		});
	}
	else if (req.body.plantype=='city') {
		let name = req.body.planname,
			type = req.body.plantype,expiry=req.body.expiry,
			num_of_cities = req.body.numberofcities,start=req.body.start,
			currency=req.body.currency,
			country=req.body.country,
			categories=req.body.categories,
			city_type = req.body.citytype,
			free_days = req.body.freedays,
			seller=req.body.seller,
			validity = req.body.expiryspan,
			amount = req.body.amount;
		q = 'update pricing_cities set type="'+type+'",seller="'+seller+'",expiry="'+expiry +'",start="'+start+'",currency="'+currency+'",country="'+
			country+'",categories="'+categories+'",cities_allowed='+num_of_cities+',city_type="'+city_type
			+'",free_days='+free_days+',validity='+validity+',amount='+amount+' where id = '+req.body.id+';';
		conn.query(q, e => {
			if (e) {console.log('[ERR] err while updating pricing_cities');uniqueErr=true;isErr=true;throw e;}
			if (isErr) {
				output['Success']='N';
			}
			res_send(res);
		});
	}
	else if (req.body.plantype=='state') {
		let name = req.body.planname,
			type = req.body.plantype,expiry=req.body.expiry,
			num_of_states = req.body.numberofstates,start=req.body.start,
			currency=req.body.currency,
			country=req.body.country,
			categories=req.body.categories,
			free_days = req.body.freedays,
			validity = req.body.expiryspan,
			seller=req.body.seller,
			amount = req.body.amount;
			console.log(num_of_states);
		q = 'update pricing_states set type="'+type+'",seller="'+seller+'",expiry="'+expiry +'",start="'+start+'",currency="'+currency+'",country="'+
			country+'",categories="'+categories+'",states_allowed='+num_of_states
			+',free_days='+free_days+',validity='+validity+',amount='+amount+' where id = '+req.body.id+';';
		conn.query(q, e => {
			if (e) {console.log('[ERR] err while updating pricing_states');uniqueErr=true;isErr=true;throw e;}
			if (isErr) {
				output['Success']='N';
			}
			res_send(res);
		});
	}
	else if (req.body.plantype=='national') {
		let name = req.body.planname,
			type = req.body.plantype,expiry=req.body.expiry,
			num_of_nations = req.body.numberofnations,start=req.body.start,
			currency=req.body.currency,
			country=req.body.country,
			categories=req.body.categories,
			seller=req.body.seller,
			free_days = req.body.freedays,
			validity = req.body.expiryspan,
			amount = req.body.amount;
		q = 'update pricing_nations set type="'+type+'",seller="'+seller+'",expiry="'+expiry +'",start="'+start+'",currency="'+currency+'",country="'+
			country+'",categories="'+categories+'",nations_allowed='+num_of_nations
			+',free_days='+free_days+',validity='+validity+',amount='+amount+' where id = '+req.body.id+';';
		conn.query(q, e => {
			if (e) {console.log('[ERR] err while updating pricing_nations');uniqueErr=true;isErr=true;throw e;}
			if (isErr) {
				output['Success']='N';
			}
			res_send(res);
		});
	}
	else {
		console.log('[ERR] wrong plantype input')
	}

}

module.exports = {
	addAdmin: addPricingByAdmin,
	view: viewPricing,
	edit: editPricingsGet,
	update: updatePricings,
}
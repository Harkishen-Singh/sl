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
};

conn.connect((e)=>{
	if (e) {console.log('[ERR] err while connecting database');anyerr=true;
}else{console.log('[SUCCESS] Connected to database, with request from IP : ');}});



function campaigns_add(req,res){
	if (count==0 && count2==0) {count++;count2++;} // call to database
	let isErr = false;
	
		q = 'create table campaigns(id int primary key auto_increment, name varchar(100) unique null, short_description varchar(140) null,offer_code varchar(100) null, expiry varchar(100) null, offer_description varchar(140) null, long_description varchar(15000), image_address varchar(100) null );'
		conn.query(q, (e)=>{
			if (e) {console.log('[IGNORE] could not create campaigns table. Might be already created');}
			else
				console.log('Created campaigns table successfully.');

		});

	let image_file = req.body.img, img_saved = false;
	

	let name=req.body.name, 
		shortdescription=req.body.shortdescription,
		offer=req.body.offer,
		expirydate=req.body.expirydate,
		offerdescription=req.body.offerdescription,
		longdescription=req.body.longdescription;
	let img_add = null;
	if (img_saved==true) {img_add='/public/image_campaigns/'+image_file;}
	if (offer=='') {offer=null}
	if (offerdescription=='') {offerdescription=null}

	q='insert into campaigns(name,short_description,offer_code,expiry,offer_description,long_description,image_address) values \
		("'+name+'","'+shortdescription+'","'+offer+'","'+expirydate.substr(0,25)+'","'+offerdescription+'","'+longdescription +'","'+img_add+'");';
	img_saved=false;
	conn.query(q, (e)=>{if (e) {console.log('[ERR] err while inserting into campaigns table. same name might already exist.');isErr=true;}
	else console.log('[SUCCESS] inserted into campaigns table');
		res_send(res,isErr);
	});
	
	isErr=false;
}
function res_send(res,isErr) {
	if (isErr==true) {output['Success']="N";}
	else
		output['Success']="Y";
	res.send(output);
	isErr=false;
}

function campaigns_view(req,res){
	let list=[], result_campaigns;
	if (count==0 && count2==0) {count2++;count++;}
	q = 'select * from campaigns limit 100;'
	conn.query(q, (e,result)=>{
		if (e) {
			console.log('[ERR] err while asking for campaigns list from database');
		}
		else{
			for (var i = 0; i < result.length; i++) {
				let obj={
					'id':0,
					'name':'',
					'short_description':'',
					'offer_code':'',
					'expiry':'',
					'offer_description':'',
					'long_description':'',
					'image_address':'',
				};
				obj['id']=result[i]['id'];
				obj['name']=result[i]['name'];
				obj['short_description']=result[i]['short_description'];
				obj['offer_code']=result[i]['offer_code'];
				obj['expiry']=result[i]['expiry'];
				obj['offer_description']=result[i]['offer_description'];
				obj['long_description']=result[i]['long_description'];
				obj['image_address']=result[i]['image_address'];
				list.push(obj);
				output['result'].push(obj);
			}
			done_link_campaigns_view(res);
		}
	});
}

function localities_for_pricing_list(req,res){  
/* 
** this function should have been located at the locality.js file. 
** Now since, this has alredy been linked here, 
** so lets continue with it. 
*/
	let list=[], result_campaigns;
	q = 'select * from localities limit 1000;';
	conn.query(q, (e,result)=>{
		if (e) {
			console.log('[ERR] err while asking for campaigns list from database');
		}
		else{
			for(var i=0;i<result.length;i++){
				let obj={
					'id':'',
					'pincode':'',
					'areaname':'',
					'city_type':'',
					'status':'',
					'districtname':'',
					'statename':'',
				};
				obj['id']=result[i]['id'];
				obj['pincode']=result[i]['pincode'];
				obj['areaname']=result[i]['areaname'];
				obj['city_type']=result[i]['city_type'];
				obj['status']=result[i]['status'];
				obj['districtname']=result[i]['districtname'];
				obj['statename']=result[i]['statename'];
				
				list.push(obj);
			}
			for(let o=0;o<list.length;o++){
				let checks=false;
				if (output['result'].length==0) {
					output['result'].push(list[o]);
				}
				else{
					for(let k=0;k<output['result'].length;k++){
						if (output['result'][k]['pincode']==list[o]['pincode']) {
							checks=true;break;
						}
					}
					if (checks==false) {output['result'].push(list[o]);}
					else{checks=false;}
				}
			}
			for(let o=0;o<list.length;o++){
				let checks=false;
				if (output['result_alt'].length==0) {
					output['result_alt'].push(list[o]);
				}
				else{
					for(let k=0;k<output['result_alt'].length;k++){
						if (output['result_alt'][k]['districtname']===list[o]['districtname']) {
							checks=true;break;
						}
					}
					if (checks==false) {output['result_alt'].push(list[o]);}
					else{checks=false;}
				}
			}
			done_link_campaigns_view(res);
		}
	});
}

function done_link_campaigns_view(res){
	output['Success']='Y';
	console.log(output['result']);
	res.send(output);
	output['result']=[];
	output['result_alt']=[];
	output['Success']='N';
}
var id;
function campaigns_edit(req,res){
	id = req.body.id;
	//console.log('Id to be searched '+id);
	q='select * from campaigns where id='+req.body.id+';';
	conn.query(q,(e,rr)=>{
		if(e){console.log('[ERR] err while asking values for editing from db. Record of id : '+id+' was not found!'); throw e;}
		else{
			output['result']=[];
			let obj={
					'id':0,
					'name':'',
					'short_description':'',
					'offer_code':'',
					'expiry':'',
					'offer_description':'',
					'long_description':'',
					'image_address':'',
				};
			obj['id']=rr[0]['id'];
			obj['name']=rr[0]['name'];
			obj['short_description']=rr[0]['short_description'];
			obj['offer_code']=rr[0]['offer_code'];
			obj['expiry']=rr[0]['expiry'];
			obj['offer_description']=rr[0]['offer_description'];
			obj['long_description']=rr[0]['long_description'];
			obj['image_address']=rr[0]['image_address'];
			output['result'].push(obj);
			console.log('campaigns edit part '+ output['result']);
		done_link_campaigns_view(res);
		}
		
	});
}
function campaigns_update(req,res){
	let image_file = req.body.img, img_saved = false;
	let id=req.body.id;
	let fs = require('fs');
	console.log('image is '+ image_file);
	fs.writeFile(__dirname+'/public/image_campaigns/'+image_file, image_file, (e)=>{
		if (e) {console.log('[ERR] Could not save image on the server');img_saved=false;}
		else{
			console.log('[SUCCESS] saved image on the server, address : '+__dirname+'/public/image_campaigns/'+image_file);
			img_saved=true;
		}
	});

	let name=req.body.name, 
		shortdescription=req.body.shortdescription,
		offer=req.body.offer,
		expirydate=req.body.expirydate,
		offerdescription=req.body.offerdescription,
		longdescription=req.body.longdescription;
	console.log('Offerdesc is '+offerdescription)
	let img_add = '';
	if (img_saved==true) {img_add='/public/image_campaigns/'+image_file;}
	if (offer==undefined) {offer=''}
	if (offerdescription==undefined) {offerdescription=''}
		//let id=req.body.id;
	
	q='update campaigns set short_description="'+shortdescription+'",offer_code="'+offer+'",expiry="'+expirydate.substr(0,25)+'",\
	     offer_description="'+offerdescription+'",long_description="'+longdescription+'",image_address="'+img_add+'" where id='+id+';';
	console.log('cmd is \n'+q);
	img_saved=false;
	conn.query(q, (e)=>{if (e) {console.log('[ERR] err while updating campaigns table.'); throw e;}
	else console.log('[SUCCESS] updated campaigns table');});
	id=null;
	console.log('\n');
	output['Success']="Y";
	res.send(output);
	output['Success']='N';
}
/*
 *on updation on campaigns, the previous iage is not removed for now
 */


module.exports = {
	add: campaigns_add,
	view:campaigns_view,
	edit:campaigns_edit,
	update:campaigns_update,
	pricing_list_fetch:localities_for_pricing_list,
};
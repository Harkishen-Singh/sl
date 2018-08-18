var mysql=require('mysql'),request=require('request');
var q='', count=0,count2=0;
let conn = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'hsinghbb',
	database:'mission_sl'
});
let anyerr = false;
var sameAreaName=false;
var output={
	'Success':'N',
	'err_message':'none',
	'result':[],
};
var list=[];


function connect_to_database(){conn.connect((e)=>{
	if (e) {console.log('[ERR] err while connecting database');anyerr=true; throw e;}else{console.log('[SUCCESS] Connected to database, with request from IP : ');}});
}
function disconnect_from_database(){conn.destroy();}

function addLocality(request,res){
	output['Success']='N';
	output['err_message']='';

	if(count==0){
		connect_to_database();
		count++;
		count2++;
	}
	/* creating table "localities" */
	try{
		q='create table localities(id int primary key auto_increment, pincode varchar(100)  null, areaname varchar(225) unique, city_type varchar(10) null, status varchar(20) not null , districtname varchar(225) null, statename varchar(225) null, lat varchar(20) null, lng varchar(20) null );';
		conn.query(q, (e)=>{console.log('[IGNORE] "localities" table might already be present, hence unable to create another.');});
	}
	catch(e){
		console.log('[IGNORE] localities table might already be present, hence unable to create another.');
	}
	let pincode = request.body.pincode, areaName = request.body.areaName,cityType=request.body.cityType,
		districtname=request.body.districtName,statename=request.body.stateName,status=request.body.status;
	console.log('Pincode was '+pincode + ' Areaname ' + areaName);
	cityType = cityType.toUpperCase();
	q = 'insert into localities(pincode, areaname, city_type, status, districtname, statename) values("'+pincode+'","'+areaName+'","'+cityType.toUpperCase()+'","'+status+'","'+districtname+'","'+statename+'");';
	conn.query(q,(e)=>{if (e) {console.log('[ERR] err while inserting into database\n\tSimilar Area Name is already present');anyerr=true; sameAreaName=true; }else{console.log('[SUCCESS] inserted into database');}});

	//disconnect_from_database();   -> dont enable this.
	if(anyerr==true && sameAreaName==false){
		 output['Success']='N';
	}
	else if(anyerr==true && sameAreaName==true){
		output['Success']='N';
		output['err_message']='same areaName exists';
	}
	else{
		output['Success']='Y';
	}
	anyerr=false;
	sameAreaName=false;

	console.log(output);
	res.send((output));
}

function getLocalityList(req,res){
	
	var arr;
	
	output['Success']='N';
	output['err_message']='';
	if(count2==0){
		count++;
		count2++;
		connect_to_database();
	}
	q = 'select * from localities limit  100;';
	conn.query(q, (e,result)=>{
		if (e) {console.log('Err while extracting data from localities table.');throw e;}
		arr = new Array(result.length);
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
			output['result'].push(obj);
		}
		done_link_getLocalityList(req,res); // to prevent the pre-execution of lines, a default fault in js
	});
}
function done_link_getLocalityList(req,res) {
	output['Success']='Y';
	res.send(output);
	output['result']=[];
}






module.exports = {
	addLocality: addLocality,
	viewLocality: getLocalityList,
}
/* for signing up for advertisers */

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
var isErr=false;


function addAvertiserSignUp(req,res) {
    let name_entity=req.body.name_entity,
		pincode=req.body.pincode,
		phone=req.body.phone,
		logo_addr='',
		gstin=req.body.gstin,
		email=req.body.email,
		password=req.body.password;
	try{
		q='create table advertisers2 (id bigint(20) primary key auto_increment ,\
			name_entity varchar(200) null,pincode varchar(20) null, phone varchar(20) null,\
			logo_addr varchar(200) null,gstin varchar(30) null,email varchar(100) null\
			,password varchar(100) null);'
		conn.query(q, e=>{
			if(e){
				console.error('[IGNORE] while creating advertisers table, miht already be created ');
			}
			else{
				console.warn('[SUCCESS] created advertisers table');
			}
		});
	}
	catch(e){
		console.error('[IGNORE] while creating advertisers table, miht already be created ');
	}
	q='insert into advertisers2(name_entity,pincode,phone,logo_addr,gstin,email,password)\
		values("'+name_entity+'","'+pincode+'","'+phone+'","'+logo_addr+'","'+gstin+'","'+
		email+'","'+password+'");';
	conn.query(q, e=>{
		if(e) {console.error('[ERR] while inserting into advertisers');throw e}
		else{
			console.debug('[SUCCESS] inserted into advertisers')
		}
	});
	let mobile=req.body.mobile;
	q='insert into users2(role,mobile,name,email,email_verified,password,status) \
		values("advertiser","'+mobile+'","'+name_entity+'","'+email+'",'+0+',"'+password+'","'+
		'active");';
	conn.query(q, e=>{
		if(e) {console.error('[ERR] while inserting into users for advertisers');throw e}
		else{
			console.debug('[SUCCESS] inserted into users for advertisers')
		}
		isErr=false;
		res_send(res);
	});

    
}
function res_send(res) {
    if(isErr==true){
        output['Success']='N';
    }
    else{
        output['Success']='Y';
        output['err_message']='none';
    }
    res.send(output);
    isErr=false;
    output['err_message']='none';
    output['result']=[];
    output['result_alt']=[];
}
function profile(req, res) {
	let mobile=req.body.mobile;
	q='select * from users2 where mobile="'+mobile+'";';
	conn.query(q, (e, result)=>{
		if(e) throw e;
		else{
			obj={
				'id':result[0]['id'],
				'role':result[0]['role'],
				'mobile':result[0]['mobile'],
				'name':result[0]['name'],
				'email':result[0]['email'],
				'email_verified':result[0]['email_verified'],
				'password':result[0]['password'],
				'status':result[0]['status'],
				'created':result[0]['created'],
				'modified':result[0]['modified'],
			};
			output['result'].push(obj);
			res_send(res)
		}
	})
}


module.exports = {
	signUp:addAvertiserSignUp,
	profile:profile,
}
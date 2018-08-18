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
var isErr = false, uniqueErr = false;


function add_agentComission(req,res) {
	let name=req.body.name,
		currency=req.body.currency,
		country=req.body.country,
		fixedo=req.body.fixedo,
		type=req.body.type,
		// fixedm=req.body.fixedm,
		percentageo=req.body.percentageo,
		// percentagem=req.body.percentagem,
		validity=req.body.validity,
		minsignups=req.body.minsignups,
		slots=req.body.slots,
		slot_duration=req.body.duration;
	if (slots==undefined) 
		slots = null;
	console.log( percentageo)
	if( percentageo ==undefined)
		percentageo = null;
	if (fixedo==undefined) 
		fixedo = null;
	if (fixedo == percentageo == null) {
		console.log('[ERR] both fixed and percent values null. Cannot add to the table.')
	}
	console.log('percent :' + percentageo)
	console.log(name+currency+country+fixedo+type+percentageo+validity+minsignups+slots);


	
		q='create table agents_comission(id int primary key auto_increment, name varchar(100) null, currency varchar(100) null, \
		 country varchar(100) null, \
		 validity float null, minsignups int null, slots varchar(300) null, slot_duration varchar(300) null);';
		conn.query(q, e => {
			if (e) {console.warn('[IGNORE] table agents_comission might already exist ')}
			else
				console.debug('[SUCCESS] Created Table agents_comission successfully')
		});
	
	
	q= 'insert into agents_comission(name,currency,country,validity,minsignups,slots, slot_duration) values ("'+name+'","'+currency+'","'+country+'",'+validity
		+','+minsignups+',"'+slots+'","'+slot_duration+'");';
	conn.query(q, e => {
		if (e) {console.error('[ERR] while inserting to table agents_comission');throw e}
		else
			console.debug('[SUCCESS] added to table agents_comission');
		res_send(res);
	});
}
function viewAgentComission(req,res) {
	q='select * from agents_comission;'
	conn.query(q, (e, r) => {
		if(e){console.error('[ERR while retriving data from agents_comission table');isErr=true;throw e}
		else {
			for(let rr=0; rr< r.length;rr++) {
				obj = {
					'id':r[rr]['id'],
					'name':r[rr]['name'],
					'currency':r[rr]['currency'],
					'country':r[rr]['country'],
					'validity':r[rr]['validity'],
					'minsignups':r[rr]['minsignups'],
					'slots':r[rr]['slots'],
					'slot_duration':r[rr]['slot_duration']
				}
				output['result'].push(obj);
			}
			res_send(res);
		}
	});
}

function res_send(res) {
	if (isErr==false) 
		output['Success']='Y';
	else
		output['Success']='N';
	res.send(output);
	output['result']=[];
	output['result_alt']=[];
}


module.exports = {
	add_agent_comission: add_agentComission,
	view: viewAgentComission,

}
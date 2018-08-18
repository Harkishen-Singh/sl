var mysql=require('mysql'),request=require('request');
var q='', count=0;count2=0
let conn = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'hsinghbb',
	database:'mission_sl'
});
var isErr=false,uniqueErr=false;
var output={
	'Success':'N',
	'err_message':'none',
	'result':[],
	'result_alt':[],
};
function res_send(res,isErr) {
	if (isErr==true) {output['Success']="N";}
	else
		output['Success']="Y";
    res.send(output);
    output['result']=[];
    output['result_alt']=[];
	isErr=false;
}

function fetch_campaign_city_type(req,res){
    q = 'select distinct city_type from localities;';
    conn.query(q, (e,result)=>{
        if(e) {throw e;isErr=true}
        else{
            console.warn(result);
            isErr=false;
            for(let i=0;i<result.length;i++)
                console.warn(result[i]['city_type'])
            output['result']=result;
            res_send(res);
        }
    });
}
function fetch_country(req,res){
    q = 'select distinct name from countries;';
    conn.query(q, (e,result)=>{
        if(e) {throw e;isErr=true}
        else{
            console.warn(result);
            isErr=false;
            output['result']=result;
            res_send(res);
        }
    });
}
function fetch_currency(req,res){
    q = 'select distinct name from currencies;';
    conn.query(q, (e,result)=>{
        if(e) {throw e;isErr=true}
        else{
            console.warn(result);
            isErr=false;
            output['result']=result;
            res_send(res);
        }
    });
}

function fetch_advertisers(req,res) {
    q='select * from users2 where role="advertiser";';
    conn.query(q, (e, result)=>{
        if(e) {console.error('[ERR] while retriving advertisers list');isErr=true;}
        else{
            for(let i=0;i<result.length;i++) {
                obj={
                    'id':result[i]['id'],
                    'name_entity':result[i]['name'],
                    // 'pincode':result[i]['pincode'],
                    'phone':result[i]['mobile'],
                    // 'logo_addr':result[i]['logo_addr'],
                    // 'gstin':result[i]['gstin'],
                    'email':result[i]['email'],
                    'password':result[i]['password'],
                };
                output['result'].push(obj);
            }
            isErr=false;
            console.warn(output['result'])
            res_send(res);
        }
    })
}

module.exports = {
    campaign_city_type:fetch_campaign_city_type,
    fetch_currency:fetch_currency,
    fetch_country:fetch_country,
    fetch_advertisers:fetch_advertisers,
}
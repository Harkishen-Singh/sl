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

module.exports = {
    campaign_city_type:fetch_campaign_city_type,
    fetch_currency:fetch_currency,
    fetch_country:fetch_country,
}
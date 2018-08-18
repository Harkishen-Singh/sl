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

function request_initiate(req,res) {
    q='create table links(id bigint(10) primary key auto_increment, advertiser_id varchar(100) null, agent_id varchar(100) null, link_status \
        varchar(100) null, created timestamp(6) null, accepted timestamp(6) null, removed timestamp(6) null, \
        modified timestamp(6) null);';
    conn.query(q, e=>{
        if(e){console.warn('[IGNORE] while creating linking table, might already be created');}
        else{
            console.warn('[SUCCESS] created the links table');
        }
    });
    let advertiser_id_phone = req.body.advertiser_id_phone,
        agent_id_phone = req.body.agent_id_phone;
    console.warn('Adv phone:'+advertiser_id_phone+'\tAgent phone:'+agent_id_phone)
    q='select id from users2 where mobile="'+advertiser_id_phone+'";'
    conn.query(q, (e, result)=>{
        if(e) throw e;
        console.warn(result)
        var advertiser_id = result[0]['id'];
        q='select id from users2 where mobile="'+agent_id_phone+'";'
        conn.query(q, (e, result2) =>{
            if(e) throw e;
            var agent_id = result2[0]['id'];
            console.warn('Received from DB agentID : '+agent_id+'\tadvertiserID : '+advertiser_id);
            q='insert into links(advertiser_id,agent_id,link_status,created) values ("'+advertiser_id+'","'+agent_id+'","requested",now())';
            conn.query(q, e=>{
                if(e) {  console.error('[ERR] while inserting into links table');throw e;  }
                else {
                    console.warn('[SUCCESS] inserted into the links table agent: '+agent_id+'\tadvertiser: '+advertiser_id);
                }
            })

        })
    })
    
    
    isErr=false;
    res_send(res);
}

function showAdvertisersLinked(req, res) {
    let agent_mobile=req.body.agent_phone;
    console.warn(agent_mobile)
    q='select id from users2 where mobile="'+agent_mobile+'";';
    conn.query(q, (e, result)=>{
        if(e) throw e;
        let agent_id = result[0]['id'];
        q='select * from links where agent_id='+agent_id+';';
        conn.query(q, (e, result1)=>{
            if(e) throw e;
            for(let i=0;i<result1.length;i++) {
                let adv_id=result1[i]['advertiser_id'];
                q='select name from users2 where id='+adv_id+';';
                conn.query(q, (e, result2)=>{
                    if(e) throw e;
                    if(result1[i]['link_status']!='cancelled'){
                        obj={
                            'id':result1[i]['id'],
                            'advertiser_id':result1[i]['advertiser_id'],
                            'agent_id':result1[i]['agent_id'],
                            'link_status':result1[i]['link_status'],
                            'created':result1[i]['created'],
                            'accepted':result1[i]['accepted'],
                            'removed':result1[i]['removed'],
                            'modified':result1[i]['modified'],
                            'name':result2[0]['name'],
                        }
                        console.warn(obj)
                        output['result'].push(obj);
                    }
                    if(output['result'].length==result1.length){
                        console.warn('thisssss')
                        console.warn(output['result'])
                        res_send(res)
                        console.warn('response sent')
                    }
                })

            }
        })
    })
}

function agentsShow(req, res){
    let advertiser_phone = req.body.advertiser_phone;
    console.warn('advertiser phone:'+advertiser_phone)
    q='select id from users2 where mobile="'+advertiser_phone+'";';
    conn.query(q, (e, result)=>{
        if(e) throw e;
        // console.warn('result from users2 ')
        // console.warn(result)
        let advertiser_id = result[0]['id'];
        console.warn(advertiser_id)
        q='select * from links where advertiser_id='+advertiser_id+';';
        conn.query(q, (e, result2)=>{
            if(e) throw e;
            console.warn('result2 below')
            console.warn(result2)
            for(let i=0;i<result2.length;i++){
                
                console.warn('agent_id this : '+result2[i]['agent_id'])
                q='select name,mobile from users2 where id='+result2[i]['agent_id']+';';
                conn.query(q, (e, result3) => {
                    if(e) throw e;
                    else{
                        obj={
                            'id':result2[i]['id'],
                            'link_status':result2[i]['link_status'],
                            'agent_id':result2[i]['agent_id'],
                            'advertiser_id':result2[i]['advertiser_id'],
                            'created':result2[i]['created'],
                            'accepted':result2[i]['accepted'],
                            'removed':result2[i]['removed'],
                            'modified':result2[i]['modified'],
                            'name':'',
                            'mobile':'',
                        }
                        console.warn('resut3 below')
                        console.warn(result3[0]['name'])
                        obj['name']=result3[0]['name'];
                        obj['mobile']=result3[0]['mobile'];
                        console.warn(obj)
                        output['result'].push(obj);
                        if(i+1==result2.length){
                            console.warn('result array below')
                            console.warn(output['result'])
                            res_send(res);
                        }
                    }
                })
                
            }
            
        })
    })
}
function confirmRequest(req, res) {
    let agent_id = req.body.agent_id,advertiser_id=req.body.advertiser_id;
    q='update links set link_status="confirmed",accepted=now(),modified=now() where advertiser_id='+advertiser_id+' and agent_id='+agent_id+' ;';
    console.warn(q)
    conn.query(q, e=>{
        if(e) throw e;
        else{
            console.warn('[SUCCESS] updated link_status to confirmation for agent_id: '+agent_id);
        }
    })
}
function cancelRequest(req, res) {
    let agent_id = req.body.agent_id,advertiser_id=req.body.advertiser_id;
    q='update links set link_status="cancelled",removed=now(),modified=now() where advertiser_id='+advertiser_id+' and agent_id='+agent_id+' ;';
    console.warn(q)
    conn.query(q, e=>{
        if(e) throw e;
        else{
            console.warn('[SUCCESS] updated link_status to cacelled for agent_id: '+agent_id);
        }
    })
}
function agentAdvSpecific(req,res) {
    let agent_phone= req.body.agent_id;
    console.warn(agent_phone)
    q='select id from users2 where mobile="'+agent_phone+'";';
    conn.query(q, (e, result11) =>{
        if(e) throw e;
        else{
            console.warn(result11[0]['id'])
            agent_id=result11[0]['id'];
            q='select advertiser_id from links where agent_id='+agent_id+' and link_status="confirmed" ;';
    conn.query(q, (e, result)=>{
        if(e) throw e;
        else{
            console.warn('result result below')
            console.warn(result)
            for(let i=0;i<result.length;i++) {
                advertiser_id=result[i]['advertiser_id'];
                q='select name, mobile,id from users2 where id='+advertiser_id+';';
                conn.query(q, (e,result2)=>{
                    if(e) throw e;
                    else{
                        console.warn('got inininni')
                        obj={
                            'name':result2[0]['name'],
                            'mobile':result2[0]['mobile'],
                            'id':result2[0]['id'],
                            'value':result2[0]['name'],
                        };
                        console.warn(obj)
                        output['result'].push(obj);
                        if(i+1==result.length)
                            {isErr=false;console.warn(output['result']); res_send(res);}
                    }
                })
            }
        }
    })
        }
    })



    
}


module.exports = {
    initiate: request_initiate,
    showAgents:agentsShow,
    confirm:confirmRequest,
    cancel:cancelRequest,
    agentAdvSpecific:agentAdvSpecific,
    showAdvertisersLinked:showAdvertisersLinked,
}
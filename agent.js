/* for signing up for agents */

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

function addAgentSignUp(req,res) {
    let name=req.body.name,
        user_id = req.body.mobile,
        addr=req.body.address,
        phone=req.body.phone,
        gst=req.body.gst,
        adhaar=req.body.adhaar,
        pincode=req.body.pincode,
        pan=req.body.pan,
        email=req.body.email,
        bank_name=req.body.bank_name,
        acc_num=req.body.acc_num,
        ifsc=req.body.ifsc,
        bankbranch=req.body.bankbranch,
        password=req.body.password;
    let address_id=0, user_id2=0;
    console.debug(name+user_id+addr+phone+gst+adhaar+pan+email+password);
    q='insert into addresses(line1) values("'+addr+'");';
    conn.query(q, e => {
        if (e) {
            console.log('[ERR] while inserting into addresses table in column line1')
            throw e;
        }
        else
            console.log('[SUCCESS] inserted successfully in addresses')
    });
    q = 'select * from addresses where line1="'+addr+'";';
    conn.query(q, (e, r)=>{
        if(e)
        throw e;
        else
        address_id = r[0]['id'];
        console.warn(address_id);

        q='insert into users2(role,mobile,name,email,email_verified,password,status) values \
            ("agent","'+user_id+'","'+name+'","'+email+'",'+0+',"'+password+'","'+'active'+'");';
        conn.query(q, e => {
            if(e){console.warn('[ERR] while inserting into users during agentSignUp');throw e}
            else
                console.debug('[SUCCESS] added to users during agentSignUp ')
        });
        q = 'select * from users2 where mobile="'+user_id+'";';
        conn.query(q, (e, r) => {
            if(e) {console.debug('[ERR while retriving user_id / mobile from users table');throw e}
            else
                console.debug('[SUCCESS] retrived user_id / mobile from users table');
            user_id2=r[0]['id'];
            console.warn(user_id2);
            q= 'insert into agents2(user_id,address_id,phone,pincode,gstin,aadhaar_number,pan_num,bank_name,acc_num \
                ,ifsc_code,bank_branch \
                 ) values('+user_id2+','+address_id+',"'+phone+'","'+pincode+'","'+
                 gst+'","'+adhaar+'","'+pan+'","'+bank_name+'","'+acc_num+'","'+ifsc+'","'+bankbranch+'");'
            conn.query(q, e => {
                if(e) {console.warn('[ERR] while inserting into agents table');throw e;}
                else 
                    console.debug('[SUCCESS] inserted into agents table')
                isErr=false;
                res_send(res);
            });

        });

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

function showProfile(req,res) {
    q='select * from users where mobile='+req.body.user_id+';';
    conn.query(q, (e,r) => {
        if(e) {console.error('[ERR] while retriving data from agents table for profile view');throw e}
        else{
            console.debug('[SUCCESS] retrived data successfully for profile');
            console.warn('r below')
            console.warn(r);
            var name=r[0]['name'],role=r[0]['role'],
                    mobile_aka_user_id = r[0]['mobile'],
                    email=r[0]['email'],
                    email_verified=r[0]['email_verified'],
                    created2=r[0]['created'],id=r[0]['id'],
                    status=r[0]['status'];
            q='select * from agents2 where user_id='+id+';';
            conn.query(q, (e, r1) => {
                if(e) {throw e;}
                else{
                    console.warn('r1 below')
                    console.warn(r1)
                    var user_id =req.body.user_id,
                address_id=r1[0]['address_id'],
                phone=r1[0]['phone'],
                pincode=r1[0]['pincode'],
                gstin=r1[0]['gstin'],
                aadhaar_number=r1[0]['aadhaar_number'],
                pan_num=r1[0]['pan_num'],
                bank_name=r1[0]['bank_name'],
                acc_num=r1[0]['acc_num'],
                ifsc_code=r1[0]['ifsc_code'],
                created_by=r1[0]['created_by'],
                created=r1[0]['created'],
                modified_by=r1[0]['modified_by'],
                modified=r1[0]['modified'],
                bank_branch=r1[0]['bank_branch'];

                
                q='select * from addresses where id='+address_id+';';
                conn.query(q, (e, r2) => {
                    if(e){throw e;}
                    else{
                        console.warn('r2 below')
                        console.warn(r2)
                    var address = r2[0]['line1'];
                    obj={
                        'name':name,
                        'user_id':user_id,
                        'address_id':address_id,
                        'phone':phone,
                        'pincode':pincode,
                        'gstin':gstin,
                        'aadhaar_number':aadhaar_number,
                        'pan_num':pan_num,
                        'bank_name':bank_name,
                        'acc_num':acc_num,
                        'ifsc_code':ifsc_code,
                        'created_by':created_by,
                        'created':created2,
                        'modified_by':modified_by,
                        'modified':modified,
                        'bank_branch':bank_branch,
                        'mobile':mobile_aka_user_id,
                        'email':email,
                        'email_verified':email_verified,
                        'status':status,
                        'role':role,
                        'address':address,
                    };
                    console.warn(obj)
                    output['result'].push(obj);
                    res_send(res);
                }
                });
            }
            });
        }
    });
}

function storeOTP(req, res) {
    let medium=req.body.medium,
        code=req.body.code,
        status='active';
    q = 'insert into users_otp(phone_email,code,status) values("'+medium+'","'+code+'","'+status+'");';
    conn.query(q, e => {
        if(e) throw e;
        else{
            console.debug('[SUCCESS] stored otp for number '+medium);isErr=false;
            res_send(res);
        }
    });

}
function retriveOTP(req,res) {
    q='select * from users_otp where phone_email="'+req.body.medium+'" and status="active";';
    conn.query(q, (e, r)=>{
        if(e) throw e;
        else{
            let code_r = r[0]['code'];
            console.warn(code_r+' '+req.body.code)
            if(code_r==req.body.code){
                a={
                    matches:'yes'
                };
                output['result'].push(a);
                q='update users_otp set status="inactive" where phone_email="'+req.body.medium+'" and status="active";';
                conn.query(q, e=> {
                    if(e) throw e;
                });
                res_send(res);
            }
            else{
                a={
                    matches:'no'
                };
                output['result'].push(a);
                q='update users_otp set status="active" where phone_email="'+req.body.medium+'" and status="active";';
                conn.query(q, e=> {
                    if(e) throw e;
                });
                res_send(res);
            }
        }
    });
}
function agentLogin(req,res){
    let phone = req.body.phone,password=req.body.password;
    q='select * from users2 where mobile="'+phone+'";';
    conn.query(q, (e,result)=>{
        if(e) {console.error('[ERR] while checking agents records. Record not found');
        output['Success']='N';
        isErr=true
        res_send(res)
    }
        else{
            let passDB = result[0]['password'];
            if(passDB==password){
                output['Success']='Y';
                obj={
                    'role':result[0]['role'],
                    'id':result[0]['id'],
                }
                output['result'].push(obj);
                isErr=false;
            }
            else{
                output['Success']='N';
                isErr=true;
            }
            console.warn(output)
            console.warn(output['result'][0]['role'])
            res_send(res)
        }
    })
}

module.exports = {
    signUp: addAgentSignUp,
    profile:showProfile,
    OTPstore:storeOTP,
    retriveOTP:retriveOTP,
    login:agentLogin,
}
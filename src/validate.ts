/*
 * @Description: Lingluo
 * @Author: Lingluo
 * @Date: 2018-11-27 18:22:48
 * @Last Modified by: Lingluo
 * @Last Modified time: 2018-11-27 18:22:48
 */
var validate = function() {
	var s = ['require', 'len','minLen','maxLen','pattern', 'test'];
	var len = s.length;

	function trim(a){
		return a.toString().replace(/^\s+|\s+$/g, '');
	}

    var validator = {
        require: function(a, bool){
            if (bool === true)
            {
                return (typeof a !== 'undefined') && (a !== null) && !!trim(a);
            }
            else if (bool === false)
            {
                return true;
            }
        },
        len: function(a, len){
            return (typeof a !== 'undefined') && (a !== null) && trim(a).length === len;
        },
        minLen:function(a,len){
        	return (typeof a !== 'undefined') && (a !== null) && trim(a).length >= len;
        },
        maxLen:function(a,len){
        	return (typeof a !== 'undefined') && (a !== null) && trim(a).length <= len;
        },
        pattern: function(a, pattern){
            return pattern.test(a);
        },
        test: function(a, fn, c) {
        	var result = fn(a, c);
            return typeof result !== 'undefined' ? result : true;
        }
    };

    return function(rule, data){
	        if ('object' === typeof data && 'object' === typeof rule)
	        {
	            for (var i in rule)
	            {
	                if (rule.hasOwnProperty(i))
	                {
	                    var item = rule[i];
	      				for (var j = 0 ; j < len; j++)
	                    {
	                        if (item.hasOwnProperty(s[j]))
	                        {
	                         
	                            if(s[j] === "test")
	                            {
	                            	if(item[s[j]] instanceof Array)
	                            	{
	                            		for(var k = 0 ,klen = item[s[j]].length ; k < klen ; k++)
	                            		{
	                            			var result =  validator[s[j]](data[i], item[s[j]][k].val,data);
	                            			if(!result)
	                            			{
	                            				return {status:false,msg:item[s[j]][k].msg || ''};
	                            			}
	                            		}
	                            	}
	                            	else
	                            	{
	                            		var result =  validator[s[j]](data[i], item[s[j]].val,data);
	                            	}
	                            	
	                            }
	                            else
	                            {
	                            	var result =  validator[s[j]](data[i], item[s[j]].val);
	                            }

	                            if(result && s[j] === 'require' && (data[i] === undefined || data[i] === null || trim(data[i]) === ''))
	                            {
	                            	break;
	                            }

	                            if (!result) 
	                            {
	                                return {status: false,msg: item[s[j]].msg || ''};
	                            }
	                        }
	                    }
	                }
	            }
	            return {status: true};
	        }
	        else
	        {
	            throw new Error('params type error');
	        }
	    }
}();


/*
*
*rule 规则格式
rules ={
    "nick": {
        "require": {
            "val": true, 
            "msg": "名称不能为空"
        }
    }, 
    "email": {
        "require": {
            "val": false, 
            "msg": "邮箱不能为空"
        }, 
        "pattern": {
            "val": new RegExp(/^[a-zA-Z0-9]+[a-zA-Z0-9\.-_]*@[a-zA-Z0-9]+\.[\w]+$/i), 
            "msg": "邮箱格式不正确"
        }
    }, 
    "content": {
        "require": {
            "val": true, 
            "msg": "内容不能为空"
        }
    }, 
    "verify": {
        "require": {
            "val": true, 
            "msg": "验证码不能为空"
        }, 
        "len": {
            "val": 4, 
            "msg": "验证码位数不正确"
        }
    }
}
*要验证的data格式
data = {
	email:'xxx',
	nick:'xxx',
	content:'xxx'
}
*
*/

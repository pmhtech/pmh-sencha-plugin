Ext.define('PmhTech.field.VTypes',{
    
    singleton : true,
    blankText :'값을 입력하세요',
    emailText : '올바른 이메일 형식을 입력하세요',
    phoneText : '올바른 핸드폰번호가 아닙니다.',
    emailPhoneText : '잘못된 이메일 또는 핸드폰번호입니다.',
    dateYmdText : '올바른 날짜형식이 아닙니다',
    hhmiText : '올바른 시간 형식이 아닙니다',
    h24miText : '올바른 시간 형식이 아닙니다',
    hhText : '[시간]설정이 잘못되었습니다.',
    miText : '[분]설정이 잘못되었습니다.',
    passwordText : '비밀번호는 최소 8글자 이상 20글자 미만입니다.',
    loginPasswordText : '비밀번호는 최소 6글자 이상 20글자 미만입니다.',
    loginPassword : function(value){
        if(!(value && value.length>=6 && value.length<=20)){
            return this.loginPasswordText;
        }
        return true;
    },
    password : function(value){
        if(!(value && value.length>=8 && value.length<=20)){
            return this.passwordText;
        }
        return true;
        
    },
    blank : function(value){
        if(Ext.isEmpty(value)){

            return this.blankText;
        }
        return true;

    },
    hh: function(value){

        value = parseInt(value);

        if(isNaN(value)){
            return this.hhText;
        }

        if(value>=1 && value<=12){
            return true;
        }

        return this.hhText;

    },
    mi : function(value){

        value = parseInt(value);

        if(isNaN(value)){
            return this.miText;
        }

        if(value>=0 && value<=59){
            return true;
        }

        return this.miText;

    },
    h24mi : function(value){

        var hour = value.substr(0,value.indexOf(':'));
        var min = value.substr(value.indexOf(':')+1);


        var hh = parseInt(hour);
        var mi = parseInt(min);

        if(isNaN(hh) || isNaN(mi)){
            return this.hhmiText;
        }

        if(!(hh>=0 && hh<=23)){
            return this.hhmiText;
        }
        if(!(mi>=0 && mi<=59)){
            return this.hhmiText;
        }
        return true;


    },
    hhmi : function(value){



        var rawData = value.replace(/[^0-9]/g,"");

        if(rawData.length!=4){
            return this.hhmiText;
        }

        var hh = parseInt(rawData.substr(0,2));
        var mi = parseInt(rawData.substr(2,2));

        if(isNaN(hh) || isNaN(mi)){
            return this.hhmiText;
        }

        if(!(hh>=0 && hh<=12)){
            return this.hhmiText;
        }
        if(!(hh>=0 && hh<=59)){
            return this.hhmiText;
        }
        return true;
        
    },
    dateYmd :function(value){

        var rawData = value.replace(/[^0-9]/g,"");

        if(rawData.length!=8){
            return this.dateYmdText;
        }

        var dateText = Ext.String.format('{0}-{1}-{2}',rawData.substr(0,4),rawData.substr(4,2),rawData.substr(6,2));

        return Ext.Date.format(new Date(dateText),'Ymd') == rawData ? true : this.dateYmdText;
    },

    email : function(value){
        var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        if(regExp.test(value)){
            return true;
        }
        return this.emailText;
    },

    emailPhone : function(value){

        var me = PmhTech.field.VTypes;
        var errMsg1=me.email(value);
        var errMsg2=me.phone(value);



        if(errMsg1===true || errMsg2===true){
            return true;
        }

        return this.emailPhoneText;

    },

    phone : function(value){

        var regExp1 = /^\d{3}-\d{3,4}-\d{4}$/; //Dash붙는 형식
        var regExp2 = /^\d{10,11}$/; // Dash 없는 형식

        if(regExp1.test(value) ||regExp2.test(value)){
            return true;
        }
        return this.phoneText;
    }
});
/**
 *
 */
Ext.define('PmhTech.utils.Form', {
    alternateClassName: ['PmhTech.Form'],
    extend: 'Ext.Base',

    requires: [
        'PmhTech.utils.Msg'
    ],
    singleton: true,

    isValidForm: function (forms,dirtyCheck) {

        if(Ext.isEmpty(dirtyCheck)) {
            dirtyCheck=true;
        }

        if(!Ext.isArray(forms)){
            forms = [forms];
        }

        var errorField = null;
        var errorMessages = [];
        for(var i=0;i<forms.length;i++){
            var form = forms[i];

            var errorObj = form.getErrorMessages();
            if (errorObj != null) {
                if (errorField == null) {
                    errorField = errorObj.errorField;
                }
                errorMessages.push(errorObj.errorMessage);
            }
        }
        errorMessages=errorMessages.join('<br>')
        if (errorMessages.length > 0) {
            PmhTech.Msg.alert('오류', errorMessages, function () {
                errorField.focus();
            });
            return false;
        }

        if(dirtyCheck===true){
            if(!PmhTech.Form.isDirty(forms)){
                PmhTech.Msg.alert('확인', '변경된 내용이 없습니다.');
                return false;
            }
        }

        return true;
    },
    isDirty : function(forms){

        if(!Ext.isArray(forms)){
            forms = [forms];
        }

        for(var i=0;i<forms.length;i++){
            var form = forms[i];

            if(form.isDirty()){
                return true;
            }
        }
        return false;

    },

    getValues: function (forms) {

        if(!Ext.isArray(forms)){
            forms = [forms]
        }

        var data = {};
        for(var i=0;i<forms.length;i++){
            var form = forms[i];
            Ext.apply(data, form.getValues());
        }

        return data;
    },

    forceReset : function (forms){
        if(!Ext.isArray(forms)){
            forms = [forms]
        }

        for(var i=0;i<forms.length;i++){
            var form = forms[i];
            form.forceReset();
        }
    },
    setReadOnlyFields : function(forms,readOnly,fields){
        if(!Ext.isArray(forms)){
            forms = [forms]
        }
        for(var i=0;i<forms.length;i++){
            var form = forms[i];
            form.setReadOnlyFields(readOnly,fields);
        }


    }
});
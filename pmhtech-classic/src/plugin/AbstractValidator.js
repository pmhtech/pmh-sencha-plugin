/**
 *
 *
 * Validator Plugin 함수
 *
 *
 */
Ext.define('PmhTech.plugin.AbstractValidator', {
	extend: 'Ext.AbstractPlugin',
	/**
	 *  Form Field상의 에러메시지를 전부 가져온다.
	 *
	 * @private
	 * @param {Array} arrField Ext.form.field.Base를 상속받은 객체들이 들어와야만 합니다
	 * @return {Object} 에러가 없다면 null을 리턴 Prototype으로 리턴합니다. obj.errorField, obj.errorMessage 만약에
	 *
	 */

	getFieldsErrorMessage : function(fields){
		var returnObj = {
			errorMessage:null,
			errorField : null
		};

		var errorMessages = [];


		for(var i=0;i<fields.length;i++){
			var field= fields[i];
		    var value = field.getValue();

		    if(field.isXType('treepicker') && field.getPicker().rootVisible==false){
		    	if(value=='root'){
		    		value = null;
				}
			}


		    var error = field.getErrors(value)[0];

            if(error) {

                if(field.fieldLabel){
                	var label = field.fieldLabel.replaceAll('<br>',' ').replaceAll('</br>',' ')
                    error = Ext.String.format('<b>[{0}]</b> {1}',label,error);
                }
                errorMessages.push(error);

                if(errorMessages.length==1){
                    returnObj.errorField = field;
                }
            }
        }

		// 에러필드가 존재하지 않으면 null 리턴을합니다.
		if(Ext.isEmpty(returnObj.errorField)){
			return null;
		}

		returnObj.errorMessage = errorMessages.join('<br>').toString();
		return returnObj;

	}
});
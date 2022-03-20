/**
 *
 *
 *  Form Validation으로 Form상에서 발생된 에러메시지들을 가져온다.
 *
 *
 *  { xtype :'formpanel
 *    plugins : [{
 *        ptype : 'pmh-form-validator'
 *    }]
 *  }
 *
 */
Ext.define('PmhTech.plugin.form.Validator', {
	extend: 'PmhTech.plugin.AbstractValidator',
	alias: 'plugin.pmh-form-validator',
	init: function (form) {
		var me = this;
		me.form = form;
		me.basicForm = form.getForm();
		me.basicForm.isValidForm = Ext.Function.bind(me.isValidForm, me);
		me.form.isValidForm = Ext.Function.bind(me.isValidForm, me);
		me.form.getErrorMessages = Ext.Function.bind(me.getErrorMessages, me);

	},
	/**
	 *
	 * 오류발생시 에러를 출력한다
	 *
	 * @return {Boolean} 오류 발생시 false 없으면 true
	 *
	 */
	isValidForm: function() {

		var basicForm = this.basicForm;
		var arrField = basicForm.getFields().items;

		var returnObj = this.getFieldsErrorMessage(arrField);


		if(Ext.isEmpty(returnObj)){
			return true;
		}
		Ext.Msg.alert('오류',returnObj.errorMessage,function(){
			returnObj.errorField.focus();
		});

		return false;
	},



	getErrorMessages : function(){

		var basicForm = this.basicForm;
		var arrField = basicForm.getFields().items;

		var returnObj = this.getFieldsErrorMessage(arrField);

		return returnObj;

	}


});
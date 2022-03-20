/**
 *
 * trackResetOnLoad 를 활성화시켜 loadData 또는 setValues할때 Original값을 유지시키도록 하는 함수
 * 최초 렌더링되었을때 값을 돌려주는 함수가 없으므로 forceReset을 구현하였습니다.
 *
 *
 */
Ext.define('PmhTech.plugin.form.DirtyChecker', {
	extend: 'Ext.AbstractPlugin',
	alias: 'plugin.pmh-form-dirty-checker',
	init: function (form) {
		var me = this;
		me.form = form;
		me.form.trackResetOnLoad = true;

		me.basicForm = form.getForm();
		me.basicForm.trackResetOnLoad = true;


		me.form.getOriginalValues = Ext.Function.bind(me.getOriginalValues, me);
	},

	/**
	 * 변경되기전 Original값을 가져온다
	 * @return {Object} 변경되기전값을 리턴한다
	 *
	 */
	getOriginalValues: function(){
		var me = this.basicForm;
		var fields = me.getFields().items;
		var valueObject ={};

		for(var i=0;i<fields.length;i++){
			var field = fields[i];
			valueObject[field.name]=field.originalValue;
		}
		return valueObject;
	}
});
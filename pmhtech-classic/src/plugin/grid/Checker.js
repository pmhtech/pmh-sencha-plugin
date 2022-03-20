/**
 *
 *
 *   CheckBoxSelectionModel을 사용하면 Check 기능을 넣을수 있습니다.
 *   하지만 Check와 Select를 따로 적용시킬때 사용되는 플러그인입니다.
 *
 *
 */
Ext.define('PmhTech.plugin.grid.Checker', {
	extend: 'Ext.AbstractPlugin',
	alias: 'plugin.pmh-grid-checker',

	/**
	 * @cfg {string}
	 * CheckBox Grid에 사용될 dataIndex
	 */
	dataIndex: 'isChecked',


	init: function (grid) {
		var me = this;
		me.grid = grid;
		grid.getCheckedSubmitData = Ext.Function.bind(me.getCheckedSubmitData, me);
		grid.getCheckedRecord= Ext.Function.bind(me.getCheckedRecord, me);

	},


	/**
	 * 현재 Check된 Record들을 반환한다
	 * @return {Ext.data.Model[]}  Ext.data.Model 의 구성됨
	 */
	getCheckedRecord: function () {
		var me = this;
		var store = this.grid.getStore();
		var arr = [];
		for (var i = 0; i < store.getCount(); i++) {

			var rec = store.getAt(i);
			if (rec.get(me.dataIndex) === true) {
				arr.push(rec);
			}
		}
		return arr;
	},

	/**
	 *
	 * SubmitData를 가져온다.
	 * @param {string[ ]} listDataIndex  가져올 대상 DataIndex
	 * @param {Object} injectData (optional) 각 요소별로 추가시킬요소
	 * @return  {Ext.data.Model[]}  Grid상에 Checked된 Record들을 반환
	 *
	 * */
	getCheckedSubmitData: function (listDataIndex,injectData) {

		var me = this;
		var grid = this.grid;
		var gridStore = grid.getStore();
		var gridDatas = [];

		for (var i = 0; i < gridStore.getCount(); i++) {
			var rec = gridStore.getAt(i);

			if(rec.get(me.dataIndex)!==true){
				continue;
			}
			var tempObj = {};

			if(Ext.isArray(listDataIndex)){
				for (var j= 0; j < listDataIndex.length; j++) {
					var key = listDataIndex[j];
					tempObj[key]= rec.get(key);
				}
			}else{
				Ext.iterate(rec.data,function(key,value){
					tempObj[key]=value;
				});
			}

			if(Ext.isObject(injectData)){
				Ext.apply(tempObj,injectData);
			}
			gridDatas.push(tempObj);
		}
		return gridDatas;
	}
});
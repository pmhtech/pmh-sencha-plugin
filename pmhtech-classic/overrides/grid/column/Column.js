/**
 *
 */
Ext.define('PmhTech.overrides.grid.column.Column', {
	override: 'Ext.grid.column.Column',
	style: 'textAlign:center',
	renderer : false,
    menuDisabled : true,
	hideLabel : true,
	initComponent: function () {

		var me = this;
		var align = me.initialConfig.align;
		if (me.editor) {

			me.editor.minWidth=null;
			me.editor.name = me.dataIndex;
			me.editor.hideLabel = me.hideLabel;

			Ext.apply(me, {
				editor: Ext.widget(me.editor.xtype, me.editor),
				getEditor: function () {
					return me.editor;
				}
			});
		}

		if(me.widget){
			me.widget.minWidth=null;
		}



		if(me.xtype=='rownumberer' || me.xtype=='pmh-checkcolumn'){
			align= 'center';
		}
		else if(me.xtype=='gridcolumn'){

			if(me.renderer===false){
				me.renderer =function (value, metaData, record, rowIndex, colIndex, store, view) {
					return value;
				}
			}

			var columnRenderer = Ext.clone(me.renderer);

			if(Ext.isEmpty(align) && Ext.isFunction(me.renderer)){

				switch(me.renderer.name){
					case 'numberRenderer' :
						align = 'end';
						break;
				}
			}
			align = align || 'center';



			Ext.apply(me, {

				renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {

					var columns = this.getColumns();



					var column = columns[colIndex];

					var dataIndex = column.dataIndex || '';


					dataIndex = dataIndex.split('.');

					if(dataIndex.length>1){

						value = record.data[dataIndex[0]];

						for(var i=1;i<dataIndex.length;i++) {

							if (value) {
								value = value[dataIndex[i]];
							}
						}
					}


					if(me.tdCls=='x-grid-middle-align'){

						switch(me.align){
							case 'start' :
							case 'left' :
								metaData.tdStyle='padding-left: 10px;';
								break;
							case 'end' :
							case 'right' :
								metaData.tdStyle='padding-right: 10px;';
								break;
						}


					}


					var editor = column.editor;
					if(editor){
						if(Ext.isFunction(this.getColumnError)){

							var error = this.getColumnError(value, rowIndex, editor,  store, this);
							if(error){
								metaData.style = 'background-color: red;color:white;font-weight:900;';
							}
						}
					}
					if (Ext.isFunction(columnRenderer)) {
						return Ext.callback(columnRenderer, this, [value, metaData, record, rowIndex, colIndex, store, view]);
					}

					return value;
				}
			});
		}


		Ext.apply(me,{
			align : align
		});
		me.callParent(arguments);
	}
});
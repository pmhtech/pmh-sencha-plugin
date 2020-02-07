Ext.define('PmhTech.view.global.north.GlobalNorth', {
	extend: 'Ext.panel.Panel',
	alias: 'widget.global-north',
	requires: [
		'Ext.button.Button',
		'Ext.container.Container',
		'Ext.form.field.Display',
		'Ext.layout.container.HBox',
		'PmhTech.utils.Jwt',
		'Farota.view.popup.user.check.UserCheckPopup'
	],
	style : {
		backgroundColor : 'white',

		boxShadow : '0 3px 6px 0 rgba(0, 0, 0, 0.16)'
	},
	bodyStyle : {
		boxShadow : '0 3px 6px 0 rgba(0, 0, 0, 0.16)'
	},
	layout: {
		type: 'hbox',
		align: 'stretch',
		pack : 'end'
	},
	items : [{
		xtype : 'container',
		html : '<div class="farota-logo">FAROTA</div>',
		width : 200,
	},{
		xtype : 'container',
		itemId : 'menuButtons',
		padding : '0 0 5 0',
		layout : {
			type : 'hbox',
			align : 'bottom'
		},
		defaults : {
			width : 100,
			height : 35,
			margin : '0 5 0 5'
		}
	},{
		xtype : 'container',
		padding : '0 0 5 0',
		layout: {
			type: 'hbox',
			align : 'bottom',
			pack : 'end'
		},defaults : {
			margin : '0 5 5 5'
		},
		flex : 1,
		items : [{
			xtype : 'container',
			itemId : 'localTime',
			data : {
				nowTime : '',
			},

		}]
	}, {
		xtype: 'container',
		data: {
			logout: ''
		},
		tpl: [

			'<div id="{[this.getLinkId(values)]}" class="x-card-hbox x-far-global-icon icon-global-user" style="margin-top:5px;cursor: pointer;"> </div>',
			'<div id="{[this.getLinkId(values)]}" class="x-card-hbox x-far-global-icon icon-global-logout" style="margin-top:5px;cursor: pointer;"> </div>',
			 {
			getLinkId: function (values) {

				var id = Ext.id();


				Ext.defer(function (id, values) {
					if (!Ext.get(id)) {
						return;
					}

					Ext.get(id).on('click', function (e) {


						var clazzName = e.target.className || '';
						if(clazzName.indexOf('icon-global-user')!=-1){

							PmhTech.utils.Window.showPopup('popup-user-check',{
								callbackScope: this,
								callbackFunc : function(){
								}
							});
						}else if(clazzName.indexOf('icon-global-logout')){
							PmhTech.Jwt.doLogout();
						}
						e.stopEvent();
					}, {
						id: id,
						data: values
					});
				}, 50, this, [id, values]);
				return id;
			}
		}]
	}]
});
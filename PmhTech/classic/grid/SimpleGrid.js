Ext.define('PmhTech.grid.SimpleGrid', {
	extend: 'Ext.grid.Panel',
	alias: ['widget.pmh-simple-grid'],

	requires: [
		'Ext.data.Store',
		'PmhTech.plugin.grid.Extra'
	],
	storeProps: {
		url: null,
		fields: [],
		rootProperty: null
	},
	frame: true,
	emptyText: 'No data to display',
	plugins: [],
	rowNumberer : 40,
	initComponent: function () {
		var me = this;

		var columns = me.columns;
		me._columns=Ext.clone(columns);
		me.plugins.push({ptype: 'pmh-grid-extra',rowNumberer:me.rowNumberer});
//		me.plugins.push({ptype: 'bufferedrenderer'});


		Ext.apply(me, {
			columns: columns,
			store: me.configStore(),
			listeners: {
				storeLoad: Ext.emptyFn,
				storeAdd: Ext.emptyFn,
				storeRemove: Ext.emptyFn,
				storeUpdate: Ext.emptyFn,
				afterrender: Ext.emptyFn
			}
		});

		me.callParent(arguments);
		var store = me.getStore();
		store.addListener('load',function(){

			me.show();
			me.fireEventArgs('storeLoad', arguments);

		},me);

		store.addListener('add',function(){

			me.show();
			me.fireEventArgs('storeAdd', arguments);

		},me);
		store.addListener('remove',function(){

			me.show();
			me.fireEventArgs('storeRemove', arguments);

		},me);
		store.addListener('update',function(){
			me.fireEventArgs('storeUpdate', arguments);

		},me);
	},
	configStore: function () {

		var me = this;
		if (me.store) {
			return me.store;
		}

		return Ext.create('Ext.data.Store', {
			fields: Ext.isArray(me.storeProps.fields) ? Ext.clone(me.storeProps.fields) : [],
			autoLoad: me.storeProps.autoLoad,
			proxy: {
				type: Ext.isEmpty(me.storeProps.url) ? 'memory' : 'ajax',
				url: me.storeProps.url,
				reader: {
					type: 'json',
					rootProperty: me.storeProps.rootProperty
				}
			}
		});


	}, configDockedItems: function () {
		var me = this;
		if (!me.dockedItems) {
			me.dockedItems = [];
		}
		var dockedItems = Ext.isArray(me.dockedItems) ? Ext.clone(me.dockedItems) : [];
		return dockedItems;

	}
});
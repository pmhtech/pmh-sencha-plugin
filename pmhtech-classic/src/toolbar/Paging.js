/**
 *
 *
 *
 *
 *
 */
Ext.define('PmhTech.toolbar.Paging', {
    extend: 'Ext.toolbar.Paging',
    alias: 'widget.pmh-pagingtoolbar',

    requires: [
        'Ext.data.Store',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    displayInfo: true,

   /* getPagingItems: function () {
        var me = this,
            inputListeners = {
                scope: me,
                blur: me.onPagingBlur
            };

        inputListeners[Ext.supports.SpecialKeyDownRepeat ? 'keydown' : 'keypress'] = me.onPagingKeyDown;

        return [
            {
                itemId: 'refresh',
                tooltip: me.refreshText,
                overflowText: me.refreshText,
                iconCls: Ext.baseCSSPrefix + 'tbar-loading',
                disabled: me.store.isLoading(),
                handler: me.doRefresh,
                scope: me
            }];
    },*/
    initComponent: function () {
        var me = this;

        var store = Ext.create('Ext.data.Store',{
            pageSize : me.pageSize,
            proxy: {
                type: 'ajax',
                pageParam : 'page',
                startParam : null,
                params : {
                    test : 'test'
                },
                limitParam  : 'size',
                reader: {
                    type: 'json',
                    rootProperty: 'data.content',
                    totalProperty: 'data.totalElements'
                }
            }
        });

        var grid = me.up('grid');

        grid.setStore(store);


        Ext.apply(me,{
            store : store
        });

        me.callParent(arguments);
        store.on('beforeload',function(store,operation){
            operation._page=operation._page-1;
            return true;
        });

    }
});
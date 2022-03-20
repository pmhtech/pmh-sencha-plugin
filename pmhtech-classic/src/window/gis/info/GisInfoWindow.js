/**
 *
 */
Ext.define('PmhTech.window.gis.info.GisInfoWindow', {
    extend: 'Ext.panel.Panel',
    alias: ['widget.pmh-gis-info-popup','widget.gis-info-popup'],

    requires: [
        'Ext.button.Button',
        'Ext.layout.container.VBox',
        'PmhTech.utils.Window',
        'PmhTech.window.gis.info.GisInfoWindowController'
    ],
    controller : 'pmh-gis-info-popup',
    collapsible : true,
    header : {
        height : 30
    },

    initComponent : function(){
        var me = this;
        Ext.apply(me,{

            layout : {
                type : 'vbox',
                align : 'stretch'
            },listeners : {
                add : me.onAddItem,
                scope : me
            },
            bbar : [{
                xtype : 'button',
                clickEvent : 'mouseup',
                text :'지형편집',
                handler : me.onBtnModifyGeometry,
                scope : me
            },{
                xtype : 'button',
                clickEvent : 'mouseup',
                text : '적용',
                //handler : 'onBtnModify'
            }]
        });

        me.callParent(arguments);
    },
    afterRender : function(){
        var me = this;
        var tools = me.query('tool');
        tools.forEach(function (tool) {
            tool.getEl().on('mouseup', function () {
                Ext.callback(this.handler, me)
            }, tool);
        });

    },

    /**
     *
     * @param {Ext.button.Button} button
     */
    onBtnModifyGeometry: function (button) {
        var thisView = this;
        thisView.hide();
        thisView.gisContainer.startModify();

        PmhTech.utils.Window.showPopup('gis-edit-popup', {
            params : {
                gisContainer : thisView.gisContainer
            },
            callbackFunc: function () {
                thisView.gisContainer.fireEvent('drawend');
            },
            callbackScope: this
        });

    },

    /**
     * @param {Ext.container.Container} comp
     * @param {Ext.Component} newComp
     * @param {Number} index
     */
    onAddItem: function (comp, newComp, index) {

        var buttons = comp.query('button');

        buttons.forEach(function (button) {
            button.clickEvent = 'mouseup';
        });

        newComp.setTitle(null);


    }

});
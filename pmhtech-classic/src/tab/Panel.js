/**
 *
 */
Ext.define('PmhTech.tab.Panel', {
    extend: 'Ext.tab.Panel',
    alias: ['widget.pmh-contents-tabpanel', 'widget.contents-tabpanel'],

    requires: [
        'Ext.layout.container.Column'
    ],

    cls: 'pmh-tabpanel',
    padding: '30 0 0 0 ',
    tabBar: {
        layout: {
            type: 'column'
        },
        listeners: {
            resize: function (comp) {
                comp.setHeight(comp.body.getHeight())
            }
        }
    },
    defaultsCfg: {
        height: 30,
        margin: '10 0 0 0',
        tabConfig: {
            minWidth: 80,
        }
    },
    defaults: {},


    deferredRender: false,
    initComponent: function () {
        var me = this;

        Ext.apply(me.defaults, Ext.clone(me.defaultsCfg));

        me.callParent(arguments);

        me.addListener('insertmode', me.onInsertMode, me);
        me.addListener('updatemode', me.onUpdateMode, me);
        me.addListener('tabchange', me.onTabChange, me);
    },

    onInsertMode: function () {

        var tabPanel = this;
        tabPanel.paramArgs = [];
        var tabs = tabPanel.items.items;
        Ext.suspendLayouts()

        for (var i = 0; i < tabs.length; i++) {
            var tab = tabs[i];
            tab.requireReset = true;
            tab.fireEventArgs('insertmode', arguments);
        }
        Ext.resumeLayouts(true);
    },
    onUpdateMode: function () {
        var tabPanel = this;
        var activeTab = tabPanel.getActiveTab();
        this.onInsertMode();
        activeTab.requireReset = false;
        this.paramArgs = arguments;

        activeTab.fireEventArgs('updatemode', tabPanel.paramArgs);

    },
    onTabChange: function (tabpanel, newCard, oldCard) {

        if (newCard.requireReset !== false) {
            newCard.requireReset = false;
            newCard.fireEventArgs('updatemode', tabpanel.paramArgs);
        }
    }
})
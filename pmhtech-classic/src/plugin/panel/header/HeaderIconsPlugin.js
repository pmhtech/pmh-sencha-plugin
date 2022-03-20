/**
 *
 */
Ext.define('PmhTech.plugin.panel.header.HeaderIconsPlugin', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.headericons',
    iconCls: '',
    style : {},
    headerButtons: [],
    init: function(panel) {

        this.panel = panel;
        this.callParent(arguments);

        panel.on('render', this.onAddIcons, this);
    },
    onAddIcons :function () {

        this.header = this.panel.getHeader();
        this.header.addCls('panel-header-icons');
        var titlebar =this.header.down('title');
        if(titlebar){
            titlebar.setFlex(null);
        }

        for(var key in this.style){
            this.header.setStyle(key,this.style[key]);
        }


        this.header.insert(1,this.headerButtons);


    }
});
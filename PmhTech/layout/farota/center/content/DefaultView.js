Ext.define('PmhTech.view.global.content.GlobalContent', {
	extend: 'Ext.panel.Panel',
	alternateClassName: ['PmhTech.view.content.DefaultView','PmhTech.view.content.GlobalContent'],
	alias: 'widget.global-content',
	layout : 'fit',
	border : false,
	scrollable : true,
	itemId : 'global-content',
	style : 'border-width : 0px 0px 0px 0px;background-color=red',
	plugins : [{
		ptype : 'pmh-event-wire-manager'
	}]
});
Ext.define('PmhTech.view.global.north.GlobalNorthButton', {
	extend: 'Ext.button.Button',
	alias: 'widget.global-north-button',
	requires: [
		'Ext.button.Button',
		'Ext.container.Container',
		'Ext.form.field.Display',
		'Ext.layout.container.HBox',
		'PmhTech.utils.Jwt'
	],
	width: 90,
	height : 40
});
Ext.define('PmhTech.container.table.TableContainer', {
    alias: ['widget.pmh-table-container', 'widget.table-container'],
    extend: 'Ext.container.Container',
    requires: [
        'Ext.layout.container.Column'
    ],
    width : '100%',
    padding : 2,
    layout : 'column',
})
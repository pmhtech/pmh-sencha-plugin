Ext.define('PmhTech.form.Panel', {
    extend: 'Ext.form.Panel',
    alias : ['widget.pmhtech-form','widget.pmh-formpanel'],
    bodyPadding: 10,
    bodyStyle : 'borderWidth: 0px !important;',
    layout: 'column',
    autoScroll: true,
    defaults: {
        columnWidth: 1,
        margin: '0 5 5 5'
    }
});
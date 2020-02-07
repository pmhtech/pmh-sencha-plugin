/**
 *
 */
Ext.define('PmhTech.override.form.field.ComboBox', {
    override: 'Ext.form.field.ComboBox',
    queryMode : 'local',
    displayField : 'codeName',
    valueField : 'code'
});

/**
 *
 */
Ext.define('PmhTech.grid.column.CheckColumn', {
    extend: 'Ext.grid.column.CheckColumn',
    alias: 'widget.pmh-checkcolumn',

    text: '&#160;',
    sortable: false,
    draggable: false,
    tdCls: 'no-dirty',
    width: 30,
    height : 35,
    align : 'center',
    margin : '-23 0 0 0 ',
    dataIndex : 'isChecked',
    resizable: false,
    hideable: false,
    menuDisabled: true,
    cls: Ext.baseCSSPrefix + 'column-header-checkbox',
    startRowIndex : 0,
    setRecordCheck: function(record, recordIndex, checked, cell) {
        var me = this,
            prop = me.property;

        // Only proceed if we NEED to change
        // eslint-disable-next-line eqeqeq
        if ((prop ? record[prop] : record.get(me.dataIndex)) != checked && record.get('disabled')!==true) {
            if (prop) {
                record[prop] = checked;
                me.updater(cell, checked);
            }
            else {
                record.set(me.dataIndex, checked);
            }
        }
    },
    initComponent: function () {
        var me = this;
        me.callParent(arguments);

        me.addListener('checkchange', function (checkcolumn, rowIndex, checked, record, e, eOpts) {

            var isTrue = checkcolumn.up('grid').getStore().find(checkcolumn.dataIndex, false) == -1;
            var isFalse = checkcolumn.up('grid').getStore().find(checkcolumn.dataIndex, true) == -1;
            var headcheck = false;



            if (isTrue == true && isFalse == false) {
                headcheck = true;
            }

            checkcolumn.fireEvent('headercheckchange', checkcolumn, headcheck);

        });
        me.addListener('headercheckchange',function (checkcolumn, checked) {

            if (checked) {
                checkcolumn.getEl().addCls('x-grid-hd-checker-on');
            } else {
                checkcolumn.getEl().removeCls('x-grid-hd-checker-on');
            }
        });
    }
});

Ext.define('PmhTech.overrides.ux.TreePicker', {
    override : 'Ext.ux.TreePicker',

    requires: [
        'Ext.tree.Panel'
    ],

    forceSelection : true,


    /**
     * Changes the selection to a given record and closes the picker
     * @private
     * @param {Ext.data.Model} record
     */
    selectItem: function(record) {
        var me = this;

        me.setValue(record.get(me.valueField));
        me.fireEvent('select', me, record);
        me.collapse();
    },

    /**
     * Runs when the picker is expanded.  Selects the appropriate tree node based on the value of the input element,
     * and focuses the picker so that keyboard navigation will work.
     * @private
     */
    onExpand: function() {
        var picker = this.picker,
            store = picker.store,
            value = this.value,
            node;

        if (value) {
            //node = store.getNodeById(value);

            node = store.findNode(this.valueField,value);
        }




        if (!node) {
            node = store.getRoot();
        }

        var parentNode= node.parentNode;
        if(parentNode!=null){
            parentNode.expand();
        }

        picker.ensureVisible(node, {
            select: true,
            focus: true
        });
    },

    /**
     * Sets the specified value into the field
     * @param {Mixed} value
     * @return {Ext.ux.TreePicker} this
     */
    setValue: function(value) {
        var me = this,
            record;





        me.value = value;

        if (me.store.loading) {
            // Called while the Store is loading. Ensure it is processed by the onLoad method.
            return me;
        }

        // try to find a record in the store that matches the value
        //record = value ? me.store.getNodeById(value) : me.store.getRoot();
        record = value ? me.store.findNode(me.valueField,value) : me.store.getRoot();



        if (value === undefined) {
            record = me.store.getRoot();
            me.value = record.get(me.valueField);
        } else {
            //record = me.store.getNodeById(value);
            record = me.store.findNode(me.valueField,value);
        }

        // set the raw value to the record's display field if a record was found
        me.setRawValue(record ? record.get(me.displayField) : '');

        return me;
    },
    onUpdate: function(store, rec, type, modifiedFieldNames){
        var display = this.displayField;

        if (type === 'edit' && modifiedFieldNames && Ext.Array.contains(modifiedFieldNames, display) && this.value === rec.get(this.valueField)) {
            this.setRawValue(rec.get(display));
        }
    },





    /**
     * Creates and returns the tree panel to be used as this field's picker.
     */
    createPicker: function() {
        var me = this,
            picker = Ext.create('Ext.tree.Panel',{
                baseCls: Ext.baseCSSPrefix + 'boundlist',
                shrinkWrapDock: 2,
                store: me.store,
                floating: true,
                rootVisible : me.rootVisible,
                displayField: me.displayField,
                columns: me.columns,
                minHeight: me.minPickerHeight,
                maxHeight: me.maxPickerHeight,
                manageHeight: false,
                shadow: false,
                listeners: {
                    scope: me,
                    itemclick: me.onItemClick,
                    itemkeydown: me.onPickerKeyDown
                }
            }),
            view = picker.getView();

        if (Ext.isIE9 && Ext.isStrict) {
            // In IE9 strict mode, the tree view grows by the height of the horizontal scroll bar
            // when the items are highlighted or unhighlighted.
            // Also when items are collapsed or expanded the height of the view is off.
            // Forcing a repaint fixes the problem.
            view.on({
                scope: me,
                highlightitem: me.repaintPickerView,
                unhighlightitem: me.repaintPickerView,
                afteritemexpand: me.repaintPickerView,
                afteritemcollapse: me.repaintPickerView
            });
        }
        return picker;
    }
});
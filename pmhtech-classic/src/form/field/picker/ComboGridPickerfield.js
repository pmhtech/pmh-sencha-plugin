Ext.define('PmhTech.form.field.picker.ComboGridPickerfield', {
    extend: 'Ext.form.field.ComboBox',
    alias: ['widget.gridcombo', 'widget.pmh-gridcombo'],

    requires: [
        'Ext.grid.Panel',
        'Ext.selection.RowModel',
        'Ext.util.Collection'
    ],

    emptyText: 'Select a value..',
    queryMode: 'remote',
    enableTrigger: true,
    displayField: 'name',
    pickerMinWidth :'100%',
    pickerMinHeight : 300,
    valueField: 'abbr',
    columns : false,

    createPicker: function () {
        var me = this,
            picker,
            pickerCfg = Ext.apply({
                xtype: 'gridpanel',
                hideHeaders: false,
                autoScroll: true,
                pickerField: me,
                viewConfig: {
                    selectionModel: me.pickerSelectionModel, // Must be into "viewConfig"

                    // Default NavigationModel is 'grid'
                    //navigationModel: 'grid', // Default value for Grid
                    //navigationModel: 'boundlist', // Use BoundList NavigationModel
                    //navigationModel: 'gridcombobox', // Implement custom NavigationModel for GridComboBox
                    pickerField: me, // Required by BoundList NavigationModel

                    preserveScrollOnRefresh: true // Must be into "viewConfig"
                },
                focusOnToFront: false, // Required by BoundList NavigationModel
                floating: true,
                hidden: true,
                store: me.getPickerStore(),
                displayField: me.displayField,
                pageSize: me.pageSize,
                tpl: me.tpl,
                columns: me.columns,
            }, me.listConfig, me.defaultListConfig);

        picker = me.picker = Ext.widget(pickerCfg);

        picker.setMinWidth(me.pickerMinWidth);
        picker.setMinHeight(me.pickerMinHeight);

        if (me.pageSize) {
            picker.pagingToolbar.on('beforechange', me.onPageChange, me);
        }

        picker.getNode = function () {
            picker.getView().getNode(arguments);
        };

        picker.refresh = function () {
            picker.getView().refresh(arguments);
        };

        picker.highlightItem = function () {
            picker.getView().highlightItem(arguments);
        };

        // We limit the height of the picker to fit in the space above
        // or below this field unless the picker has its own ideas about that.
        if (!picker.initialConfig.maxHeight) {
            picker.on({
                beforeshow: me.onBeforePickerShow,
                scope: me
            });
        }
        picker.getSelectionModel().on({
            beforeselect: me.onBeforeSelect,
            beforedeselect: me.onBeforeDeselect,
            scope: me
        });

        picker.getNavigationModel().navigateOnSpace = false;

        return picker;
    },

    // Method overridden just to replace "Ext.selection.DataViewModel" with "Ext.selection.RowModel"
    onBindStore: function (store, initial) {
        var me = this,
            picker = me.picker,
            extraKeySpec,
            valueCollectionConfig;

        // We're being bound, not unbound...
        if (store) {
            // If store was created from a 2 dimensional array with generated field names 'field1' and 'field2'
            if (store.autoCreated) {
                me.queryMode = 'local';
                me.valueField = me.displayField = 'field1';
                if (!store.expanded) {
                    me.displayField = 'field2';
                }

                // displayTpl config will need regenerating with the autogenerated displayField name 'field1'
                if (me.getDisplayTpl().auto) {
                    me.setDisplayTpl(null);
                }
            }
            if (!Ext.isDefined(me.valueField)) {
                me.valueField = me.displayField;
            }

            // Add a byValue index to the store so that we can efficiently look up records by the value field
            // when setValue passes string value(s).
            // The two indices (Ext.util.CollectionKeys) are configured unique: false, so that if duplicate keys
            // are found, they are all returned by the get call.
            // This is so that findByText and findByValue are able to return the *FIRST* matching value. By default,
            // if unique is true, CollectionKey keeps the *last* matching value.
            extraKeySpec = {
                byValue: {
                    rootProperty: 'data',
                    unique: false
                }
            };
            extraKeySpec.byValue.property = me.valueField;
            store.setExtraKeys(extraKeySpec);

            if (me.displayField === me.valueField) {
                store.byText = store.byValue;
            } else {
                extraKeySpec.byText = {
                    rootProperty: 'data',
                    unique: false
                };
                extraKeySpec.byText.property = me.displayField;
                store.setExtraKeys(extraKeySpec);
            }

            // We hold a collection of the values which have been selected, keyed by this field's valueField.
            // This collection also functions as the selected items collection for the BoundList's selection model
            valueCollectionConfig = {
                rootProperty: 'data',
                extraKeys: {
                    byInternalId: {
                        property: 'internalId'
                    },
                    byValue: {
                        property: me.valueField,
                        rootProperty: 'data'
                    }
                },
                // Whenever this collection is changed by anyone, whether by this field adding to it,
                // or the BoundList operating, we must refresh our value.
                listeners: {
                    beginupdate: me.onValueCollectionBeginUpdate,
                    endupdate: me.onValueCollectionEndUpdate,
                    scope: me
                }
            };

            // This becomes our collection of selected records for the Field.
            me.valueCollection = new Ext.util.Collection(valueCollectionConfig);

            // This is the selection model we configure into the dropdown BoundList.
            // We use the selected Collection as our value collection and the basis
            // for rendering the tag list.
            me.pickerSelectionModel = new Ext.selection.RowModel({ // Only row changed (it was "Ext.selection.DataViewModel")
                mode: me.multiSelect ? 'SIMPLE' : 'SINGLE',
                // There are situations when a row is selected on mousedown but then the mouse is dragged to another row
                // and released.  In these situations, the event target for the click event won't be the row where the mouse
                // was released but the boundview.  The view will then determine that it should fire a container click, and
                // the DataViewModel will then deselect all prior selections. Setting `deselectOnContainerClick` here will
                // prevent the model from deselecting.
                deselectOnContainerClick: false,
                enableInitialSelection: false,
                pruneRemoved: false,
                selected: me.valueCollection,
                store: store,
                listeners: {
                    scope: me,
                    lastselectedchanged: me.updateBindSelection
                }
            });

            if (!initial) {
                me.resetToDefault();
            }

            if (picker) {
                picker.setSelectionModel(me.pickerSelectionModel);
                if (picker.getStore() !== store) {
                    picker.bindStore(store);
                }
            }
        }
    },
});
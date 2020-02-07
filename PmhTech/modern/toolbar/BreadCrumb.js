Ext.define('PmhTech.toolbar.BreadCrumb',{
    extend : 'Ext.Toolbar',
    alias : 'widget.pmh-breadcrumb',
    defaultFocus: ':focusable:last',
    buttonUi  : '',

    updateBreadcrumb: function(node) {


        var breadcrumb = this;

        var me = this,
            path = [],
            toAdd = [],
            items = breadcrumb.getItems().items,
            sepCfg = {
                xtype: 'component',
                cls: 'x-tool',
                _bcSeparator: true,
                html: '<div class="' + Ext.baseCSSPrefix + 'icon-el ' + Ext.baseCSSPrefix + 'font-icon ' + Ext.baseCSSPrefix + 'tool-type-right' + '"></div>'
            },
            btnCfg, existing, len, i, j, focusEl;

        // Build the button path

        for (; node; node = node.parentNode) {
            if(!node.isRoot() ){
                path.unshift(node);
            }
        }



        path = path.slice(1);

        // Update the buttons as non-destructively as possible to preserve focus if possible.
        for (i = 0, j = 0, len = path.length; i < len; i++, j+=2) {
            node = path[i];
            
            btnCfg = {
                _bcButton: true,
                ui : me.buttonUi,
                text: node.get('MENU_NM'),
                value: node.get('MENU_URI'),
                action: 'breadcrumb'
            };
            existing = items[j];

            if (existing && existing._bcButton) {
                // Because we have non-configs in this object, we need to set strict:false
                // to silence the warnings we would otherwise get.
                existing.setConfig(btnCfg, {
                    strict: false
                });

                if (i < len - 1) {
                    existing = items[j + 1];
                    if (!existing || !existing._bcSeparator) {
                        toAdd.push(sepCfg);
                    }
                }
            } else {
                toAdd.push(btnCfg);
                if (i < len - 1) {
                    toAdd.push(sepCfg);
                }
            }
        }

        // We need to remove everything after the end of the buttons
        breadcrumb.remove(Ext.Array.slice(items, j - 1, 100), true);

        // Append the afterItems to what we need to add.
        if (breadcrumb.afterItems) {
            Ext.Array.push(toAdd, breadcrumb.afterItems);
        }
        if (toAdd.length) {
            breadcrumb.add(toAdd);
        }

        // If we have buttons, then focus the last one.
        if (j) {
            focusEl = breadcrumb.items.items[j - 2].getFocusEl();
            if (focusEl) {
                focusEl.focus();
            }
        }

        return me;
    }
});
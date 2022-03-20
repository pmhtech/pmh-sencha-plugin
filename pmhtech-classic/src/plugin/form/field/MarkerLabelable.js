/**
 *
 * trackResetOnLoad 를 활성화시켜 loadData 또는 setValues할때 Original값을 유지시키도록 하는 함수
 * 최초 렌더링되었을때 값을 돌려주는 함수가 없으므로 forceReset을 구현하였습니다.
 *
 *
 */
Ext.define('PmhTech.plugin.form.field.MarkerLabelable', {
    extend: 'Ext.AbstractPlugin',
    alias: 'plugin.pmh-marker-labelable',
    init: function (comp) {
        var me = this;
        me.comp = comp;

        comp.afterLabelTextTpl = '<span class="pmh-field-required">*</span>';
        comp.beforeLabelTextTpl = '<span class="pmh-field-prefix">·</span>';
        if(comp.hideLabelTextTpl===true){
            comp.afterLabelTextTpl = '';
            comp.beforeLabelTextTpl = '';
        }
        comp.setAllowBlank = Ext.Function.bind(me.setAllowBlank, comp);
        comp.setMarkFieldLabel = Ext.Function.bind(me.setMarkFieldLabel, comp);
        comp.setFieldLabel = Ext.Function.bind(me.setFieldLabel, comp);
        comp.addListener('afterrender', me.onAddAfterRender, comp);

    },
    setFieldLabel: function (label) {

        var me = this;
        me.setMarkFieldLabel(label);
        Ext.callback(me.mixins.labelable.setFieldLabel,me,[label]);

    },


    onAddAfterRender: function (comp) {
        var me = this;
        if (comp.fieldLabel) {
            me.setMarkFieldLabel(comp.fieldLabel);
            comp.setAllowBlank(comp.allowBlank);
        }

    },

    setMarkFieldLabel: function (label) {
        var me = this;
        if (Ext.isString(label)) {
            if (label.indexOf('br>') != -1) {
                me.labelEl.addCls('pmh-field-br-tag');
            } else {
                me.labelEl.removeCls('pmh-field-br-tag');
            }
        }
    },
    setAllowBlank: function (allowBlank) {
        var me = this;
        me.allowBlank = allowBlank;

        if(me.allowBlank===true){
            me.forceSelection=false;
        }



        if (me.rendered) {

            if (!me.labelEl) {
                return;
            }

            var labelEl = me.labelEl.down('.pmh-field-required');

            if (labelEl) {
                var fieldLabel = me.fieldLabel || '';
                if (fieldLabel.trim().length > 0 && me.requireFlag === true && allowBlank === false) {
                    labelEl.dom.textContent= ' *';
                } else {
                    labelEl.dom.textContent= ' ';
                }
            }
        }

        var fieldcontainer = me.up('fieldcontainer');

        if(fieldcontainer){
            fieldcontainer.setAllowBlank(allowBlank);
        }
    }

});
/**
 *
 */
Ext.define('PmhTech.overrides.form.field.Base', {
    override: 'Ext.form.field.Base',

    requires: [
        'PmhTech.plugin.form.field.MarkerLabelable'
    ],

    statics: {
        minWidth: 220
    },
    labelSeparator: '',
    requireFlag: true,
    plugins: [{
        ptype: 'pmh-marker-labelable'
    }],
    blankText: '필수 입력항목입니다.',
    initComponent: function () {
        var me = this;

        if (me.labelAlign === 'right') {


            me.labelableRenderTpl = [
                '<div id="{id}-bodyEl" data-ref="bodyEl" role="presentation"',
                ' class="{baseBodyCls} {baseBodyCls}-{ui}<tpl if="fieldBodyCls">',
                ' {fieldBodyCls} {fieldBodyCls}-{ui}</tpl> {growCls} {extraFieldBodyCls}"',
                '<tpl if="bodyStyle"> style="{bodyStyle}"</tpl>>',
                '{beforeBodyEl}',
                '{beforeSubTpl}',
                '{[values.$comp.getSubTplMarkup(values)]}',
                '{afterSubTpl}',
                '{afterBodyEl}',
                // ARIA elements serve different purposes:
                // - ariaHelpEl may contain optional hints about the field, such as
                //   expected format. This text is static and usually does not change
                //   once rendered. It is also optional.
                // - ariaStatusEl is used to convey status of the field. Validation errors
                //   are rendered here, as well as other information that might be helpful
                //   to Assistive Technology users exploring the app in browse mode.
                // - ariaErrorEl is used for announcing dynamic changes in the field state,
                //   so that AT users receive updates while in forms mode.
                //
                // Both ariaHelpEl and ariaStatusEl are referenced by the field's input element
                // via aria-describedby.
                '<tpl if="renderAriaElements">',
                '<tpl if="ariaHelp">',
                '<span id="{id}-ariaHelpEl" data-ref="ariaHelpEl"',
                ' class="' + Ext.baseCSSPrefix + 'hidden-offsets">',
                '{ariaHelp}',
                '</span>',
                '</tpl>',
                '<span id="{id}-ariaStatusEl" data-ref="ariaStatusEl" aria-hidden="true"',
                ' class="' + Ext.baseCSSPrefix + 'hidden-offsets">',
                '{ariaStatus}',
                '</span>',
                '<span id="{id}-ariaErrorEl" data-ref="ariaErrorEl" aria-hidden="true" aria-live="assertive"',
                ' class="' + Ext.baseCSSPrefix + 'hidden-clip">',
                '</span>',
                '</tpl>',
                '</div>',
                '{beforeLabelTpl}',
                '<label id="{id}-labelEl" data-ref="labelEl" class="{labelCls} {labelCls}-{ui} {labelClsExtra} ',
                '{childElCls} {unselectableCls}" style="{labelStyle}"',
                '<tpl if="inputId && !skipLabelForAttribute"> for="{inputId}"</tpl>',
                ' {labelAttrTpl}>',
                '<span class="{labelInnerCls} {labelInnerCls}-{ui}" style="{labelInnerStyle}">',
                '{beforeLabelTextTpl}',
                '<span id="{id}-labelTextEl" data-ref="labelTextEl" class="{labelTextCls}">',
                '<tpl if="fieldLabel">{fieldLabel}',
                '<tpl if="labelSeparator">{labelSeparator}</tpl>',
                '</tpl>',
                '</span>',
                '{afterLabelTextTpl}',
                '</span>',
                '</label>',
                '{afterLabelTpl}',
                '<tpl if="renderError">',
                '<div id="{id}-errorWrapEl" data-ref="errorWrapEl" class="{errorWrapCls} {errorWrapCls}-{ui}',
                ' {errorWrapExtraCls}" style="{errorWrapStyle}">',
                '<div role="presentation" id="{id}-errorEl" data-ref="errorEl" ',
                'class="{errorMsgCls} {invalidMsgCls} {invalidMsgCls}-{ui}" ',
                'data-anchorTarget="{tipAnchorTarget}">',
                '</div>',
                '</div>',
                '</tpl>',
                {
                    disableFormats: true
                }
            ];
        }

        me.oriColumnWidth = me.columnWidth;
        me.callParent(arguments);


    },
    afterRender: function () {
        var me = this;
        me.callParent(arguments);
        me.initBlank = me.allowBlank;
        if (me.labelAlign === 'right') {
            me.labelEl.setStyle('padding-right', '0px');
        }

        if (me.vtype) {
            me.addListener('focus', function (field) {
                field.validate();
            });
        }

        if (me.readOnly === true) {
            me.setReadOnly(me.readOnly);
        }

    },
    setReadOnly: function (readOnly) {
        var me = this;
        me.callParent(arguments);
        if (Ext.isFunction(me.setAllowBlank)) {


            if(readOnly== false){
                me.setAllowBlank(me.initBlank);
            }else{
                me.setAllowBlank(true);
            }
        }

        if(me.rendered){
            me.fireEvent('readonly', me, readOnly);
        }




    }
});
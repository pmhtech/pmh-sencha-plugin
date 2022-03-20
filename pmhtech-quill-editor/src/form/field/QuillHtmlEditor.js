/**
 *
 */
Ext.define('PmhTech.form.field.QuillHtmlEditor', {
    extend: 'Ext.form.field.Base',
    alias: ['widget.quill-editor', 'widget.pmh-quill-editor'],

    requires: [
        'Ext.form.field.VTypes'
    ],

    /**
     *
     */
    ariaRole: 'textbox',
    textCursor : -1,
    /**
     *
     */
    listeners : {
        resize : function(comp){
            comp.bodyEl.setHeight(comp.getHeight())
        },
    },

    constructor : function(config){
        var me = this;

        config.fieldSubTpl= [
            '<div id="{cmpId}-editor-wrap" class="quill-editor-wrap" >',
                '<div id="{cmpId}-editorEl" ></div>',
            '</div>',
        ]
        me.callParent([config]);

    },


    bodyStyle : 'style:display:flex',
    checkChangeEvents: Ext.isIE && (!document.documentMode || document.documentMode <= 9)
        ? ['change', 'propertychange', 'keyup','DOMSubtreeModified']
        : ['change', 'input', 'textInput', 'keyup', 'dragdrop','DOMSubtreeModified'],
    focusable: true,
    validateOnChange : true,
    submitValue : true,
    afterRender : function(){
        var me = this;
        me.callParent(arguments);
        me.bodyEl.setStyle('display','flex')
        me.createEditor();
        me.setReadOnly(me.readOnly);
    },
    createEditor : function(){

        var me =this;

        var editorElId = me.id+'-editorEl';

        me.quill = new Quill('#'+editorElId, {
            readOnly : true,
            modules: {
                toolbar: [
                    [{ header: [false,1, 2, 3, 4, 5, 6] }],
                    ['bold', 'italic', 'underline','strike'],

                    [{ 'align': ''},{ 'align':'center'},{ 'align':'right'},{ 'align':'justify'}],
                    ['blockquote', 'code-block'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' },{ 'list': 'check' }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                    ['link','image','video'],
                    ['clean']
                ]
            },
            theme: 'snow'
        });

        me.editorEl = Ext.get(editorElId);
        me.qlEditor = me.editorEl.down('.ql-editor');
    },
    setReadOnly : function(readOnly){
        var me = this;




        if(me.rendered){
            var toolbar = me.bodyEl.down('.ql-toolbar');
            if(readOnly){
                me.quill.disable();
                toolbar.addCls('ql-disabled');
            }else{
                me.quill.enable()
                toolbar.removeCls('ql-disabled');

            }
        }
        me.callParent(arguments);
    },
    getValue: function() {


        var me = this;
        if(me.editorEl){
            var qlEditor = me.qlEditor;
            this.value = qlEditor.dom.getInnerHTML();
            this.rawValue = qlEditor.dom.getInnerHTML();
        }
        return this.value;
    },

    getErrors: function(value) {
        value = arguments.length
            ? (value == null ? '' : value)
            : this.processRawValue(this.getRawValue());

        // eslint-disable-next-line vars-on-top
        var me = this,
            errors = me.callParent([value]),
            validator = me.validator,
            vtype = me.vtype,
            vtypes = Ext.form.field.VTypes,
            regex = me.regex,
            format = Ext.String.format,
            msg, trimmed, isBlank;

        if (Ext.isFunction(validator)) {
            msg = validator.call(me, value);

            if (msg !== true) {
                errors.push(msg);
            }
        }

        trimmed = me.allowOnlyWhitespace ? value : Ext.String.trim(value);

        if (trimmed.length < 1) {
            if (!me.allowBlank) {
                errors.push(me.blankText);
            }

            // If we are not configured to validate blank values,
            // there cannot be any additional errors
            if (!me.validateBlank) {
                return errors;
            }

            isBlank = true;
        }

        // If a blank value has been allowed through, then exempt it from the minLength check.
        // It must be allowed to hit the vtype validation.
        if (!isBlank && value.length < me.minLength) {
            errors.push(format(me.minLengthText, me.minLength));
        }

        if (value.length > me.maxLength) {
            errors.push(format(me.maxLengthText, me.maxLength));
        }

        if (vtype) {
            if (!vtypes[vtype](value, me)) {
                errors.push(me.vtypeText || vtypes[vtype + 'Text']);
            }
        }

        if (regex && !regex.test(value)) {
            errors.push(me.regexText || me.invalidText);
        }

        return errors;
    },
    valueToRaw: function(value) {
        if (value || value === 0 || value === false) {
            return value;
        } else {
            return '';
        }
    },

    getCursorPosition: function(){

        this.textCursor=this.quill.getSelection().index;
        return this.quill.getSelection().index;
    },
    getImgFileId : function(){

        var me = this;
        var srcs = Ext.Array.pluck(this.inputEl.select('img').elements,'src');
        var result = [];

        var prefix = gwHost+'/files/v1/adm/';
        var suffix = '/download';

        for(var i=0;i<srcs.length;i++){
            var src = srcs[i];

            if(src.indexOf(prefix)!=-1 && src.indexOf(suffix)!=-1){
                result.push(src.replace(prefix,'').replace(suffix,''));
            }
        }
        return result;
    },
    setInnerText : function(text){
        this.qlEditor.dom.innerText=text;
    },
    getInnerText : function(){
        return this.qlEditor.dom.innerText;
    },


    getRawValue: function() {

        var me = this;
        if(me.editorEl){

            this.value = me.qlEditor.dom.getInnerHTML();
            this.rawValue = me.qlEditor.dom.getInnerHTML();
        }
        return this.value;
    },

    setRawValue: function(value) {
        var me = this,
            rawValue = me.rawValue;

        if (!me.transformRawValue.$nullFn) {
            value = me.transformRawValue(value);
        }

        value = Ext.valueFrom(value, '');

        if (rawValue === undefined || rawValue !== value) {
            me.rawValue = value;

            // Some Field subclasses may not render an inputEl
            if (me.editorEl) {
                me.bindChangeEvents(false);
                me.qlEditor.dom.innerHTML = value;
                me.qlEditor.dom.value = value;
                me.bindChangeEvents(true);
            }
        }

        if (me.rendered && me.reference) {
            me.publishState('rawValue', value);
        }

        return value;
    },
});

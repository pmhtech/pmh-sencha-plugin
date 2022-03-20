/**
 *
 */
Ext.define('PmhTech.form.field.SummerNoteHtmlEditor', {
    extend: 'Ext.form.field.Base',
    alias: ['widget.summernote-editor', 'widget.pmh-summernote-editor'],

    requires: [
        'Ext.form.field.VTypes',
        'PmhTech.utils.Msg'
    ],

    /**
     *
     */
    ariaRole: 'textbox',
    /**
     *
     */

    fieldSubTpl: [
        '<div id="{cmpId}-editor" style="width:100%;height:100%">',
            '<div id="{[this.getId(values)]}" style="height:100%"></div>',
        '</div>',
        {
            addSummernote : function(tempId,height){


                if(height==0){
                    height =300;
                }

                $('#' + tempId).summernote({
                    lang: 'ko-KR',
                    focus: true,
                    disableResizeEditor: true,
                    height: height,
                    toolbar: [
                        ['style', ['style']],
                        ['font', ['bold', 'italic', 'underline']],
                        ['superscript', ['superscript', 'subscript']],
                        ['fontname', ['fontname', 'fontsize']],
                        ['color', ['forecolor', 'backcolor']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['table', ['table']],
                        ['insert', ['link', 'picture', 'video']],
                        ['view', [/*'fullscreen',*/ 'codeview',/* 'help'*/]],
                    ],
                    popover: {
                        image: [
                            ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
                            ['float', ['floatLeft', 'floatRight', 'floatNone']],
                            ['remove', ['removeMedia']]
                        ],
                        link: [
                            ['link', ['linkDialogShow', 'unlink']]
                        ],
                        table: [
                            ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
                            ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
                        ],
                        air: [
                            ['color', ['color']],
                            ['font', ['bold', 'underline', 'clear']],
                            ['paragraph', ['ul', 'paragraph']],
                            ['table', ['table']],
                            ['insert', ['link', 'picture']]
                        ]
                    },
                    callbacks: {
                        onImageUpload: function(files) {

                            if(files.length>=2){
                                PmhTech.Msg.alert('확인','1개의 이미지파일만 업로드 가능합니다.')
                                return false;


                            }
                            var formData = new FormData();
                            var request= new XMLHttpRequest();

                            var file = files[0];

                            request.onreadystatechange  = function(){
                                if (request.readyState === XMLHttpRequest.DONE) {
                                    if (request.status === 200) {
                                        var resObj = Ext.decode(request.responseText);
                                        var data = resObj.data;


                                        var reader = new FileReader();

                                        reader.readAsDataURL(file);
                                        reader.onload = function (e) {

                                            var image = new Image();
                                            image.src = e.target.result;

                                            image.onload = function () {
                                              var imgNode = document.createElement('img');
                                                imgNode.src = gwHost+'/files/v1/adm/'+data.fileId+'/download';
                                                imgNode.style.width =this.width;


                                                $('#' + tempId).summernote('insertNode', imgNode);
                                            };
                                        };
                                    }
                                }
                            };
                            formData.append('file',file);
                            request.open('POST',gwHost+'/files/v1/adm');
                            request.send(formData);

                        }
                    }
                });


            },
            getId : function(values){

                var tempId = values.cmpId+'-editorEl';
                var me = this;

                Ext.defer(function(){

                    var cmp = Ext.getCmp(values.cmpId);
                    var height = cmp.getHeight();
                    this.me.addSummernote(this.tempId,height);

                    var editorDom = Ext.get(values.cmpId+'-editor');
                    var dom = editorDom.query('.note-editable')[0];

                    var clazz =  Ext.String.format('note-editable x-form-text-default {0} ',values.fieldCls);
                    dom.id=values.id;
                    var el = Ext.get(dom.id)


                    values.tabIdx = values.tabIdx || -1;
                    dom.setAttribute('data-ref','inputEl');
                    dom.setAttribute('tabindex',values.tabIdx);
                    dom.setAttribute('pointer-events','none;');
                    dom.setAttribute('aria-labelledby',values.cmpId+'-labelEl')
                    if(values.fieldStyle){
                        dom.setAttribute('style',values.fieldStyle);
                    }
                    dom.setAttribute('class',clazz);

                    var me = Ext.getCmp(values.cmpId);

                    me.inputEl = el;

                    me.setReadOnly(me.readOnly);

                    Ext.callback(me.initEvents,me);
                },50, {tempId : tempId,
                                        me : this})

                return tempId;
            },
            compiled: false,
            disableFormats: true
        }
    ],

    bodyStyle : 'style:display:flex',
    checkChangeEvents: Ext.isIE && (!document.documentMode || document.documentMode <= 9)
        ? ['change', 'propertychange', 'keyup','DOMSubtreeModified']
        : ['change', 'input', 'textInput', 'keyup', 'dragdrop','DOMSubtreeModified'],
    focusable: true,
    validateOnChange : true,
    submitValue : true,
    setReadOnly : function(readOnly){
        var me = this;


        if(me.inputEl){
            var codeview = me.el.query('.note-codable')[0];
            me.inputEl.dom.setAttribute('contenteditable',!readOnly);
            var toolbar = me.el.query('.note-toolbar')[0];
            var editorEl = $('#'+this.id+'-editorEl');
            if(readOnly){
                toolbar.style.height=0;
                toolbar.style.visibility='hidden';
                toolbar.style.padding='0px';
                codeview.readOnly="readOnly";


            }else{
                codeview.readOnly='';
                toolbar.style.padding='';
                toolbar.style.height='';
                toolbar.style.visibility='';
            }


        }
        me.callParent(arguments);
    },
    getValue: function() {

        var inputEl = this.inputEl;
        if(inputEl){
           this.value = inputEl.dom.innerHTML;
            this.rawValue = inputEl.dom.innerHTML;
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
    afterRender : function(){

        var tempId = '#'+this.id+'-editorEl';
        this.summerEditor = $(tempId);
        this.bodyEl.setStyle('display','flex')

    },

    getCaretPos: function(){

        var tempId = '#'+this.id+'-editorEl';
        return $(tempId).summernote('editor.getLastRange').eo;
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

    getRawValue: function() {



        var inputEl = this.inputEl;
        if(inputEl){
            this.value = inputEl.dom.innerHTML;
            this.rawValue = inputEl.dom.innerHTML;
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
            if (me.inputEl) {
                me.bindChangeEvents(false);
                me.inputEl.dom.innerHTML = value;
                me.inputEl.dom.value = value;
                me.bindChangeEvents(true);
            }
        }

        if (me.rendered && me.reference) {
            me.publishState('rawValue', value);
        }

        return value;
    },

    getSubTplData: function(fieldData) {
        var ret = this.callParent(arguments);

        ret.value = this.getValue();

        return ret;
    }

    /**
     * @cfg {String} inputType
     * @private
     */
    /**
     * @cfg {Boolean} disabled
     * @private
     */
    /**
     * @cfg {Number} checkChangeEvents
     * @private
     */
    /**
     * @cfg {Number} checkChangeBuffer
     * @private
     */

});

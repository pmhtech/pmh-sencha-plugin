/**
 *
 *
 *
 *
 *
 */
Ext.define('PmhTech.overrides.data.TreeStore', {
    override: 'Ext.data.TreeStore',
    loadDepth : 0,
    constructor: function(config){
        if(!Ext.isEmpty(this.autoLoad)){
            config.autoLoad =this.autoLoad;
        }
        this.callParent([config]);
    },
    setRoot : function(root) {
        var me = this;

        if(root && root.autoRoot!==true){

            function traverse(node,depth){

                node.children = node.children || [];
                node.expanded = false;
                node.leaf=true;
                node.expandable = false;
                node.depth=depth;
                if(depth==0 || node.children.length>0){
                    node.leaf=false;
                    node.expandable = true;
                    node.expanded = me.loadDepth>=depth;
                }


                for(var childNode of node.children){
                    traverse(childNode, depth+1);

                }
            }

            traverse(root,0);
        }
        me.callParent(arguments);
        me.fireEvent('load',me);
    }


});
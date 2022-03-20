/**
 *
 *
 *
 *
 *
 */
Ext.define('PmhTech.plugin.tree.TreeFilter', {
	extend: 'Ext.AbstractPlugin',
	alias: 'plugin.pmh-treefilter',

	requires: [
		'Ext.dom.Element'
	],

	/**
	 * @cfg {Boolean}
	 * The field inside the model that will be used as the node's text.
	 */
	collapseOnClear: true,


	/**
	 * @cfg {Boolean} [displayField=text]
	 * 필터를 시켰을때 상위 Node를 표시하는지 유무
	 */
	allowParentNode: false,

	init: function (tree) {
		var me = this;
		me.tree = tree;

		tree.filter = Ext.Function.bind(me.filter, me);
		tree.filterBy = Ext.Function.bind(me.filterBy, me);
		tree.clearFilter = Ext.Function.bind(me.clearFilter, me);
	}
	/**
	 * @cfg {Boolean} [displayField=text]
	 * 필터를 시켰을때 상위 Node를 표시하는지 유무
	 */
	, filterBy : function(filterFunc){
		var me = this
			, tree = me.tree
			, matches = []                                          // array of nodes matching the search criteria
			, root = tree.getRootNode()                                // root node of the tree
			, visibleNodes = []                                      // array of nodes matching the search criteria + each parent non-leaf  node up to root
			, viewNode;
                                           // expand all nodes for the the following iterative routines

		// iterate over all nodes in the tree in order to evalute them against the search criteria
		root.cascadeBy(function (node) {
			if(filterFunc(node)){
				matches.push(node)
			}
		});
        tree.expandAll();

        if (me.allowParentNode === false) {                         // if me.allowParentFolders is false (default) then remove any  non-leaf nodes from the regex match
			Ext.each(matches, function (match) {
				if (!match.isLeaf()) { Ext.Array.remove(matches, match); }
			});
		}

		Ext.each(matches, function (item, i, arr) {                 // loop through all matching leaf nodes
			root.cascadeBy(function (node) {                         // find each parent node containing the node from the matches array
				if (node.contains(item) == true) {

					if(!Ext.Array.contains(visibleNodes,node)){
						visibleNodes.push(node) ;                         // if it's an ancestor of the evaluated node add it to the visibleNodes  array
					}
				}
			});
			if (me.allowParentNode === true &&  !item.isLeaf()) {    // if me.allowParentFolders is true and the item is  a non-leaf item
				item.cascadeBy(function (node) {                    // iterate over its children and set them as visible
					if(!Ext.Array.contains(visibleNodes,node)) {
						visibleNodes.push(node)
					}
				});
			}
			if(!Ext.Array.contains(visibleNodes,item)) {
				visibleNodes.push(item);                                // also add the evaluated node itself to the visibleNodes array
			}
		});

        tree.getStore().filterBy(function(node){

        	if(Ext.Array.contains(visibleNodes, node)){
        		return true;
			}
        	 return false;
		});

		/*root.cascadeBy(function (node) {                            // finally loop to hide/show each node
			viewNode = Ext.fly(tree.getView().getNode(node));       // get the dom element assocaited with each node
			if (viewNode) {                                          // the first one is undefined ? escape it with a conditional
				viewNode.setVisibilityMode(Ext.Element.DISPLAY);     // set the visibility mode of the dom node to display (vs offsets)
				viewNode.setVisible(Ext.Array.contains(visibleNodes, node));
			}
			else{
				console.log(node);
			}
		});*/

	}, filter: function (property, value, re) {

		var me = this
			, tree = me.tree
			, matches = []                                          // array of nodes matching the search criteria
			, root = tree.getRootNode()                                // root node of the tree
			, property = property || 'text'                          // property is optional - will be set to the 'text' propert of the  treeStore record by default
			, re = re || new RegExp(value, "ig")                     // the regExp could be modified to allow for case-sensitive, starts  with, etc.
			, visibleNodes = []                                      // array of nodes matching the search criteria + each parent non-leaf  node up to root
			, viewNode;

        if (Ext.isEmpty(value)) {
            // if the search field is empty
			me.clearFilter();
			return;
		}
        tree.expandAll();


        // iterate over all nodes in the tree in order to evalute them against the search criteria
		root.cascadeBy(function (node) {
			if (node.get(property).match(re)) {                         // if the node matches the search criteria and is a leaf (could be  modified to searh non-leaf nodes)
				matches.push(node);                                   // add the node to the matches array
			}
		});

		if (me.allowParentNode === false) {                         // if me.allowParentFolders is false (default) then remove any  non-leaf nodes from the regex match
			Ext.each(matches, function (match) {
				if (!match.isLeaf()) { Ext.Array.remove(matches, match); }
			});
		}

		Ext.each(matches, function (item, i, arr) {                 // loop through all matching leaf nodes
			root.cascadeBy(function (node) {                         // find each parent node containing the node from the matches array
				if (node.contains(item) == true) {
					visibleNodes.push(node) ;                         // if it's an ancestor of the evaluated node add it to the visibleNodes  array
				}
			});
			if (me.allowParentNode === true &&  !item.isLeaf()) {    // if me.allowParentFolders is true and the item is  a non-leaf item
				item.cascadeBy(function (node) {                    // iterate over its children and set them as visible
					visibleNodes.push(node)
				});
			}
			visibleNodes.push(item);                                // also add the evaluated node itself to the visibleNodes array
		});

		root.cascadeBy(function (node) {                            // finally loop to hide/show each node
			viewNode = Ext.fly(tree.getView().getNode(node));       // get the dom element assocaited with each node
			if (viewNode) {                                          // the first one is undefined ? escape it with a conditional
				viewNode.setVisibilityMode(Ext.Element.DISPLAY);     // set the visibility mode of the dom node to display (vs offsets)
				viewNode.setVisible(Ext.Array.contains(visibleNodes, node));
			}
		});
	}

	, clearFilter: function () {
		var me = this
			, tree = this.tree
			, root = tree.getRootNode();

		tree.getStore().clearFilter();
	}
});
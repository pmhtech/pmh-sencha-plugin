Ext.define('PmhTech.overrides.data.proxy.Ajax', {
    override: 'Ext.data.proxy.Ajax',
    cors: true,
    useDefaultXhrHeader: false,
    disableCaching: false,
});

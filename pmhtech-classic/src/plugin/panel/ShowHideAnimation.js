/**
 *
 */
Ext.define('PmhTech.plugin.panel.ShowHideAnimation', {
    extend: 'Ext.plugin.Abstract',
    alias: 'plugin.showhideanimation',

    requires: [
        'Ext.fx.Animation',
        'Ext.fx.runner.CssTransition'
    ],
    init: function (cmp) {
        cmp._onShow = cmp.onShow;
        cmp.onShow = this.onShow;
        cmp._onHide = cmp.onHide;
        cmp.onHide = this.onHide;
        cmp.remove = this.remove;
    },
    /**
     * Animated remove of component. Uses the `removeAnimation` config to specify the animation to use.
     */
    remove: function () {
        var me = this;

        me.hideAnimation = me.removeAnimation || 'popOut';

        me.hide(null, function () {
            me.getRefOwner().remove(me, true);
        });
    },
   /* /**
     * Overrides the component `onShow` method to show the component with the configured
     * transition.
     * @param {Object/Boolean} animation The animation to use when showing the component. If not specified or
     * a boolean value of `true` is passed will use the configured `showAnimation` or default to the `pop` animation.
     * @param {Function} cb Callback function to be executed after the animation has completed.
     * @param {Object} scope Execution scope for the callback.
     * @override
     */
    onShow: function(animation, cb, scope) {
        var me = this;
        // console.log('onshow')
        if (animation === true || Ext.isEmpty(animation)) {
            animation = me.showAnimation || 'pop';
        } else if (animation === false) {
            return me._onShow.apply(me, arguments);
        }

        if (Ext.isString(animation)) {
            animation = {type: animation};
        }

        me.updateLayout({ isRoot: false });

        // Constraining/containing element may have changed size while this Component was hidden
        if (me.floating) {
            if (me.maximized) {
                me.fitContainer();
            }
            else if (me.constrain) {
                me.doConstrain();
            }
        }

        me.isAnimating = true;

        var anim = new Ext.fx.Animation(Ext.apply({
            element: me.el,
            onEnd: function () {
                me.isAnimating = false;
            }
        }, animation));

        Ext.Animator.run(anim);
    },
    /**
     * Overrides the component `onHide` method to hide the component with the configured
     * transition.
     * @param {Object/Boolean} animation The animation to use when hiding the component. If not specified or
     * a boolean value of `true` is passed will use the configured `hideAnimation` or default to the `popOut` animation.
     * @param {Function} cb Callback function to be executed after the animation has completed.
     * @param {Object} scope Execution scope for the callback.
     * @override
     */
    onHide: function(animation, cb, scope) {
        var me = this;

        if (animation === true || Ext.isEmpty(animation)) {
            animation = me.hideAnimation || 'popOut';
        } else if (animation === false) {
            return me._onHide.apply(me, arguments);
        }

        if (Ext.isString(animation)) {
            animation = {type: animation};
        }

        // Part of the Focusable mixin API.
        // If we have focus now, move focus back to whatever had it before.
        me.revertFocus();

        me.isAnimating = true;

        var anim = new Ext.fx.Animation(Ext.apply({
            element: me.el,
            onEnd: function () {
                me.el.hide();

                me.isAnimating = false;

                me.afterHide(cb, scope);
            }
        }, animation));

        Ext.Animator.run(anim);
    }
});
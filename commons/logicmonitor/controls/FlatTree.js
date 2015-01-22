define([
    'lodash',
    'core',
    'utils',
    'commons/logicmonitor/controls/templates',
    'lmmodelurls',
    'commons/logicmonitor/models/UserDataModel',
    'lmmsgbox',
    'commons/3rdparty/jquery-ui/draggable',
    'commons/3rdparty/jquery-ui/droppable'
], function (_, LM, Helper, templates, modelUrls, UserDataModel, MsgBox) {
    return LM.View.extend({
        template: templates['commons/logicmonitor/controls/FlatTree'],
        nodeTemplate: templates['commons/logicmonitor/controls/partials/FlatTreeSubNode'],
        className: 'flat-tree-section',
        tagName: 'section',

	    nodes: [],

        events: {
            //click tree node
            'click  li.folder': '_onClickFolder',
            'click  li.item': '_onClickItem',
            'click  li.collection': '_onClickCollection',

//            //hover tree for display long name
//            'mouseenter .fashion-tree-body': '_onHoverTreeBody',
//            'mouseleave .fashion-tree-body': '_onHoverTreeBody',

            //events on breadcrumb
            'click  div.breadcrub-bar': '_onClickBar',
            'click  div.breadcrumb-home': '_onClickHome',
            'click  div.breadcrumb-item': '_onClickCurrentBreadcrumb',
            'mouseenter  div.breadcrumb-rollup': '_onEnterRollUp',
            'mouseleave  div.rollup-dropdown': '_onLeaveDropDown',
            'click  div.rollup-dropdown li': '_onClickAncestorFolder'
        },

        initialize: function (options) {
            var me = this;
            options = options || {};
            me.ancestralFolders = options.ancestralFolders || [];
            me.namespace = _.uniqueId('flatTree');

            //capture keydown events
            $('body').on('keydown.' + me.namespace, function (e) {
                switch (e.which) {
                    case 37: //left arrow
                        me.$('.breadcrumb-bar').last().trigger('click');
                        break;
                    case 38: //up arrow
                        me._keyboardNav(e);
                        break;
                    case 39: //right arrow
                        me.$('li.highlight').eq(0).trigger('click');
                        break;
                    case 40: //down arrow
                        me._keyboardNav(e);
                        break;
                    case 107: //+ key
                        //This action looks like little use for us.
                        break;
                    case 13: //enter key
                        me.$('li.highlight').eq(0).trigger('click');
                        break;
                }
            });

            //use defer because the parent view does not listen this view when this view is initializing
            _.defer(function () {
                me._afterInit();
                //me.trigger('tree:nodeSelected', me.folderData, null);
            });
        },

        render: function () {
            var me = this;

            if (!me.folderData) {
                return;
            }

            var templateData = _.clone(me.folderData);
            templateData.nodes = me.nodes;
            templateData.ancestralFolders = me.ancestralFolders;
            templateData.ancestorsLength = me.ancestralFolders.length;

            this.$el.html(this.template(templateData)).find('.tree-list ul').fadeIn('fast');
            me._afterRender(me.folderData, me.$('.breadcrumb-item'), me.nodes, me.$('.tree-list li'));

            return me;

            //TODO checkbox relative functions
        },


        // functions need to overwrite begin
	    // the default implementation support the user define a simple rootData for the root node rendering
        _afterInit: function () {
	        if(this.folderData) {
		        this.$('.breadcrumb-item').click();
	        }
        },

        _afterRender: function (folderData, $folder, nodes, $nodes) {

        },

        _afterCollectionRender: function(nodes, $nodes){

        },

        _getChildrenNodes: function (folderData, cb) {

        },
        //functions need to overwrite end


        //section 1
        //public functions begin
        getFolderData: function () {
            return this.folderData;
        },

        getRootData: function () {
            return this.ancestralFolders.length > 0 ? this.ancestralFolders[0] : this.folderData;
        },

        selectNode: function (id, dataType) {
            //for the business logic of tree, only item node could been selected
            var $node = this.$('.tree-list li.item[data-id=' + id + '][data-data-type=' + dataType + ']');
            $node.trigger('click');
        },

        refresh: function (isBackToRoot) {
            if (isBackToRoot) {
                this.$('.breadcrumb-home').trigger('click');
            } else {
                this.$('.breadcrumb-item').trigger('click');
            }
        },

        //public functions end


        //section 2
        //effect and animation functions begin
        _goNextFolderAnimation: function ($node, cb) {
            var me = this;
            var $animationHolder = $('<div class=\"animation-holder\">' + $node.find('.node-name').text() + '</div>');
            $(document.body).append($animationHolder);

            $animationHolder.width($node.width() * 0.7);
            $animationHolder.height($node.height);
            $animationHolder
                .offset({
                    left: $node.offset().left,
                    top: $node.offset().top
                });

            var $destEle = this.$('div.breadcrumb');

            $animationHolder
                .offset({
                    left: $destEle.offset().left + $node.width() * 0.3,
                    top: $destEle.offset().top + 10
                })
                .css({
                    width: $destEle.width() + 'px',
                    opacity: 0
                });

            _.delay(function () {
                $animationHolder.remove();

                //show bounce animation begin
                if (me.ancestralFolders.length === 0) {
                    cb();
                    return;
                }

                var $rollUp = me.$('.breadcrumb-rollup');
                var rollUpWidth = $rollUp.width();

                $rollUp
                    .find('.number').text(me.ancestralFolders.length)
                    .end()
                    .show()
                    .width(0)
                    .animate({ width: rollUpWidth }, 100)
                    .animate({width: '-=5'}, 30, function () {
                        $(this).animate({width: '+=5'}, 50, function () {
                            $(this).width('auto').css('overflow', 'visible');

                            //make it flash
                            $rollUp.addClass('rollup-flash', 100, function () {
                                $(this).removeClass('rollup-flash', 200);
                            });

                            if (cb) {
                                cb();
                            }
                        });
                    });
                //show bounce animation end
            }, 400);
        },

        _onEnterRollUp: function (e) {
            e.stopPropagation();

            //position
            var $rollUp = $(e.currentTarget);
            var left = $rollUp.position().left;
            var top = $rollUp.position().top + $rollUp.height() + 10;

            //show list
            this.$('.rollup-dropdown')
                .css({ left: left + 'px', top: top + 'px' })
                .slideDown(100);
        },

        _onLeaveDropDown: function (e) {
            e.stopPropagation();
            $(e.currentTarget).slideUp(100);
        },

        _loadingShow: function (isShow) {
            if (isShow) {
                var $elem = this.$('.fashion-tree-body');
                var posTop = $elem.offset().top;
                var posLeft = $elem.offset().left;

                //because the icon width is 32px, so minus 16 just its horizontal center point
                var offsetLeft = ($elem.width() / 2) - 16;
                var $temp = $('<div class=\"fashion-tree-loading loadingGray\"></div>');
                $temp
                    .css({
                        position: 'fixed',
                        top: posTop + 'px',
                        left: posLeft + offsetLeft + 'px',
                        'margin-top': '50px'
                    })
                    .appendTo('body');
            } else {
                $('div.fashion-tree-loading').remove();
            }
        },
        //effect and animation functions end

        //section3
        //node operation functions begin
        _onClickCollection: function (e) {
            e.stopPropagation();
            var me = this;
            var $el = $(e.currentTarget);
            var id = $el.data('id');
            var nodeType = $el.data('nodeType');
            var dataType = $el.data('dataType');
            var mark = id + dataType;
            $el.addClass('selected').siblings('.item').removeClass('selected');

            if ($el.hasClass('expand')) {
                $el.removeClass('expand');
                me.$('li[data-mark="' + mark + '"]').remove();
            } else {
                $el.addClass('expand');
                var nodeData = _.findWhere(me.nodes, {id: id, dataType: dataType});
                nodeData.hostId = me.folderData.id;
                me._loadingShow(true);
                me._getChildrenNodes(nodeData, function (nodes) {
                    me._loadingShow(false);

                    var ancestorsLength = me.ancestralFolders.length;
                    _.each(nodes, function (node) {
                        node.ancestorsLength = ancestorsLength;
                        node.mark = mark;
                    });

                    var html = me.nodeTemplate(nodes);
                    $el.after(html);
                    var $nodes = me.$('li[data-mark="' + mark + '"]')
                    $nodes.each(function (index) {
                        $(this).data('nodeData', nodes[index]);
                    });
                    me._afterCollectionRender(nodes, $nodes);
                });
            }
        },

        _onClickItem: function (e) {
            e.stopPropagation();
            var me = this;
            var $el = $(e.currentTarget);
            var id = Number($el.data('id'));
            var nodeType = $el.data('nodeType');
            var dataType = $el.data('dataType');

            $el.addClass('selected').siblings('.item').removeClass('selected');

            var nodeData;
            if ($el.hasClass('sub')) {
                nodeData = $el.data('nodeData');
            } else {
                nodeData = _.findWhere(me.nodes, {id: id, dataType: dataType});
            }

            this.trigger('tree:nodeSelected', nodeData, me.folderData);
        },

        _onClickFolder: function (e) {
            var me = this;
            e.stopPropagation();
            var $el = $(e.currentTarget);
            var id = Number($el.data('id'));
            var dataType = $el.data('dataType');

            if (me.onFolderAnimation) {
                return;
            }

            var newFolderData;
            var parentFolderData = me.folderData;
            if ($el.hasClass('sub')) {
                newFolderData = $el.data('nodeData');
            } else {
                newFolderData = _.findWhere(me.nodes, {id: id, dataType: dataType});
            }

            me.onFolderAnimation = true;
            me._goNextFolderAnimation($el, function () {
                me._changeFolder(newFolderData, parentFolderData, 'next');
            });
        },

        _onClickBar: function (e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);
            var index = $el.index();

            var newFolderData = this.ancestralFolders[index];
            var parentFolderData = index === 0 ? null : this.ancestralFolders[index - 1];
            this._changeFolder(newFolderData, parentFolderData, 'prev');
        },

        _onClickHome: function (e) {
            e.stopPropagation();
            var length = this.ancestralFolders.length;

            var newFolderData = length > 0 ? this.ancestralFolders[0] : this.folderData;
            var parentFolderData = null;
            this._changeFolder(newFolderData, parentFolderData, 'prev');
        },

        _onClickCurrentBreadcrumb: function (e) {
            e.stopPropagation();
            var length = this.ancestralFolders.length;

            var newFolderData = this.folderData;
            var parentFolderData = length > 0 ? this.ancestralFolders[length - 1] : null;
            this._changeFolder(newFolderData, parentFolderData, 'self');
        },

        _onClickAncestorFolder: function (e) {
            e.stopPropagation();
            var $el = $(e.currentTarget);
            var id = Number($el.data('id'));
            var index = this._getIndexFromAncestralFolders(id);

            var newFolderData = this.ancestralFolders[index];
            var parentFolderData = this.ancestralFolders[index - 1];
            this._changeFolder(newFolderData, parentFolderData, 'prev');
        },


        //changePosition: 'next', 'prev', 'self', to update ancestralFolders
        _changeFolder: function (newFolderData, parentFolderData, changePosition, selectNodeId) {
            var me = this;
            me.$('.tree-list').
                fadeOut('fast', function () {
                    me.onFolderAnimation = false;
                    if (changePosition === 'next') {
                        me.ancestralFolders.push(me.folderData);
                    }

                    if (changePosition === 'prev') {
                        var index = me._getIndexFromAncestralFolders(newFolderData.id);
                        me.ancestralFolders = me.ancestralFolders.slice(0, index);
                    }

                    me.folderData = newFolderData;

                    me._loadingShow(true);
                    //console.log(newFolderData)
                    me._getChildrenNodes(newFolderData, function (nodes) {
                        me._loadingShow(false);

                        me.trigger('tree:nodeSelected', newFolderData, parentFolderData);
                        me.nodes = nodes;
                        me.render();

                        //if has selectNodeId, should select this node after folder render
                        if (selectNodeId) {
                            me.selectNode(selectNodeId, newFolderData.dataType);
                        }
                    });
                });
        },
        //node operation functions end


        //section4**************
        //helper functions begin
        _getIndexFromAncestralFolders: function (id) {
            var index = -1;
            _.each(this.ancestralFolders, function (folder, folderIndex) {
                if (folder.id == id) {
                    index = folderIndex;
                }
            });
            return index;
        },
        //helper functions end


        //section 5
        //keyboard shortcuts and resize functions begin
        _keyboardNav: function (e) {
            var $nodes = this.$('.tree-list li');
            var $highlightNode = this.$('.tree-list li.highlight');

            if ($nodes.length > 0) {
                var index;
                if (e.keyCode === 38) { //up arrow
                    index = $highlightNode.length > 0 ? $highlightNode.index() - 1 : $nodes.length - 1;
                } else { //down arrow
                    index = $highlightNode.length > 0 ? $highlightNode.index() + 1 : 0;
                }

                $highlightNode.removeClass('highlight');
                $nodes.eq(index).addClass('highlight');
            }
        },
        //keyboard shortcuts and resize functions end


        //Now use title attr instead of expand and collapse
//        _onHoverTreeBody: function (e) {
//            if (e.type === "mouseleave") {
//                this.trigger("fashionTree.mouseleave");
//            } else {
//                var $nodeNames = $(e.currentTarget).find(".node-name");
//
//                if ($nodeNames.length === 0) {
//                    return;
//                }
//
//                var maxLength = 0;
//                var $maxLengthNode;
//                $nodeNames.each(function () {
//                    var currLength = $(this).text().length;
//                    if (currLength > maxLength) {
//                        maxLength = currLength;
//                        $maxLengthNode = $(this);
//                    }
//                });
//
//                var cutWidth = $maxLengthNode.width();
//                $maxLengthNode.css("maxWidth", "1000%");
//                var realWidth = $maxLengthNode.width();
//                $maxLengthNode.css("maxWidth", "85%");
//
//                if (realWidth > cutWidth) {
//                    this.trigger("fashionTree.mouseenter", cutWidth, realWidth);
//                }
//            }
//        },
//

//
//        addNode: function (options) {
//            var index = options.index || 0;
//            var className = options.className || "";
//            var nodeName = options.nodeName || "";
//            var clickFunc = options.clickFunc;
//            var addTemplate = _.template("<li class=\"custom {{=className}}\"><span class=\"node-name\">{{=nodeName}}</span></li>", {
//                nodeName: nodeName,
//                className: className
//            });
//            var $tree = this.$(".tree-list > ul");
//
//            if (index === 0) {
//                $tree.prepend(addTemplate);
//            } else {
//                $tree.children("li").eq(index).before(addTemplate);
//            }
//
//            if (clickFunc) {
//                this.$("li." + className).on("click", function (e) {
//                    clickFunc.apply(this, arguments);
//                });
//            }
//        },

        remove: function () {
            $('body').off('keydown.' + this.namespace);
            LM.View.prototype.remove.apply(this, arguments);
        }
    });
});
(function($) {
    $.fn.tabs = function(tabsClass, tabsContentClass, activeTabClass, activeTabContentClass) {
        this.each(function() {
            var element = $(this);

            if(element.data('tabs')) return;
            element.data('tabs', true);

            if(!tabsClass) tabsClass = 'tab';
            if(!tabsContentClass) tabsContentClass = 'tab-content';
            if(!activeTabClass) activeTabClass = 'active';
            if(!activeTabContentClass) activeTabContentClass = 'active';

            var $tabs = element.find('.'+tabsClass);
            var $tabContents = element.find('.'+tabsContentClass);

            $tabs.click(function(event) {
                event.preventDefault();

                var history = true;

                var tab = $(this);
                var target = tab.attr('href');
                if(!target) {
                    target = tab.data('href');
                    if(target) {
                        history = false;
                    }
                }
                if(!target) target = tab.find('a:first').attr('href');
                if(!target) {
                    target = tab.find('a:first').data('href');
                    if(target) {
                        history = false;
                    }
                }
                if(!target) return;

                if (history && window.history) {
                    window.history.pushState({tab:target}, '', target);
                }

                $tabContents.removeClass(activeTabContentClass);
                $tabs.removeClass(activeTabClass);
                tab.addClass(activeTabClass);

                if (target.substr(0, 1)=='#') {
                    element.find(target).addClass(activeTabContentClass).trigger('tabs.show');
                } else {
                    var contentId;
                    var split = target.split('#');
                    if(split && split.length==2) {
                        contentId = split[1];
                    }

                    var content = tab.data('tab-content');
                    if(content) {
                        content.addClass(activeTabContentClass).trigger('tabs.show');
                    } else {
                        $.ajax(target, {
                            success: function(html) {
                                var content = $('<div>'+html+'</div>');
                                if(contentId) {
                                    var c = element.find('#'+contentId);
                                    c.addClass(activeTabContentClass).html(content.html()).trigger('tabs.show');
                                    tab.data('tab-content', c);
                                } else {
                                    content.addClass(tabsContentClass).addClass(activeTabContentClass).appendTo(element).trigger('tabs.show');
                                    $tabContents = $tabContents.add(content);
                                    tab.data('tab-content', content);
                                }
                            }
                        });
                    }
                }
            });

            $(window).on('popstate', function(event) {
                if (event.originalEvent.state && event.originalEvent.state.tab) {
                    element.find('a[href="'+event.originalEvent.state.tab+'"]').trigger('click');
                }
            });

            if(location.hash) {
                var e = element.find('a[href="'+location.hash+'"]');
                if(e.length) {
                    e.trigger('click');
                    return;
                }
            }

            if($tabs.filter('.'+activeTabClass).length) {
                $tabs.filter('.'+activeTabClass).first().trigger('click');
            } else {
                $tabs.filter(':first').first().trigger('click');
            }
        });
    }
})(jQuery);
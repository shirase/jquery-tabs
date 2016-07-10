(function($) {
    $(window).on('popstate', function(event) {
        if (event.originalEvent.state && event.originalEvent.state.tab) {
            $('a[href="'+event.originalEvent.state.tab+'"]').trigger('click');
        }
    });

    var tabs_counter = 0;
    $.fn.tabs = function(tabsSelector, tabsContentSelector, activeTabClass, activeTabContentClass) {
        this.each(function() {
            var element = $(this);

            if(element.data('tabs')) return;
            element.data('tabs', true);

            if(!tabsSelector) tabsSelector = '.tab';
            if(!tabsContentSelector) tabsContentSelector = '.tab-content';
            if(!activeTabClass) activeTabClass = 'active';
            if(!activeTabContentClass) activeTabContentClass = 'active';

            var tabs = element.find(tabsSelector).disableSelection();
            var active = tabs.filter('.'+activeTabClass).prevAll().length + 1;
            tabs.removeClass(activeTabClass);

            tabs.eq(active-1).addClass(activeTabClass);

            element.find(tabsContentSelector).removeClass(activeTabContentClass).eq(active-1).addClass(activeTabContentClass).trigger('tabs.show');

            tabs.click(function(event) {
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

                element.find(tabsSelector).removeClass(activeTabClass);
                tab.addClass(activeTabClass);

                if (target.substr(0, 1)=='#') {
                    element.find(tabsContentSelector).removeClass(activeTabContentClass);
                    element.find(target).addClass(activeTabContentClass).trigger('tabs.show');
                } else {
                    var id;
                    if (!tab.data('loaded-id')) {
                        id = 'tab'+(++tabs_counter);
                        tab.data('loaded-id', id);
                        $.ajax(target, {
                            success: function(html) {
                                var wrap = $('<div>'+html+'</div>');
                                wrap.find(tabsContentSelector).addClass(activeTabContentClass).attr('id', id);
                                wrap.appendTo(element);
                                wrap.trigger('tabs.show');
                            }
                        });
                    } else {
                        id = $(this).data('loaded-id');
                        element.find(tabsContentSelector).removeClass(activeTabContentClass);
                        element.find('#'+id).addClass(activeTabContentClass).trigger('tabs.show');
                    }
                }
            });
        });
    }
})(jQuery);
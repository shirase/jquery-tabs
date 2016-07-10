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

            element.find(tabsSelector).click(function(event) {
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

                element.find(tabsContentSelector).removeClass(activeTabContentClass);

                element.find(tabsSelector).removeClass(activeTabClass);
                tab.addClass(activeTabClass);

                if (target.substr(0, 1)=='#') {
                    element.find(tabsContentSelector).removeClass(activeTabContentClass);
                    element.find(target).addClass(activeTabContentClass).trigger('tabs.show');
                } else {
                    element.find(tabsContentSelector).removeClass(activeTabContentClass);
                    var id;
                    if (!tab.data('tabs-loaded-id')) {
                        id = 'tab'+(++tabs_counter);
                        tab.data('tabs-loaded-id', id);
                        $.ajax(target, {
                            success: function(html) {
                                $('<div>'+html+'</div>')
                                    .addClass(tabsContentSelector)
                                    .addClass(activeTabContentClass)
                                    .attr('id', id)
                                    .appendTo(element)
                                    .trigger('tabs.show');
                            }
                        });
                    } else {
                        id = $(this).data('tabs-loaded-id');
                        element.find('#'+id).addClass(activeTabContentClass).trigger('tabs.show');
                    }
                }
            }).disableSelection().filter('.'+activeTabClass+',:first').first().trigger('click');
        });
    }
})(jQuery);
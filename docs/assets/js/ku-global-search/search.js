window.searchCallbacks = [];

jQuery(function () {

    var forms = $('.global-search'),
        current_engine = {};

    function initSearchForm() {

        forms.each(function () {

            var form = $(this),
                field = form.find('.global-search-query'),
                filter = form.find('.global-search-options-filter'),
                filter_btn = form.find('.global-search-options-toggle');

            filter_btn.html(window.searchEngines[0].label);
            current_engine = window.searchEngines[0];

            for (var se in window.searchEngines) {

                var engine = window.searchEngines[se],
                    option = $(document.createElement('li'));

                option.text(engine.label);
                option.attr('data-label', engine.label);
                option.attr('data-value', se);
                option.on('click', function(event) {
                    filter_btn.html(event.target.dataset.label);
                    current_engine = window.searchEngines[event.target.dataset.value];
                });
                filter.append(option);
            }
            
            form.submit(function (event) {

                form.attr('action', current_engine.url);
                form.attr('method', current_engine.method || 'GET');
                field.attr('name', current_engine.querykey);
                if (current_engine.param) {
                    for (var paramName in current_engine.param) {
                        var input = jQuery(document.createElement('input'));
                        input.attr('type', 'hidden');
                        input.attr('name', paramName);
                        input.val(current_engine.param[paramName]);
                        form.append(input);
                    }
                }
                for (var i = 0; i < window.searchCallbacks.length; i++) {
                    var callback = window.searchCallbacks[i];
                    if (jQuery.isFunction(callback)) {
                        callback(current_engine, this);
                    }
                }
            });
        });
    };

    if (window.searchEngines) {

        initSearchForm();

    } else {

        forms.destroy();
        console.log('No search engine data available.')

    };

});

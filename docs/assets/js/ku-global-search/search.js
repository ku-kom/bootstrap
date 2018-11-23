window.searchCallbacks = [];
jQuery(function(jQuery) {
  var forms = jQuery('.global-search'),
    current_engine = {};
  function initSearchForm() {
    forms.each(function() {
      var form = jQuery(this),
        field = form.find('.global-search-query'),
        filter = form.find('.global-search-options-filter'),
        filter_btn = form.find('.global-search-options-toggle');
      filter_btn.html(window.searchEngines[0].label);
      current_engine = window.searchEngines[0];

      jQuery.each(window.searchEngines, function(index, value) {
        var engine = value,
            option = jQuery(document.createElement('li'));

        option.text(engine.label);
        option.attr('data-label', engine.label);
        option.attr('data-value', index);
        option.on('click', function(event) {
          filter_btn.html(event.target.dataset.label);
          current_engine = window.searchEngines[event.target.dataset.value];
        });
        filter.append(option);
      });

      form.submit(function() {
        form.attr('action', current_engine.url);
        form.attr('method', current_engine.method || 'GET');
        field.attr('name', current_engine.querykey);
        if (current_engine.param) {
          jQuery.each(current_engine.param, function(key, value) {
            var input = jQuery(document.createElement('input'));
            input.attr('type', 'hidden');
            input.attr('name', key);
            input.val(value);
            form.append(input);
          });
        }
        for (var i = 0; i < window.searchCallbacks.length; i++) {
          var callback = window.searchCallbacks[i];
          if (jQuery.isFunction(callback)) {
            callback(current_engine, this);
          }
        }
      });
    });
  }

  if (window.searchEngines) {
    initSearchForm();
  } else {
    forms.remove();
    console.log('No search engine data available.');
  }
});

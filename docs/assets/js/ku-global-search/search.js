window.searchCallbacks = [];

jQuery(function() {

  var stripPath = function(path) {
    return path === "/" ? path : path.replace(/\/$/, "");
  };

  var isEngineCurrent = function(engine) {
    if (stripPath(engine.url) !== stripPath(document.location.origin + document.location.pathname)) {
      return false;
    }
    if (engine.param) {
      for (var key in engine.param) {
        if (getUrlParameter(key) !== engine.param[key]) {
          return false;
        }
      }
    }
    return true;
  };
  $('#searchfilter').on('click', 'li', function() {
    $('li[data-selected="selected"]').attr('data-selected', '');
    $(this).attr('data-selected', 'selected');
    var $area = $("#search");
    $area.text($(this).text());
    $area.append('<span class="caret"></span><span class="sr-only">Search options</span>');
  });
  var forms = jQuery("form.search_form");
  forms.each(function() {
    var form = jQuery(this);
    var field = form.find("#global_search_query");
    var filter = form.find("#searchfilter");
    var resetForm = form.hasClass("search_reset");

    if (window.searchEngines) {
      for (var i = 0; i < window.searchEngines.length; i++) {
        var engine = window.searchEngines[i];
        var option = jQuery(document.createElement("li"));
        option.text(engine.label);
        option.attr('data-value', i);
        if (i === 0) {
          option.attr('data-selected', 'selected');
        } else {
          option.attr('data-selected', '');
        }
        if (!resetForm && isEngineCurrent(engine)) {
          option.attr('data-selected', 'selected');
          field.val(getUrlParameter(engine.querykey));
        }
        filter.append(option);
      }
      form.submit(function(event) {
        var chosenEngine = window.searchEngines[$('li[data-selected="selected"]').data('value')];
        //console.log(chosenEngine);
        form.attr("action", chosenEngine.url);
        form.attr("method", chosenEngine.method || "GET");
        field.attr("name", chosenEngine.querykey);
        if (chosenEngine.param) {
          for (var paramName in chosenEngine.param) {
            var input = jQuery(document.createElement("input"));
            input.attr("type", "hidden");
            input.attr("name", paramName);
            input.val(chosenEngine.param[paramName]);
            form.append(input);
          }
        }
        for (var i = 0; i < window.searchCallbacks.length; i++) {
          var callback = window.searchCallbacks[i];
          if (jQuery.isFunction(callback)) {
            callback(chosenEngine, this);
          }
        }
      });
    }
  });
});

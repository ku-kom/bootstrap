// Search students and employees in external KU phone book
// Nanna Ellegaard, KU KOM.
(function($) {
  var $form = $('#phoneform'),
    $box = $('#box'),
    $output = $('#emp'),
    $input = $('#soge'),
    $feedback = $('#feedback'),
    $loading = $feedback.next($('.ku-loading')),
    $reset = $('#reset'),
    lang = $('#lang').val() || 'da',
    $totalRecords = 0,
    $pager = $('.pagination'),
    result = [],
    employees = [],
    apply_pagination,
    isEmpty,
    isEmail,
    isUrl,
    isPhone,
    recordsIndex,
    endRec,
    perPage = 10,
    page = 1,
    totalPages = 0;

  // Submit form and handle messages
  $('#go-find').on('click', function(e) {
    e.preventDefault();
    $feedback.html('');
    $box.html('');
    if (!$.trim($input.val()).length) {
      $input.focus();
      $feedback.append('<div class="alert alert-danger" role="alert" aria-atomic="true">Enter search terms<div>');
      $reset.addClass('inactive');
    } else {
      $form.trigger('submit');
    }
  });

  // Reset search field and messages
  $($reset).on('click', function(e) {
    $input.focus();
    $reset.addClass('inactive');
    $feedback.html('');
    $box.html('');
    $pager.twbsPagination('destroy');
  });

  // if input has text, enable reset button
  $input.keyup(function() {
    $(this).val() == '' ? $reset.addClass('inactive') : $reset.removeClass('inactive');
  });

  // Handle submit of search form
  $form.on('submit', function(e) {
    e.preventDefault();
    $loading.show();
    $.ajax({
        url: 'https://www2.adm.ku.dk/selv/pls/!app_tlfbog_v2.soeg',
        data: 'format=json&startrecord=0&recordsperpage=100&searchstring=' + encodeURIComponent($input.val()) + '&env=about', //the parameter env="" is used to define the correct domain in the backend CORS policy.
        method: 'post',
        jsonp: false, // Set to false for security reasons
        dataType: 'json'
      })
      .done(function(data) {
        //console.log(data);
        employees = (data.root || {}).employees || [];
        // Check result and if paging plugin is loaded
        if (employees.length > 0 && $.fn.twbsPagination) {
          $totalRecords = employees.length;
          totalPages = Math.ceil($totalRecords / perPage);
          $reset.removeClass('inactive');
          $pager.twbsPagination('destroy');
          apply_pagination();
        } else {
          $loading.hide();
          $feedback.append('<div class="alert alert-warning" role="alert" aria-atomic="true">No results.<div>');
        }
      })
      .fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr);
        $loading.hide();
        $feedback.append('<div class="alert alert-danger" role="alert" aria-atomic="true">Error communicating with the webservice. Try again later.<div>');
      });


    function generate_table() {
      var $ul = $('<ul class="media-list" id="emp" />');
      var $li;
      $feedback.html('');
      $box.html('');
      $loading.hide();
      for (var i = 0; i < result.length; i++) {
        // No labels if values are empty
        var name = (isEmpty(result[i].PERSON_FORNAVN)) ? '' : '<dt>Name</dt><dd><div class="ku-navn">' + result[i].PERSON_FORNAVN + ' ' + result[i].PERSON_EFTERNAVN + '</div></dd>';
        var img = (isEmpty(result[i].FOTOURL)) ? '' : '<img class="media-object" src="' + result[i].FOTOURL + '" alt="' + result[i].PERSON_FORNAVN + ' ' + result[i].PERSON_EFTERNAVN + '">';

        // If values are empty, use Danish ones, or else empty
        var title;
        var title_da = (isEmpty(result[i].ANSAT_UOFF_STIL_TEKST)) ? '' : result[i].ANSAT_UOFF_STIL_TEKST;
        var title_en = (isEmpty(result[i].ANSAT_UOFF_STIL_TEKST_ENGELSK)) ? title_da : result[i].ANSAT_UOFF_STIL_TEKST_ENGELSK;
        title = (isEmpty(title_en)) ? '' : '<dt>Title</dt><dd>' + title_en + '</dd>';

        var funktion;
        var func_da = (isEmpty(result[i].ANSAT_FUNKTION)) ? '' : result[i].ANSAT_FUNKTION;
        var func_en = (isEmpty(result[i].ANSAT_FUNKTION_ENGELSK)) ? func_da : result[i].ANSAT_FUNKTION_ENGELSK;
        funktion = (isEmpty(func_en)) ? '' : '<dt>Function</dt><dd>' + func_en + '</dd>';

        var unit;
        var unit_da = (isEmpty(result[i].STED_NAVN_SAMLET)) ? '' : result[i].STED_NAVN_SAMLET;
        var unit_en = (isEmpty(result[i].STED_NAVN_SAMLET_ENG)) ? unit_da : result[i].STED_NAVN_SAMLET_ENG;
        unit = (isEmpty(unit_en)) ? '' : '<dt>Unit/&shy;dept.</dt><dd>' + unit_en + '</dd>';

        var secr = (isEmpty(result[i].ANSAT_TLF_SEKR)) ? '' : '<dt>Secretary</dt><dd>' + isPhone(result[i].ANSAT_TLF_SEKR) + '</dd>';
        var website = (isEmpty(result[i].ANSAT_WWW)) ? '' : '<dt>Website</dt><dd>' + isUrl(result[i].ANSAT_WWW) + '</dd>';
        var pure = (isEmpty(result[i].ANSAT_PURE_UK)) ? '' : '<dt>Profile</dt><dd><a aria-label="Research profile and publications by ' + result[i].PERSON_FORNAVN + ' ' + result[i].PERSON_EFTERNAVN + '" href="' + result[i].ANSAT_PURE_UK + '">Research profile and publications</a></dd>';
        var email = (isEmpty(result[i].ANSAT_ARB_EMAIL)) ? '' : '<dt>Email</dt><dd>' + isEmail(result[i].ANSAT_ARB_EMAIL) + '</dd>';
        var mobil = (isEmpty(result[i].ANSAT_MOBIL)) ? '' : '<dt>Mobile</dt><dd>' + isPhone(result[i].ANSAT_MOBIL) + '</dd>';
        var tel = (isEmpty(result[i].ANSAT_ARB_TLF)) ? '' : '<dt>Phone</dt><dd>' + isPhone(result[i].ANSAT_ARB_TLF) + '</dd>';
        var address = (isEmpty(result[i].ANSAT_ADRESSE)) ? '' : '<dt>Address</dt><dd>' + result[i].ANSAT_ADRESSE + '</dd>';
        var location = (isEmpty(result[i].LOKATION)) ? '' : '<dt>Location</dt><dd>' + result[i].LOKATION + '</dd>';
        var remarks = (isEmpty(result[i].BEMAERK)) ? '' : '<dt>Remarks</dt><dd>' + result[i].BEMAERK + '</dd>';

        $li = $('<li class="contact-list"/>');
        var html = '<dl class="dl-horizontal">' +
          '<div class="ku-result">' +
          '<div class="contact-right">' + img + '</div>' +
          name + title + funktion + pure + unit +
          '</div>' +
          '<div class="ku-kontakt">' +
          email + mobil + tel + secr + website + address + location + remarks +
          '</div>' +
          '</dl>';

        $li.append(html);
        $ul.append($li);

        var current = (recordsIndex === 0) ? (recordsIndex + 1) : recordsIndex;
        var currentMax = ($totalRecords < perPage || endRec > $totalRecords) ? $totalRecords : endRec;
        var suffix = ($totalRecords > 1) ? 'results.' : 'result.';

        $feedback.html('Showing ' + current + ' to ' + currentMax + ' out of ' + $totalRecords + ' ' + suffix);
      }
      $box.append($ul);
    }

    apply_pagination = function() {
      $pager.show();
      // Pager plugin settings
      var visible_pages = (window.matchMedia('(max-width: 767px)').matches) === true ? 3 : 5;
      $pager.twbsPagination({
        totalPages: totalPages,
        visiblePages: visible_pages,
        hideOnlyOnePage: true,
        onPageClick: function(event, page) {
          recordsIndex = Math.max(page - 1, 0) * perPage;
          endRec = (recordsIndex) + perPage;
          result = employees.slice(recordsIndex, endRec);
          generate_table();
          $(document).on('click', '.page-item', function(e) {
            // Stop animation is user is scrooling
            $('html, body').stop();
            // Scroll to top when clicking pager
            $('html, body').animate({
              scrollTop: $($form).offset().top
            }, 500);
            $(window).bind('mousewheel', function() {
              // Stop animation if user is scrooling
              $('html, body').stop();
            });
          });
        }
      });
      $('.page-item > a').attr('rel', 'nofollow');
    }

    isEmail = function(mail) {
      // Check if value is an e-mail
      var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
      if (re.test(mail) === true) {
        return '<a class="ku-mail" href="mailto:' + mail + '">' + mail + '</a>';
      } else {
        return mail;
      }
    }

    isUrl = function(url) {
      // Check is value is a url
      var re = /(https?:\/\/[^\s]+)/g;
      if (re.test(url) === true) {
        return '<a href="' + url + '">' + url + '</a>';
      } else {
        return url;
      }
    }

    isPhone = function(no) {
      // Check if value is a phone number
      var re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
      // Check if number starts with '+' or 00
      var prefix = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

      if (re.test(no) === true) {
        // Remove everything that is not a digit or plus
        no = no.replace(/[^0-9+]+/g, '');

        if (!no.match(prefix)) {
          // Prefix with +45 if the number doesn't start with +45 or 0045
          no = '+45' + no;
        }
        // Split number into groups of two digits
        var formatted = [no.slice(0, 3), ' ', no.slice(3, 5), ' ', no.slice(5, 7), ' ', no.slice(7, 9), ' ', no.slice(9)].join('');
        return '<a href="tel:' + no + '">' + formatted + '</a>';
      } else {
        return no;
      }
    }

    isEmpty = function(value) {
      // Returns true if value is empty
      return (value == null || value == 'undefined' || value.length === 0);
    }
  });
})(jQuery);

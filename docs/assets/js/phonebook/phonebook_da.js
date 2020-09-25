// Search students and employees in external KU phone book
// Nanna Ellegaard, KU KOM.
(function($) {
  var $form = $('#phoneform'),
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
    $output.html('');
    if (!$.trim($input.val()).length) {
      $input.focus();
      $feedback.append('<div class="alert alert-danger" role="alert" aria-atomic="true">Angiv s&oslash;geord<div>');
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
    $output.html('');
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
        //url: '/system/telefonbog-service.mason',
        url: 'https://www2.adm.ku.dk/selv/pls/!app_tlfbog_v2.soeg',
        data: 'format=json&startrecord=0&recordsperpage=100&searchstring=' + encodeURIComponent($input.val()) + '&env=om', //the parameter env="" is used to define the correct domain in the backend CORS policy.
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
          $feedback.append('<div class="alert alert-warning" role="alert" aria-atomic="true">Ingen resultater fundet.<div>');
        }
      })
      .fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr);
        $loading.hide();
        $feedback.append('<div class="alert alert-danger" role="alert" aria-atomic="true">Fejl i kommunikationen med webservicen - prøv igen senere.<div>');
      });


    function generate_table() {
      var $li;
      $feedback.html('');
      $output.html('');
      $loading.hide();
      for (var i = 0; i < result.length; i++) {
        // No labels if values are empty
        var name = (isEmpty(result[i].PERSON_FORNAVN)) ? '' : '<dt>Navn</dt><dd><div class="ku-navn">' + result[i].PERSON_FORNAVN + ' ' + result[i].PERSON_EFTERNAVN + '</div></dd>';
        var img = (isEmpty(result[i].FOTOURL)) ? '' : '<img class="media-object" src="' + result[i].FOTOURL + '" alt="' + result[i].PERSON_FORNAVN + ' ' + result[i].PERSON_EFTERNAVN + '">';
        var title = (isEmpty(result[i].ANSAT_UOFF_STIL_TEKST)) ? '' : '<dt>Titel</dt><dd>' + result[i].ANSAT_UOFF_STIL_TEKST + '</dd>';
        var unit = (isEmpty(result[i].STED_NAVN_SAMLET)) ? '' : '<dt>Enhed/&shy;afdeling</dt><dd>' + result[i].STED_NAVN_SAMLET + '</dd>';
        var funktion = (isEmpty(result[i].ANSAT_FUNKTION)) ? '' : '<dt>Funktion</dt><dd>' + result[i].ANSAT_FUNKTION + '</dd>';
        var secr = (isEmpty(result[i].ANSAT_TLF_SEKR)) ? '' : '<dt>Sekret&aelig;r</dt><dd>' + isPhone(result[i].ANSAT_TLF_SEKR) + '</dd>';
        var pure = (isEmpty(result[i].ANSAT_PURE_DK)) ? '' : '<dt>Profil</dt><dd><a aria-label="Forskning af ' + result[i].PERSON_FORNAVN + ' ' + result[i].PERSON_EFTERNAVN + '" href="' + result[i].ANSAT_PURE_DK + '">Forskning og publikationer</a></dd>';
        var website = (isEmpty(result[i].ANSAT_WWW)) ? '' : '<dt>Website</dt><dd>' + isUrl(result[i].ANSAT_WWW) + '</dd>';
        var email = (isEmpty(result[i].ANSAT_ARB_EMAIL)) ? '' : '<dt>E-mail</dt><dd>' + isEmail(result[i].ANSAT_ARB_EMAIL) + '</dd>';
        var mobil = (isEmpty(result[i].ANSAT_MOBIL)) ? '' : '<dt>Mobil</dt><dd>' + isPhone(result[i].ANSAT_MOBIL) + '</dd>';
        var tel = (isEmpty(result[i].ANSAT_ARB_TLF)) ? '' : '<dt>Telefon</dt><dd>' + isPhone(result[i].ANSAT_ARB_TLF) + '</dd>';
        var address = (isEmpty(result[i].ANSAT_ADRESSE)) ? '' : '<dt>Adresse</dt><dd>' + result[i].ANSAT_ADRESSE + '</dd>';
        var location = (isEmpty(result[i].LOKATION)) ? '' : '<dt>Lokation</dt><dd>' + result[i].LOKATION + '</dd>';
        var remarks = (isEmpty(result[i].BEMAERK)) ? '' : '<dt>Bem&aelig;rk&shy;ninger</dt><dd>' + result[i].BEMAERK + '</dd>';

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
        $output.append($li);

        var current = (recordsIndex === 0) ? (recordsIndex + 1) : recordsIndex;
        var currentMax = ($totalRecords < perPage || endRec > $totalRecords) ? $totalRecords : endRec;
        var suffix = ($totalRecords > 1) ? 'resultater.' : 'resultat.';

        $feedback.html('Viser ' + current + ' til ' + currentMax + ' ud af ' + $totalRecords + ' ' + suffix);
      }
    }

    apply_pagination = function() {
      // Pager plugin settings
      var visible_pages = (window.matchMedia('(max-width: 768px)').matches) === true ? 3 : 5;
      $pager.twbsPagination({
        totalPages: totalPages,
        visiblePages: visible_pages,
        hideOnlyOnePage: true,
        first: 'Første',
        prev: 'forrige',
        next: 'Næste',
        last: 'Sidste',
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
      // Check if number starts with '+'
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
      return (value == null || value.length === 0);
    }
  });
})(jQuery);

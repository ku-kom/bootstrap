(function($) {
  var $form = $('#phoneform'),
    $output = $('#emp'),
    $input = $('#soge'),
    $feedback = $('#feedback'),
    $loading = $feedback.next($('.ku-loading')),
    lang = $('#lang').val() || 'da',
    $totalRecords = 0,
    $pagination = $('#pagination'),
    displayRecords = [],
    employees = [],
    recPerPage = 10,
    page = 1,
    totalPages = 0;

  // Make a click on the "søg" link submit the form
  $('#go-find').on("click", function(e) {
    e.preventDefault();
    $feedback.html('');
    $output.html('');
    if (!$.trim($input.val()).length) {
      $input.focus();
      $feedback.append('<div class="alert alert-danger" role="alert" aria-atomic="true">Enter search term<div>');
    } else {
      $form.trigger('submit');
    }
  });

  // Reset
  $('#reset').on("click", function(e) {
    $input.focus();
    $feedback.html('');
    $output.html('');
    $pagination.twbsPagination('destroy');
  });

  // Handle submit of search form
  $form.on("submit", function(e) {
    e.preventDefault();
    $.ajax({
        url: '/system/telefonbog-service.mason',
        data: 'format=json&startrecord=0&recordsperpage=100&searchstring=' + encodeURIComponent($input.val()),
        method: 'post',
        jsonp: false, // Set to false for security reasons
        dataType: 'json',
      }).done(function(data) {
        console.log(data);
        employees = (data.root || {}).employees || [];
        if (employees.length > 0) {
          $totalRecords = employees.length;
          totalPages = Math.ceil($totalRecords / recPerPage);
          $pagination.twbsPagination('destroy');
          apply_pagination();
        } else {
          $feedback.append('<div class="alert alert-warning" role="alert" aria-atomic="true">No results.<div>');
        }
      })
      .fail(function(xhr, textStatus, errorThrown) {
        console.log(xhr);
        console.log(xhr.responseText);
        console.log(textStatus);
        console.log(errorThrown);
      });


    function generate_table() {
      var li;
      $feedback.html('');
      $output.html('');
      $loading.hide();
      for (var i = 0; i < displayRecords.length; i++) {
        // If English nodes are empty, use Danish ones
        var title = (isEmpty(displayRecords[i].ANSAT_UOFF_STIL_TEKST_ENGELSK) === true) ? displayRecords[i].ANSAT_UOFF_STIL_TEKST : displayRecords[i].ANSAT_UOFF_STIL_TEKST_ENGELSK;
        var functions = (isEmpty(displayRecords[i].ANSAT_FUNKTION_ENGELSK) === true) ? displayRecords[i].ANSAT_FUNKTION : displayRecords[i].ANSAT_FUNKTION_ENGELSK;
        var place = (isEmpty(displayRecords[i].STED_NAVN_SAMLET_ENG) === true) ? displayRecords[i].STED_NAVN_SAMLET : displayRecords[i].STED_NAVN_SAMLET_ENG;
        li = $('<li class="media"/>');
        var html = '<div class="media-body"><dl class="dl-horizontal">' +
          '<dt>Name</dt><dd><div class="ku-navn">' + displayRecords[i].PERSON_FORNAVN + ' ' + displayRecords[i].PERSON_EFTERNAVN + '</div></dd>' +
          '<dt>Title</dt><dd>' + title + '</dd>' +
          '<dt>Function</dt><dd>' + functions + '</dd>' +
          '<dt>E-mail</dt><dd>' + isEmail(displayRecords[i].ANSAT_ARB_EMAIL) + '</dd>' +
          '<dt>Mobile phone</dt><dd>' + isPhone(displayRecords[i].ANSAT_MOBIL) + '</dd>' +
          '<dt>Phone</dt><dd>' + isPhone(displayRecords[i].ANSAT_ARB_TLF) + '</dd>' +
          '<dt>Secretary</dt><dd>' + isPhone(displayRecords[i].ANSAT_TLF_SEKR) + '</dd>' +
          '<dt>Unit/department</dt><dd>' + place + '</dd>' +
          '<dt>Address</dt><dd>' + displayRecords[i].ANSAT_ADRESSE + '</dd>' +
          '<dt>Location</dt><dd>' + displayRecords[i].LOKATION + '</dd>' +
          '<dt>Website</dt><dd>' + isUrl(displayRecords[i].ANSAT_WWW) + '</dd>' +
          '</dl></div>' +
          '<div class="media-right"><img class="media-object" src="' + displayRecords[i].FOTOURL + '" alt="' + displayRecords[i].PERSON_FORNAVN + ' ' + displayRecords[i].PERSON_EFTERNAVN + '"></div>';
        li.append(html);
        $output.append(li);
        var current = (displayRecordsIndex === 0) ? (displayRecordsIndex + 1) : displayRecordsIndex;
        var currentMax = ($totalRecords < recPerPage === true) ? $totalRecords : endRec;
        $feedback.html('Showing ' + current + ' to ' + currentMax + ' out of ' + $totalRecords + ' results.');
      }
    }

    function apply_pagination() {
      $loading.show();
      $pagination.twbsPagination({
        totalPages: totalPages,
        visiblePages: 5,
        hideOnlyOnePage: true,
        onPageClick: function(event, page) {
          displayRecordsIndex = Math.max(page - 1, 0) * recPerPage;
          endRec = (displayRecordsIndex) + recPerPage;
          //console.log(displayRecordsIndex + ' til ' + endRec);
          displayRecords = employees.slice(displayRecordsIndex, endRec);
          generate_table();
        }
      });
    }

    function isEmail(mail) {
      var re = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
      if (re.test(mail) === true) {
        return '<a class="ku-mail" href="mailto:' + mail + '">' + mail + '</a>';
      } else {
        return mail;
      }
    }

    function isUrl(url) {
      var re = /(https?:\/\/[^\s]+)/g;
      if (re.test(url) === true) {
        return '<a href="' + url + '">' + url + '</a>';
      } else {
        return url;
      }
    }

    function isPhone(no) {
      var re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
      if (re.test(no) === true) {
        no = no.replace(/-/g, "");
        return '<a href="tel:' + no + '">' + no + '</a>';
      } else {
        return no;
      }
    }

    function isEmpty(value) {
      return (value == null || value.length === 0);
    }
  });
})(jQuery);

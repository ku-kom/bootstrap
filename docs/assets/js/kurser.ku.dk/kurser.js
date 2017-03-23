// Custom scripts for kurser.ku.dk
$(document).ready(function() {
  $cachedWidth = $('body').prop('clientWidth');
  $search = $('#searchall');
  $advanced = $('#showall');
  $hiddenColumn = $('.mobile-hidden');

  resetText();
  multipleSelectBox();
  runDatatable();

  $advanced.click(function() {
    if ($cachedWidth < 768) {
      $(this).toggleClass('open');
      $hiddenColumn.slideToggle();
    }
  });

  $(window).resize(function() {
    var $newWidth = $('body').prop('clientWidth');
    if ($newWidth !== $cachedWidth) {
      $hiddenColumn.removeAttr('style');
      $advanced.removeClass('open');
      resetText();
      $cachedWidth = $newWidth;
    }
    $cachedWidth = $newWidth;
  });
});

// Function to change text for small screens (DA/ENG)
function resetText() {
  var $lang = $('html').attr('lang');
  $('.form-group .btn').each(function() {
    if ($cachedWidth < 768 && $lang == 'da') {
      $search.html('Søg');
    } else {
      $(this).html($(this).data($lang));
    }
  });
}

function runDatatable() {
  // Datatable language switcher
  function getLanguage() {
    var $langMap = {
      en: 'English',
      da: 'Danish'
    };
    var $lang = $('html').attr('lang');
    return '//cdn.datatables.net/plug-ins/1.10.13/i18n/' + $langMap[$lang] + '.json';
  }

  // Run Datatables
  $('#searchresults').DataTable({
    language: {
      url: getLanguage()
    },
    ordering: true,
    autoWidth: false,
    bFilter: false,
    fixedHeader: true,
    responsive: true
  });
}

function multipleSelectBox() {
  // Multiple select language switcher
  var multipleSelectLang = function() {
    var da = {
      placeholder: 'V&aelig;lg flere...',
      selectAllText: 'V&aelig;lg alle',
      allSelected: 'Alle valgt',
      countSelected: '# af % valgt',
      width: '100%'
    };
    var en = {
      placeholder: 'Select multiple...',
      width: '100%'
    };
    // Run Multiple select
    return ($('html').attr('lang') == 'da') ? da : en;
  };
  $('select[multiple]').multipleSelect(multipleSelectLang());
}

// Custom scripts for kurser.ku.dk
$(document).ready(function () {
  var $cachedWidth = $('body').prop('clientWidth');
  var $search = $('#searchall');
  var $searchText = $search.text();
  var $hiddenColumn = $('.mobile-hidden');

  // Function to change text for small screens
  var resetText = function () {
    if ($cachedWidth < 768) {
      $search.text('Søg');
    } else {
      $search.text($searchText);
    }
  };

  resetText();


  $('#showall').click(function () {
    if ($cachedWidth < 768) {
      $(this).toggleClass('open');
      $hiddenColumn.slideToggle();
    }
  });


  $(window).resize(function () {
    var $newWidth = $('body').prop('clientWidth');
    if ($newWidth !== $cachedWidth) {
      $hiddenColumn.removeAttr('style');
      resetText();
      $cachedWidth = $newWidth;
    }
    $cachedWidth = $newWidth;
  });

  // Multiple select language switcher
  var multipleSelectLang = function () {
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

  // Datatable language switcher
  function getLanguage() {
    var langMap = {
      en: 'English',
      da: 'Danish'
    };
    var lang = $('html').attr('lang');
    return '//cdn.datatables.net/plug-ins/1.10.13/i18n/' + langMap[lang] + '.json';
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
});

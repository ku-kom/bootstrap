// Custom scripts for kurser.ku.dk
$(document).ready(function() {
  var $cachedWidth = $('body').prop('clientWidth');
  var $search = $('#searchall');
  var $searchText = $search.text();

// Function to change text for small screens
  var resetText = function() {
    if ($cachedWidth < 768) {
      $search.text('Søg');
    } else {
      $search.text($searchText);
    }
  };

  resetText();

  if ($cachedWidth < 768) {
    $('#showall').click(function() {
      $(this).toggleClass("open");
      $('.mobile-hidden').slideToggle();
    });
  }

  $(window).resize(function() {
    var $newWidth = $('body').prop('clientWidth');
    if ($newWidth !== $cachedWidth) {
      resetText();
      $cachedWidth = $newWidth;
    }
    $cachedWidth = $newWidth;
  });
  // Multiple select functions
  $('select[multiple]').multipleSelect({
    placeholder: "V&aelig;lg flere...",
    selectAllText: 'V&aelig;lg alle',
    allSelected: 'Alle valgt',
    countSelected: '# af % valgt',
    width: '100%'
  });
  // Datatable
  $('#searchresults').DataTable({
    "language": {
      "sProcessing": "Henter...",
      "sLengthMenu": "Vis _MENU_ r&aelig;kker",
      "sZeroRecords": "Ingen r&aelig;kker matcher s&oslash;gningen",
      "sInfo": "Viser _START_ til _END_ af _TOTAL_ r&aelig;kker",
      "sInfoEmpty": "Viser 0 til 0 af 0 r&aelig;kker",
      "sInfoFiltered": "(filtreret fra _MAX_ r&aelig;kker)",
      "sInfoPostFix": "",
      "sSearch": "S&oslash;g:",
      "sUrl": "",
      "oPaginate": {
        "sFirst": "F&oslash;rste",
        "sPrevious": "Forrige",
        "sNext": "N&aelig;ste",
        "sLast": "Sidste"
      }
    },
    'ordering': true,
    "autoWidth": false,
    "bFilter": false,
    fixedHeader: true,
    responsive: true
  });
});

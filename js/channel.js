$('document').ready(function() {
  var id = getParameterByName('id');
  var guide = new Guide();
  var channels = guide.setChannels();
  var channel = guide.channels[id];
  var programs = guide.getPrograms(id);
  $('h1').text(channel.name);

  $.each(programs[id], function(index, program) {
    var current = '';
    var startDate = new Date(program.datum_start);
    var endDate = new Date(program.datum_end);
    var currentDate = new Date();

    var startHours = (startDate.getHours() < 10 ? '0' : '') + startDate.getHours();
    var startMinutes = (startDate.getMinutes() < 10 ? '0' : '') + startDate.getMinutes();
    var endHours = (endDate.getHours() < 10 ? '0' : '') + endDate.getHours();
    var endMinutes = (endDate.getMinutes() < 10 ? '0' : '') + endDate.getMinutes();

    if (currentDate > startDate && currentDate < endDate) {
      current = 'current';
    }
    var row = (current == 'current') ? '<tr class="' + current + '">' : '<tr>';
    row += '<td class="program">' + program.titel + '</td>';
    row += '<td class="from">' + startHours + ':' + startMinutes + '</td>';
    row += '<td class="to">' + endHours + ':' + endMinutes + '</td>';
    row += '</tr>';

    $('table').append(row);
  });

  $('html, body').animate({
    scrollTop: $('.current').offset().top
  }, 1000);
});


function getParameterByName(name) {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function Guide() {
  this.baseURL = 'http://www.tvgids.nl/json/lists/';
  this.channelsPath = 'channels.php';
  this.channels = [];
}

Guide.prototype = {
  constructor: Guide,


  setChannels: function () {
    url = this.baseURL + this.channelsPath;
    var channels = $.parseJSON(
      jQuery.ajax({
        url: url,
        async: false,
        dataType: 'json'
      }).responseText
    );

    var sort = []
    $.each(channels, function(index, channel) {
      var id = channel.id;
      sort[id] = channel;
    });

    this.channels = sort;
  },

  setPrograms: function () {
    this.setChannels();
    $.each(this.channels, function (index, channel) {
      if (typeof channel != 'undefined') {
        var channelId = channel.id;
        var url = 'http://www.tvgids.nl/json/lists/programs.php?channels=' + channel.id + '&day=0';
        var test = $.parseJSON(
          jQuery.ajax({
            url: url,
            async: false,
            dataType: 'json'
          }).responseText
        );

        this.programs = test[channelId];
      }
    });
  },

  getPrograms: function(channelId) {
    var url = 'http://www.tvgids.nl/json/lists/programs.php?channels=' + channelId + '&day=0';
    var channel = $.parseJSON(
      jQuery.ajax({
        url: url,
        async: false,
        dataType: 'json'
      }).responseText
    );

    return channel;
  },

  getChannels: function () {
    this.setChannels();
    return this.channels;
  },

  getNext: function () {
    var channels = this.channels;
    var defaultSettings = [1, 2, 3, 4, 31, 34, 36, 37, 46, 92, 460];

    chrome.storage.sync.get({channels: defaultSettings}, function (items) {
      console.log(items.channels);
      $.each(items.channels, function(index, item) {
        var channel = channels[item];
        var currentDate = new Date();

        $.each(channel.programs, function (index, program) {

          var startDateCurrent = new Date(program.datum_start);
          var endDateCurrent = new Date(program.datum_end);

          if (currentDate > startDateCurrent && currentDate < endDateCurrent) {
            if ('titel' in program) {
              currentProgram = program;

              if (typeof channel.programs[index + 1] != 'undefined') {
                nextProgram = channel.programs[index + 1];
              }
              else {
                nextProgram.titel = 'ONBEKEND';
              }

              var startDateNext = new Date(nextProgram.datum_start);
              var endDateNext= new Date(nextProgram.datum_end);

              var startMinutesCurrent = (startDateCurrent.getMinutes() < 10 ? '0' : '') + startDateCurrent.getMinutes();
              var endMinutesCurrent = (endDateCurrent.getMinutes() < 10 ? '0' : '') + endDateCurrent.getMinutes();

              var startMinutesNext = (startDateNext.getMinutes() < 10 ? '0' : '') + startDateNext.getMinutes();
              var endMinutesNext = (endDateNext.getMinutes() < 10 ? '0' : '') + endDateNext.getMinutes();

              var output = '<li>';
              output += '<h2><a href="../channel.html?id=' + channel.id + '">' + channel.name + '</a></h2>';

              output += '<div class="current-program">';
              output += '<div><span>Nu:</span> <br />' + currentProgram.titel + '</div>';
              output += '<div>';
              output += startDateCurrent.getHours() + ':' + startMinutesCurrent;
              output += ' -  ';
              output += endDateCurrent.getHours() + ':' + endMinutesCurrent;
              output += '</div>';
              output += '</div>';


              output += '<div class="next-program">';
              output += '<div><span>Straks:</span> <br />' + nextProgram.titel + '</div>';
              output += '<div>';
              output += startDateNext.getHours() + ':' + startMinutesNext;
              output += ' -  ';
              output += endDateNext.getHours() + ':' + endMinutesNext;
              output += '</div>';
              output += '</div>';
              output += '</li>';

              $('.jcarousel ul').append(output);
            }
            return false;
          }
        });
      });
    });
  }
};

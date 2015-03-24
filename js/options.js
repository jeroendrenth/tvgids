$('document').ready(function () {
  var guide = new Guide();
  var channels = guide.getChannels();
  channels.forEach(function(channel) {
    var container = $('<div class="checkbox"></div>');

    var channelId = channel.id;
    var checkbox = '<input name="channel" type="checkbox" value="' + channelId + '" />';
    var label = '<label>' + channel.name + '</label>';

    $(container).append(checkbox + label);
    $('#channels').append(container);
  });

  // Check channels from settings.
  var defaultSettings = [1, 2, 3, 4, 31, 34, 36, 37, 46, 92, 460];
  chrome.storage.sync.get({channels: defaultSettings}, function(items) {
    console.log(items);
    $.each(items.channels, function(index, item) {
      $('input[value="' + item  +'"]').prop('checked', true);
    });
  });

  $('#save').on('click', function() {
    save_options();
  });
});

// Saves options to chrome.storage
function save_options() {
  var checked = $(':checkbox:checked');
  console.log(checked);
  var channels = [];
  $.each(checked, function(index, check) {
    channels.push($(check).val());
  });

  chrome.storage.sync.set({channels: channels}, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Opti3ons saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

/* Media Player controls using HTML5's Media API
 * Modified for Bootstrap by Nanna Ellegaard 2019
 <div class="control-layer">
    <div class="media-controls">
      <div class="progress">
        <div class="progress-bar" role="progressbar" id="progress-bar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span class="sr-only">0%</span></div>
      </div>
      <button type="button" id="play-pause-button" class="play" title="Start" aria-label="Start" onclick="togglePlayPause();"><span class="glyphicon glyphicon-play" aria-hidden="true"></button>
      <button type="button" id="stop-button" class="stop" title="Stop" aria-label="Stop" onclick="stopPlayer();"><span class="glyphicon glyphicon-stop" aria-hidden="true"></span></button>
      <button type="button" id="" class="play" title="Start" aria-label="Tilbage" onclick="jumpSecs('-', 10);"><span class="glyphicon glyphicon-fast-backward" aria-hidden="true"></span></button>
      <button type="button" id="replay-button" class="replay" title="Replay" aria-label="Replay" onclick="replayMedia();"><span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></button>
      <input id="vol-control" type="range" min="0" max="100" step="1" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0.5" oninput="setVolume(this.value)" onchange="setVolume(this.value)" title="Volume: 50%" class="volume" aria-label="Volume">
      <button type="button" id="mute-button" class="mute" title="Unmute" aria-label="Slå lyd til/fra" onclick="toggleMute();"><span class="glyphicon glyphicon-volume-up" aria-hidden="true"></span></button>
      <button type="button" id="subtitle-button" class="fullscreen" title="Undertekster" aria-label="Undertekster" onclick="handleFullscreen();"><span class="glyphicon glyphicon-font" aria-hidden="true"></button>
      <button type="button" id="fullscreen-button" class="fullscreen" title="Fuld skærm" aria-label="Fuld skærm" onclick="handleFullscreen();"><span class="glyphicon glyphicon-fullscreen" aria-hidden="true"></button>
    </div>
  </div>
</div>
 */

var lang,
  video,
  videoContainer,
  playPauseBtn,
  muteBtn,
  volumeBtn,
  setVolume,
  hasAudio,
  toggleMute,
  progressBar,
  fullScreen,
  updateProgressBar,
  changeButtonType,
  canPlayVideo,
  resetPlayer,
  upperCaseFirst;

var initialisevideo = function () {
  // Page Language
  lang = document.documentElement.lang ? document.documentElement.lang : 'en';
  // Get player id
  video = document.getElementById('video');

  // If no video element exists, break out of the script right away
  if (!video) {
    return;
  }

  // Get handles to each of the buttons and other elements
  playPauseBtn = document.getElementById('play-pause-button');
  muteBtn = document.getElementById('mute-button');
  volumeBtn = document.getElementById('vol-control');
  //subtitles = document.getElementById('subtitle-button');
  progressBar = document.getElementById('progress-bar');
  fullScreen = document.getElementById('fullscreen-button');
  videoContainer = document.getElementById('videocontainer');

  // Hide the browser's default controls
  video.controls = false;

  // Add a listener for the timeupdate event so we can update the progress bar
  if (progressBar) {
    video.addEventListener('timeupdate', updateProgressBar, false);

    // Pause the video when the slider handle is being dragged
    progressBar.addEventListener("mousedown", function () {
      video.pause();
    });

    // Play the video when the slider handle is dropped
    progressBar.addEventListener("mouseup", function () {
      video.play();
    });

    // Event listener for the seek bar
    progressBar.addEventListener("change", function () {
      // Calculate the new time
      var time = video.duration * (progressBar.value / 100);

      // Update the video time
      video.currentTime = time;
    });

    // Add a listener for the play and pause events so the buttons state can be updated
    video.addEventListener('play', function () {
      // Change the button to be a pause button
      changeButtonType(playPauseBtn, 'pause');
    }, false);
  }

  if (volumeBtn) {
    volumeBtn.addEventListener("change", function () {
      setVolume();
    });
  }

  if (playPauseBtn) {
    video.addEventListener('pause', function () {
      // If paused, change the button to be a play button
      changeButtonType(playPauseBtn, 'play');
    }, false);
  }

  video.addEventListener('ended', function () {
    this.pause();
  }, false);
};

var togglePlayPause = function () {
  // If the video is currently paused or has ended
  if (video.paused || video.ended) {
    // Change the button to be a pause button
    changeButtonType(playPauseBtn, 'pause');
    // Play the media
    video.play();
  }
  // Otherwise it must currently be playing
  else {
    // Change the button to be a play button
    changeButtonType(playPauseBtn, 'play');
    // Pause the media
    video.pause();
  }
};

// Stop the current media from playing, and return it to the start position
var stopPlayer = function () {
  video.pause();
  video.currentTime = 0;
  progressBar.value = 0;
};

// Changes the volume on the media player using a slider
var setVolume = function (v) {
  video.muted = false;
  toggleMute();
  video.volume = volumeBtn.value;
  var vol = volumeBtn.value;

  var percent = parseInt((vol - volumeBtn.getAttribute('min')) / (volumeBtn.getAttribute('max') - volumeBtn.getAttribute('min')) * 100, 10);
  var style = 'background: linear-gradient(to right, #fff ' + percent + '%, #777 0%)';
  // Update volume bar styling
  volumeBtn.setAttribute('style', style);
  volumeBtn.setAttribute("aria-valuenow", percent);
};

// Toggles the media player's mute and unmute status
var toggleMute = function () {
  if (video.muted) {
    // Change the cutton to be a mute button
    changeButtonType(muteBtn, 'volume-up');
    muteBtn.title = 'Unmute';
    // Unmute the media player
    video.muted = false;
  } else {
    // Change the button to be an unmute button
    changeButtonType(muteBtn, 'volume-off');
    muteBtn.title = 'Mute';
    // Mute the media player
    video.muted = true;
  }
};

// Replays the media currently loaded in the player
var replayMedia = function () {
  resetPlayer();
  video.play();
};

// Parse and format total video duration
var getDuration = function (duration) {
  if (video.duration) {
    var minutes = parseInt(video.duration / 60, 10);
    var seconds = Math.round(video.duration % 60);
    return minutes + ':' + seconds;
  }
}

// Parse and format current time
var getCurrentTime = function (current) {
  if (typeof video.currentTime !== "undefined") {
    var minutes = parseInt(video.currentTime / 60, 10);
    var seconds = Math.round(video.currentTime % 60);
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    return minutes + ':' + seconds;
  } else {
    return '0:00';
  }
}

// Jumps backwards or forwards any number of seconds
var jumpSecs = function (dir, sec) {
  // run as jumpSecs('+', 10)
  var seekToTime;
  if (dir == '-') {
    // Backwards
    seekToTime = video.currentTime - sec;
  } else {
    // Else forwards
    seekToTime = video.currentTime + sec;
  }
  if (seekToTime < 0 || seekToTime > video.duration) {
    return;
  }
  video.currentTime = seekToTime;
};

// Update the progress bar
var updateProgressBar = function () {
  var val = progressBar.value;
  var buffer = ((100 - val) / 4) + parseInt(val, 10);
  // Currently played
  var percentage = Math.floor((100 / video.duration) * video.currentTime);
  var style =
    'background: -moz-linear-gradient(left, #901a1e 0%, #901a1e ' + val + '%, #777 ' + val + '%, #777 ' + buffer + '%, #444 ' + buffer + '%, #444 100%);' +
    'background: -webkit-linear-gradient(left, #901a1e 0%, #901a1e ' + val + '%, #777 ' + val + '%, #777 ' + buffer + '%, #444 ' + buffer + '%, #444 100%);' +
    'background: linear-gradient(to right, #901a1e 0%, #901a1e ' + val + '%, #777 ' + val + '%, #777 ' + buffer + '%, #444 ' + buffer + '%, #444 100%);';
  // Update progress bar styling
  progressBar.setAttribute('style', style);

  // Update the progress bar with current values
  progressBar.setAttribute('value', percentage);
  progressBar.setAttribute("aria-valuenow", percentage);
  var track = document.querySelector('.progress-track');
  track.innerHTML = getCurrentTime() + ' / ' + getDuration();
};

// Updates a button's title, innerHTML and CSS class to a certain value
var changeButtonType = function (btn, value) {
  btn.title = upperCaseFirst(value);
  btn.className = value;
  btn.setAttribute("aria-label", upperCaseFirst(value));
  // All available glyphicons
  var span = btn.querySelector('.glyphicon');
  // remove glyphicons before adding new
  Array.prototype.slice.call(span.classList).forEach(function (className) {
    if (className.startsWith('glyphicon-')) {
      span.classList.remove(className);
    }
  });
  span.classList.add("glyphicon-" + value);
};

// Loads a video item into the media player
var loadVideo = function () {
  for (var i = 0; i < arguments.length; i++) {
    var file = arguments[i].split('.');
    var ext = file[file.length - 1];
    // Check if this media can be played
    if (canPlayVideo(ext)) {
      // Reset the player, change the source file and load it
      resetPlayer();
      video.src = arguments[i];
      video.load();
      break;
    }
  }
};

// Checks if the browser can play this particular type of file or not
var canPlayVideo = function (ext) {
  var ableToPlay = video.canPlayType('video/' + ext);
  if (ableToPlay == '') {
    //Eempty string: The specified media type definitely cannot be played.
    return false;
  } else {
    return true;
  }
};

// Resets the media player
var resetPlayer = function () {
  // Reset the progress bar to 0
  progressBar.value = 0;
  // Move the media back to the start
  video.currentTime = 0;
  // Check if button is play or pause
  togglePlayPause();
};

// Fullscreen for various browsers
var handleFullscreen = function () {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    video.mozRequestFullScreen();
  } else if (video.webkitEnterFullscreen) {
    video.webkitEnterFullscreen(); // Old IPad, iPhone?
  } else if (video.webkitRequestFullScreen) {
    video.webkitRequestFullScreen();
  } else if (video.msRequestFullscreen) {
    video.msRequestFullscreen();
  }
};

// Make attributes values first letter uppercase because it looks nice
var upperCaseFirst = function (str) {
  return str.charAt(0).toUpperCase() + str.substring(1);
};

// Initialize the player when the DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  'use strict';
  // Polyfill for IE11:
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
    };
  }
  // Does the browser actually support the video element?
  var supportsVideo = !!document.createElement('video').canPlayType;
  if (supportsVideo) {
    initialisevideo();
  }
  var link = document.querySelector('.toplogo>a');
  link.onblur = function() {
    playPauseBtn.focus();
  };
}, false);

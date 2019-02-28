// Sample Media Player using HTML5's Media API
//
// https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player
// Modified for Bootstrap by Nanna Ellegaard 2019
//

// Variables to store handles to various required elements
var video,
  playPauseBtn,
  muteBtn,
  progressBar,
  fullScreen;

function initialisevideo() {
  // Get a handle to the player
  video = document.getElementById('video');

  // Get handles to each of the buttons and required elements
  playPauseBtn = document.getElementById('play-pause-button');
  muteBtn = document.getElementById('mute-button');
  progressBar = document.getElementById('progress-bar');
  fullScreen = document.getElementById('fullscreen-button');

  // Hide the browser's default controls
  video.controls = false;

  // Add a listener for the timeupdate event so we can update the progress bar
  video.addEventListener('timeupdate', updateProgressBar, false);

  // Add a listener for the play and pause events so the buttons state can be updated
  video.addEventListener('play', function () {
    // Change the button to be a pause button
    changeButtonType(playPauseBtn, 'pause');
  }, false);

  video.addEventListener('pause', function () {
    // Change the button to be a play button
    changeButtonType(playPauseBtn, 'play');
  }, false);

  // need to work on this one more...how to know it's muted?
  video.addEventListener('volumechange', function (e) {
    // Update the button to be mute/unmute
    if (video.muted) changeButtonType(muteBtn, 'volume-up');
    else changeButtonType(muteBtn, 'volume-off');
  }, false);

  video.addEventListener('ended', function () {
    this.pause();
  }, false);
}

function togglePlayPause() {
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
}

// Stop the current media from playing, and return it to the start position

function stopPlayer() {
  video.pause();
  video.currentTime = 0;
}

// Changes the volume on the media player

function changeVolume(direction) {
  if (direction === '+') video.volume += video.volume == 1 ? 0 : 0.1;
  else video.volume -= (video.volume == 0 ? 0 : 0.1);
  video.volume = parseFloat(video.volume).toFixed(1);
}

// Toggles the media player's mute and unmute status

function toggleMute() {
  if (video.muted) {
    // Change the cutton to be a mute button
    changeButtonType(muteBtn, 'volume-off');
    // Unmute the media player
    video.muted = false;
  } else {
    // Change the button to be an unmute button
    changeButtonType(muteBtn, 'volume-up');
    // Mute the media player
    video.muted = true;
  }
}

// Replays the media currently loaded in the player

function replayMedia() {
  resetPlayer();
  video.play();
}

// Update the progress bar

function updateProgressBar() {
  // Work out how much of the media has played via the duration and currentTime parameters
  var percentage = Math.floor((100 / video.duration) * video.currentTime);
  // Update the progress bar's values
  progressBar.value = percentage;
  progressBar.style.width = percentage + '%';
  progressBar.setAttribute("aria-valuenow", + percentage);
  progressBar.title = percentage + '%';
  var sronly = progressBar.querySelector('.sr-only');
  sronly.innerHTML = percentage + "% afspillet";
}

// Updates a button's title, innerHTML and CSS class to a certain value

function changeButtonType(btn, value) {
  btn.title = upperCaseFirst(value);
  btn.className = value;
  btn.setAttribute("aria-label", upperCaseFirst(value));
  // All available glyphicons
  var span = btn.querySelector('.glyphicon');
  span.classList.remove("glyphicon-volume-off", "glyphicon-volume-up", "glyphicon-play", "glyphicon-pause");
  span.classList.add("glyphicon-" + value);
}

// Loads a video item into the media player

function loadVideo() {
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
}

// Checks if the browser can play this particular type of file or not

function canPlayVideo(ext) {
  var ableToPlay = video.canPlayType('video/' + ext);
  if (ableToPlay == '') return false;
  else return true;
}

// Resets the media player

function resetPlayer() {
  // Reset the progress bar to 0
  progressBar.value = 0;
  // Move the media back to the start
  video.currentTime = 0;
  // Ensure that the play pause button is set as 'play'
  changeButtonType(playPauseBtn, 'play');
}

// Toggle full screen
var fullScreenEnabled = !!(document.fullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled || document.webkitSupportsFullscreen || document.webkitFullscreenEnabled || document.createElement('video').webkitRequestFullScreen);

if (!fullScreenEnabled) {
  fullScreen.disabled = true;
}

// checks if the browser is already in fullscreen mode
function isFullScreen() {
  return !!(document.fullScreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreenElement || document.fullscreenElement);
}

// sets the value of a data-fullscreen attribute on the videoContainer (this makes use of data-states).
function setFullscreenData(state) {
  video.setAttribute('data-fullscreen', !!state);
}

function handleFullscreen() {
  if (isFullScreen()) {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
    else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
    else if (document.msExitFullscreen) document.msExitFullscreen();
    setFullscreenData(false);
  } else {
    if (video.requestFullscreen) video.requestFullscreen();
    else if (video.mozRequestFullScreen) video.mozRequestFullScreen();
    else if (video.webkitRequestFullScreen) video.webkitRequestFullScreen();
    else if (video.msRequestFullscreen) video.msRequestFullscreen();
    setFullscreenData(true);
  }
}

function upperCaseFirst(str) {
  // Make attributes values first letter uppercase
    return str.charAt(0).toUpperCase() + str.substring(1);
}

// Wait for the DOM to be loaded before initialising the media player
document.addEventListener("DOMContentLoaded", function () {
  'use strict';
  initialisevideo();
}, false);

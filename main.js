const menu = document.querySelector('.menu');

function fitText() {
  var textElements = document.querySelectorAll(
    'h1, h2, h3, h4, h5, h6, p, li, a'
  );
  textElements.forEach(function (element) {
    var fontSize = element.offsetHeight;
    element.style.fontSize = fontSize + 'px';
  });
}

var sound = true;
function toggleSound() {
  var img = document.querySelector('.sound-img');
  sound = !sound;
  if (sound) {
    img.src = 'assets/icons/sound-off.svg';
  } else {
    img.src = 'assets/icons/sound-on.svg';
  }
}

var music = true;
function toggleMusic() {
  var img = document.querySelector('.music-img');
  music = !music;
  if (music) {
    img.src = 'assets/icons/music-off.svg';
  } else {
    img.src = 'assets/icons/music-on.svg';
  }
}

var fullscreen = false;
function toggleFullscreen() {
  var img = document.querySelector('.fullscreen-img');
  fullscreen = !fullscreen;
  if (fullscreen) {
    img.src = 'assets/icons/fullscreen-off.svg';
  } else {
    img.src = 'assets/icons/fullscreen-on.svg';
  }
}

function play() {
  menu.style.display = 'none';
}

window.addEventListener('resize', fitText);
window.addEventListener('DOMContentLoaded', fitText);

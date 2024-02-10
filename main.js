function fitText() {
  var textElements = document.querySelectorAll(
    'h1, h2, h3, h4, h5, h6, p, li, a'
  );
  textElements.forEach(function (element) {
    var fontSize = element.offsetHeight; // Adjust the multiplier as needed
    element.style.fontSize = fontSize + 'px';
  });
}

window.addEventListener('resize', fitText);

const container = document.querySelector('.container');
const menu = document.querySelector('.menu');
const players = document.querySelector('.players');
const leaderboard = document.querySelector('.leaders');
const game = document.querySelector('.game');
const gameover = document.querySelector('.gameover');
const lastNum = document.querySelector('.last-number');
const turn = document.querySelector('.turn');

class Player {
  constructor(name, size, num) {
    this.name = name;
    this.matrix = generateMatrix(size);
    this.checks = generateChecks(size);
    this.points = 0;
    this.grid = document.getElementById('player' + num.toString() + '-numbers');
  }

  renderMatrix() {
    let size = this.matrix.length;

    this.grid.style.gridTemplateColumns =
      'repeat(' + size.toString() + ', 1fr)';
    this.grid.style.gridTemplateRows = this.grid.style.gridTemplateColumns;

    this.matrix.forEach((row) => {
      row.forEach((num) => {
        let div = document.createElement('div');
        div.className = 'number-container';
        let p = document.createElement('p');
        p.style.margin = '0';
        if (num.toString() === '0') {
          p.textContent = 'NA';
          p.style.color = '#dc9eff';
        } else {
          p.textContent = num.toString();
        }
        div.appendChild(p);
        this.grid.appendChild(div);
      });
    });
  }

  firstDiagonal() {
    let size = this.checks.length;
    for (let i = 0; i < size; i++) {
      if (this.checks[i][i] === 1) {
        return false;
      }
    }
    return true;
  }

  secondDiagonal() {
    let size = this.checks.length;
    for (let i = size - 1; i >= size; i--) {
      if (this.checks[i][i] === 1) {
        return false;
      }
    }
    return true;
  }

  diagonals() {
    let n = 0;
    if (this.firstDiagonal()) {
      n += 3;
    }
    if (this.secondDiagonal()) {
      n += 3;
    }
    return n;
  }

  rows() {
    const n = this.checks.length;
    let count = 0;
    for (let i = 0; i < n; i++) {
      const row = this.checks[i];
      if (row.every((value) => value === 1)) {
        count++;
      }
    }
    return count;
  }

  columns() {
    const n = this.checks.length;
    let count = 0;
    for (let j = 0; j < n; j++) {
      let allOnes = true;
      for (let i = 0; i < n; i++) {
        if (this.checks[i][j] !== 1) {
          allOnes = false;
          break;
        }
      }
      if (allOnes) {
        count++;
      }
    }
    return count;
  }

  renderCheck(num) {
    let gridElements = this.grid.querySelectorAll('p');

    gridElements.forEach(function (element) {
      if (element.textContent === num.toString()) {
        element.style.color = '#dc9eff';
      }
    });
  }

  check(num) {
    let size = this.matrix.length;
    let found = false;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (num === this.matrix[i][j]) {
          this.checks[i][j] = 1;
          this.renderCheck(num);
          found = true;
          break;
        }
      }

      if (found) {
        let rows = this.rows();

        if (rows === this.matrix.length) {
          let winnerArr = [];
          winnerArr.push(this.name);
          end(winnerArr);
        }

        let columns = this.columns();
        let diagonals = this.diagonals();

        this.points = rows + columns + diagonals * 3;
        break;
      }
    }
  }
}

class GameInfo {
  constructor(turns, size) {
    this.players = [];
    this.turns = turns;
    this.turn = 0;
    this.lastNum = 0;
    this.size = size;
    this.numbers = new Set();
    this.numbers.add(0);
  }

  addPlayer(name) {
    let num = this.players.length + 1;
    let player = new Player(name, this.size, num);
    this.players.push(player);
  }

  mvps() {
    let maxPoints = this.players[0].points;
    let mvps = [this.players[0]];

    for (let i = 1; i < this.players.length; i++) {
      if (this.players[i].points > maxPoints) {
        maxPoints = this.players[i].points;
        mvps = [this.players[i]];
      } else if (this.players[i].points === maxPoints) {
        mvps.push(this.players[i]);
      }
    }

    return mvps;
  }

  setSize(size) {
    this.size = size;
  }

  clear() {
    this.players.forEach(function (player) {
      while (player.grid.firstChild) {
        player.grid.removeChild(player.grid.firstChild);
      }
    });
    this.players = [];
    this.turn = 0;
    this.lastNum = 0;
    this.numbers = new Set();
    this.numbers.add(0);
  }

  call() {
    let number = 0;
    while (this.numbers.has(number)) {
      number = randomNumber(1, 50);
    }
    this.lastNum = number;
    this.numbers.add(number);
    this.players.forEach(function (player) {
      player.check(number);
    });
    this.turn++;
    if (this.turns === this.turn) {
      let mvps = this.mvps();
      if (mvps[0] === 0) {
        let winnerArr = ['Ninguno'];
        end(winnerArr);
      }
      end(mvps);
    }
  }
}

const gameInfo = new GameInfo(25, 5);

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateChecks(size) {
  const matrix = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => 0)
  );

  if (size % 2 !== 0) {
    const center = Math.floor(size / 2);
    matrix[center][center] = 1;
  }

  return matrix;
}

function generateMatrix(size) {
  const matrix = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => undefined)
  );

  const uniqueNums = new Set();
  while (uniqueNums.size < size * size) {
    const num = randomNumber(1, 50);
    uniqueNums.add(num);
  }
  const nums = Array.from(uniqueNums);

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      matrix[i][j] = nums.pop();
    }
  }

  if (size % 2 !== 0) {
    const center = Math.floor(size / 2);
    matrix[center][center] = 0;
  }

  return matrix;
}

function addNumbers() {
  var numbers = document.getElementById('numbers');
  for (let i = 1; i <= 50; i++) {
    var div = document.createElement('div');
    div.className = 'number';
    var p = document.createElement('p');
    p.id = i.toString();
    p.textContent = i;
    div.appendChild(p);
    numbers.appendChild(div);
  }
}

function generate() {
  gameInfo.call();
  let nums = document.querySelector('.numbers');
  nums.children[gameInfo.lastNum - 1].firstChild.style.color = '#dc9eff';
  lastNum.textContent = gameInfo.lastNum;
  turn.textContent = gameInfo.turn;
}

function getTop10() {
  let items = Object.keys(localStorage).map((key) => {
    let value = JSON.parse(localStorage.getItem(key));
    return { key, value };
  });

  items.sort((a, b) => b.value - a.value);

  let top10 = items.slice(0, 10);

  return top10;
}

function names() {
  menu.style.display = 'none';
  players.style.display = 'flex';
  let top10 = getTop10();
  let str = '';
  top10.forEach((player) => {
    str = player.key + ': ' + player.value;
    let h3 = document.createElement('h3');
    h3.style.marginLeft = '2rem';
    h3.textContent = str;
    document.getElementById('leaders').appendChild(h3);
  });
}

function play() {
  let letters = /^[a-zA-ZñáéíóúÑÁÉÍÓÚ]+$/;
  let inputs = document.querySelectorAll('input');
  let select = document.querySelector('select');
  let size = select.options[select.selectedIndex].value;
  let valid = true;
  let playerNum = 0;

  gameInfo.setSize(size);

  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    playerNum++;

    if (input.value.length < 2 || input.value.length > 16) {
      alert('El nombre debe tener entre 2 y 16 caracteres');
      valid = false;
      gameInfo.clear();
      break;
    }

    if (!letters.test(input.value)) {
      alert('El nombre solo puede tener letras');
      valid = false;
      gameInfo.clear();
      break;
    }

    gameInfo.addPlayer(input.value.toUpperCase());

    gameInfo.players[i].renderMatrix();

    document.getElementById(
      'player' + playerNum.toString() + '-name'
    ).textContent = input.value.toUpperCase();

    document.getElementById(
      'player' + playerNum.toString() + '-points'
    ).textContent = '0';
  }

  if (valid) {
    players.style.display = 'none';
    container.style.display = 'none';
    game.style.display = 'grid';
  }
}

function end(winners) {
  let winnerField = document.querySelector('.winner-name');
  if (winners[0] === 'Ninguno') {
    winnerField.textContent = winners[0];
  } else {
    let winnerNames = [];
    winners.forEach((winner) => {
      winnerNames.push(winner.name);
      if (winner.name in localStorage) {
        wins = Number(localStorage.getItem(winner.name));
        wins++;
        localStorage.setItem(winner.name, wins.toString());
      } else {
        localStorage.setItem(winner.name, '1');
      }
    });
    winnerField.textContent = winnerNames.join(', ');
  }
  game.style.display = 'none';
  container.style.display = 'flex';
  gameover.style.display = 'flex';
}

function reset() {
  gameInfo.clear();
  let leaders = document.getElementById('leaders');
  while (leaders.firstChild) {
    leaders.removeChild(leaders.firstChild);
  }
  for (let i = 1; i <= 50; i++) {
    document.getElementById(i.toString()).style.color = '#ffffff';
  }
  lastNum.textContent = gameInfo.lastNum;
  turn.textContent = gameInfo.turn;
  gameover.style.display = 'none';
  menu.style.display = 'flex';
}

window.addEventListener('DOMContentLoaded', addNumbers());
window.addEventListener('DOMContentLoaded', reset());

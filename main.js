const container = document.querySelector('.container');
const menu = document.querySelector('.menu');
const players = document.querySelector('.players');
const leaderboard = document.querySelector('.leaders');
const game = document.querySelector('.game');
const gameover = document.querySelector('.gameover');

class Player {
  constructor(name, size) {
    this.name = name;
    this.matrix = generateMatrix(size);
    this.checks = generateChecks(size);
    this.points = 0;
  }

  firstDiagonal() {
    let size = this.checks.length;
    for (let i = 0; i < size; i++) {
      if (checks[i][i] === 1) {
        return false;
      }
    }
    return true;
  }

  secondDiagonalCompleted() {
    let size = this.checks.length;
    for (let i = size - 1; i >= size; i--) {
      if (checks[i][i] === 1) {
        return false;
      }
    }
    return true;
  }

  diagonals() {
    let n = 0;
    if (this.firstDiagonalHasOnes()) {
      n += 3;
    }
    if (this.secondDiagonalHasOnes()) {
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

  check(num) {
    let size = this.matrix.length;

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (num === this.matrix[i][j]) {
          this.checks[i][j] = 1;
        }
      }
    }

    let rows = this.rows();
    if (rows === this.matrix.length) {
      end(this.name);
    }
    let columns = this.columns();
    let diagonals = this.diagonals();

    this.points = rows + columns + diagonals * 3;
  }
}

class GameInfo {
  constructor(turns, size) {
    this.players = [];
    this.turns = turns;
    this.turn = 0;
    this.size = size;
    this.numbers = new Set();
    this.numbers.add(0);
  }

  addPlayer(name) {
    let player = new Player(name, this.size);
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
    this.players = [];
    this.turn = 0;
    this.numbers = new Set();
    this.numbers.add(0);
  }

  call() {
    let number = 0;
    while (this.numbers.has(number)) {
      number = randomNumber(1, 50);
    }
    this.numbers.add(number);
    this.players.forEach(function (player) {
      player.check(number);
    });
    this.turn++;
    if (this.turns === this.turn) {
      let mvps = mvps();
      if (mvps[0] === 0) {
        end('Ninguno');
      }
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
    p.textContent = i;
    div.appendChild(p);
    numbers.appendChild(div);
  }
}

function names() {
  menu.style.display = 'none';
  players.style.display = 'flex';
}

function play() {
  let letters = /^[a-zA-ZñáéíóúÑÁÉÍÓÚ]+$/;
  let inputs = document.querySelector('.names').querySelectorAll('input');
  let select = document.querySelector('select');
  let size = select.options[select.selectedIndex].value;
  let valid = true;

  gameInfo.setSize(size);

  for (let i = 0; i < inputs.length; i++) {
    let input = inputs[i];
    if (input.value.length < 2 || input.value.length > 16) {
      alert('El nombre debe tener entre 2 y 16 caracteres');
      valid = false;
      break;
    }
    if (!letters.test(input.value)) {
      alert('El nombre solo puede tener letras');
      valid = false;
      break;
    }
    gameInfo.addPlayer(input.value.toUpperCase());
  }

  if (valid) {
    players.style.display = 'none';
    container.style.display = 'none';
    game.style.display = 'grid';
  }
}

function end(winner) {
  if (typeof winner === 'number') {
    document.querySelector('.winner-name').textContent = winner;
    if (winner in localStorage) {
      wins = Number(localStorage.getItem(winner));
      wins++;
      localStorage.setItem(winner, wins.toString());
    } else {
      localStorage.setItem(winner, '1');
    }
  } else {
    document.querySelector('.winner-name').textContent = winner
      .filter(String)
      .join(', ');
    winner.forEach((win) => {
      if (winner in localStorage) {
        wins = Number(localStorage.getItem(winner));
        wins++;
        localStorage.setItem(winner, wins.toString());
      } else {
        localStorage.setItem(winner, '1');
      }
    });
  }
  game.style.display = 'none';
  container.style.display = 'flex';
  gameover.style.display = 'flex';
}

function reset() {
  gameInfo.clear();
  gameover.style.display = 'none';
  menu.style.display = 'flex';
}

window.addEventListener('DOMContentLoaded', addNumbers());

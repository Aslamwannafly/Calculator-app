const input = document.getElementById('inputBox');
const buttons = document.querySelectorAll('.button');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyBox = document.getElementById('history');

let expression = "";
let history = [];
let justEvaluated = false;

function updateInput() {
  input.value = expression || "0";
  input.scrollLeft = input.scrollWidth; // Always show latest typed character
}

function addToHistory(entry) {
  history.unshift(entry);
  history = history.slice(0, 10); // Keep last 10
  renderHistory();
}

function renderHistory() {
  historyBox.innerHTML = "";
  const reversed = [...history].reverse(); // oldest to newest
  reversed.forEach((item, index) => {
    const p = document.createElement('p');
    p.textContent = `${index + 1}. ${item}`;
    historyBox.appendChild(p);
  });
}


function handleInput(value) {
  if (value === '=') {
    try {
      if (/^[0-9+\-*/.%() ]+$/.test(expression)) {
        const result = Function('"use strict";return (' + expression + ')')();
        addToHistory(`${expression} = ${result}`);
        expression = result.toString();
        justEvaluated = true;
      } else {
        expression = "Error";
        justEvaluated = true;
      }
    } catch {
      expression = "Error";
      justEvaluated = true;
    }
  } else if (value === 'AC') {
    expression = "";
    justEvaluated = false;
  } else if (value === 'DEL') {
    if (!justEvaluated) expression = expression.slice(0, -1);
    else {
      expression = "";
      justEvaluated = false;
    }
  } else {
    if (justEvaluated && /[0-9.]/.test(value)) {
      expression = value;
    } else if (justEvaluated && /[+\-*/%]/.test(value)) {
      expression += value;
    } else {
      expression += value;
    }
    justEvaluated = false;
  }

  updateInput();
}

buttons.forEach(btn => {
  btn.addEventListener('click', () => handleInput(btn.innerText));
});

clearHistoryBtn.addEventListener('click', () => {
  history = [];
  renderHistory();
});

// Keyboard support
document.addEventListener('keydown', e => {
  const key = e.key;

  if (/^[0-9+\-*/.%()]$/.test(key)) {
    handleInput(key);
  } else if (key === 'Enter') {
    handleInput('=');
  } else if (key === 'Backspace') {
    handleInput('DEL');
  } else if (key === 'Escape') {
    handleInput('AC');
  } else if (key === '=' && e.shiftKey === false) {
    handleInput('=');
  }
});

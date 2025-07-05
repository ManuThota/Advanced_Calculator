const numberButtons = document.querySelectorAll('.number');
const operationButtons = document.querySelectorAll('.operation');
const functionButtons = document.querySelectorAll('.function');
const equalsButton = document.querySelector('.equal');
const deleteButton = document.querySelector('.delete');
const clearButton = document.querySelector('.clear');
const prevDisplay = document.querySelector('.prev-display');
const currDisplay = document.querySelector('.curr-display');
const themeSwitch = document.getElementById('themeSwitch');

let currentOperand = '';
let previousOperand = '';
let operation = null;

function updateDisplay() {
  currDisplay.textContent = currentOperand;
  prevDisplay.textContent = operation ? `${previousOperand} ${operation}` : '';
}

function compute() {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return;

  let result;
  switch (operation) {
    case '+': result = prev + curr; break;
    case '-': result = prev - curr; break;
    case '*': result = prev * curr; break;
    case '/': result = curr === 0 ? 'Error' : prev / curr; break;
    default: return;
  }

  currentOperand = result.toString();
  operation = null;
  previousOperand = '';
}

function animateButton(btn) {
  btn.classList.add('active');
  setTimeout(() => btn.classList.remove('active'), 150);
}

numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    if (button.textContent === '.' && currentOperand.includes('.')) return;
    currentOperand += button.textContent;
    updateDisplay();
    animateButton(button);
  });
});

operationButtons.forEach(button => {
  button.addEventListener('click', () => {
    const op = button.textContent;

    // Case 1: currentOperand is empty, but previousOperand exists → just change operator
    if (currentOperand === '' && previousOperand !== '') {
      operation = op;
      updateDisplay();
      animateButton(button);
      return;
    }

    // Case 2: both are filled → compute first
    if (currentOperand !== '') {
      if (previousOperand !== '') {
        compute();
      }
      operation = op;
      previousOperand = currentOperand;
      currentOperand = '';
      updateDisplay();
      animateButton(button);
    }
  });
});


equalsButton.addEventListener('click', () => {
  if (currentOperand === '' || previousOperand === '' || !operation) return;
  compute();
  updateDisplay();
  animateButton(equalsButton);
});

clearButton.addEventListener('click', () => {
  currentOperand = '';
  previousOperand = '';
  operation = null;
  updateDisplay();
  animateButton(clearButton);
});

deleteButton.addEventListener('click', () => {
  currentOperand = currentOperand.slice(0, -1);
  updateDisplay();
  animateButton(deleteButton);
});

// Scientific Functions
functionButtons.forEach(button => {
  button.addEventListener('click', () => {
    const fn = button.dataset.fn;
    let value = parseFloat(currentOperand);
    if (isNaN(value)) return;

    switch (fn) {
      case 'sqrt': currentOperand = Math.sqrt(value).toString(); break;
      case 'square': currentOperand = (value * value).toString(); break;
      case 'sin': currentOperand = Math.sin(toRadians(value)).toFixed(5); break;
      case 'cos': currentOperand = Math.cos(toRadians(value)).toFixed(5); break;
      case 'tan': currentOperand = Math.tan(toRadians(value)).toFixed(5); break;
      case '%': currentOperand = (value / 100).toString(); break;
    }

    updateDisplay();
    animateButton(button);
  });
});

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

// Theme Toggle
themeSwitch.addEventListener('change', () => {
  document.body.classList.toggle('light');
});

// Keyboard Support
document.addEventListener('keydown', e => {
  const key = e.key;
  if (!isNaN(key) || key === '.') {
    currentOperand += key;
  } else if (['+', '-', '*', '/'].includes(key)) {
    if (currentOperand === '') return;
    if (previousOperand !== '') compute();
    operation = key;
    previousOperand = currentOperand;
    currentOperand = '';
  } else if (key === 'Enter' || key === '=') {
    compute();
  } else if (key === 'Backspace') {
    currentOperand = currentOperand.slice(0, -1);
  } else if (key === 'Escape') {
    currentOperand = '';
    previousOperand = '';
    operation = null;
  }
  updateDisplay();
});

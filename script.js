// Referencia
const calculator = document.querySelector('.calculator');
const keys = calculator.querySelector('.calculator-keys');
const display = calculator.querySelector('.calculator-screen');
const historyDisplay = calculator.querySelector('.calculator-history');
let firstValue = null;
let operator = null;
let waitingForSecondValue = false;
let resetScreen = false;
// Funciones
const calculate = (n1, operator, n2) => {
    const num1 = parseFloat(n1);
    const num2 = parseFloat(n2);
    if (operator === '+') return num1 + num2;
    if (operator === '-') return num1 - num2;
    if (operator === '*') return num1 * num2;
    if (operator === '/') {
        if (num2 === 0) return 'Error';
        return num1 / num2; 
    }
    return num2;
};
//manejo usuario
const inputDigit = (keyContent) => {
    const displayValue = display.value;
    if (waitingForSecondValue) {
        display.value = keyContent;
        waitingForSecondValue = false;
    } else {
        display.value = displayValue === '0' ? keyContent : displayValue + keyContent;
    }
};
const inputDecimal = () => {
    if (waitingForSecondValue){
        display.value = '0.';
        waitingForSecondValue = false;
        return; 
    }
    if (!display.value.includes('.')) {
        display.value += '.';
    }
};
const clear = () => {
    firstValue = null;
    operator = null;
    waitingForSecondValue = false;
    display.value = '0';
    historyDisplay.textContent = '';
};
const handleOperator = (nextOperator) => {
    const inputValue = display.value;
    const currentOperator = operator;
    if (inputValue === 'Error') {
        clear();
        return;  
    } 
    let firstOperandForHistory = firstValue;
    let secondOperandForHistory = inputValue;

    if (firstValue == null || operator === null) {
        firstValue = inputValue;
    } else if (currentOperator) {
        const secondValue = inputValue;
        const result = calculate(firstValue, currentOperator, secondValue);
        display.value = String(result);
        firstValue = String(result);
    }
    if (nextOperator === '=') {
        if (firstOperandForHistory !== null)
        historyDisplay.textContent = `${firstOperandForHistory} ${currentOperator} ${secondOperandForHistory} = ${firstValue}`;
    }else {
        historyDisplay.textContent = `${inputValue} ${nextOperator}`;
    }
    waitingForSecondValue = true;
    if (nextOperator !== '=') {
        operator = nextOperator;
    } else {
        operator = null;
    }
};
//Cerebro
keys.addEventListener('click', (event) => {
    const { target } = event;
    const value = target.value;
    if (!target.matches('button')) {
        return;
    }
    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
            handleOperator(value);
            break;
        case '=':
            handleOperator(value);
            break;
        case '.':
            inputDecimal();
            break;
        case 'all-clear':
            clear();
            break;
        default:
            if (!isNaN(parseFloat(value)) && isFinite(value)) {
                inputDigit(value);
            }
    }
});


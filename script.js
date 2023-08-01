const calculatorPrototype = {
    clear() {
      this.currentOperand = '0'
      this.previousOperand = ''
      this.operation = undefined
    },
  
    delete() {
      if (this.currentOperand === '' && this.previousOperand !== '' && this.operation) {
        this.currentOperand = this.previousOperand
        this.previousOperand = ''
        this.operation = undefined
      } else {
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
      }
    },

    toggleSign() {
      this.currentOperand = (parseFloat(this.currentOperand) * -1).toString()
      this.updateDisplay()
    },
  
    appendNumber(number) {
      if (number === '.' && this.currentOperand.includes('.')) return
      if (number === '.' && this.currentOperand.length >= 11) return
      const decimalIndex = this.currentOperand.indexOf('.')
      if (decimalIndex !== -1 && this.currentOperand.slice(decimalIndex + 1).length >= 3) return
      this.currentOperand = this.currentOperand.toString() + number.toString()
    },
  
    chooseOperation(operation) {
      if (this.currentOperand === '') return
      if (this.previousOperand !== '') {
        this.compute()
      }
      this.operation = operation
      this.previousOperand = this.currentOperand
      this.currentOperand = ''
    },
  
    compute() {
      let computation;
      const prev = parseFloat(this.previousOperand)
      const current = parseFloat(this.currentOperand)
      if (isNaN(prev) || isNaN(current)) return
      switch (this.operation) {
        case '+':
          computation = prev + current
          break
        case '-':
          computation = prev - current
          break
        case '*':
          computation = prev * current
          break;
        case '÷':
          computation = prev / current
          break
        default:
          return
      }
      this.currentOperand = computation
      this.operation = undefined
      this.previousOperand = ''
    },
  
    getDisplayNumber(number) {
      const roundedNumber = parseFloat(number).toFixed(7)
      const stringNumber = number.toString()
      const integerDigits = parseFloat(stringNumber.split('.')[0])
      const decimalDigits = stringNumber.split('.')[1]
      let integerDisplay
      if (isNaN(integerDigits)) {
        integerDisplay = ''
      } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 })
      }
      const totalDigits = integerDisplay.length + (decimalDigits ? decimalDigits.length : 0);
      if (totalDigits > 10) {
        return 'Error'
      }
      if (decimalDigits && decimalDigits.length > 7) {
        return `${integerDisplay}.${decimalDigits.slice(0, 7)}`;
      } else if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
      } else {
        return integerDisplay;
      }
    },
  
    updateDisplay() {
      this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand)
      if (this.operation != null) {
        this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`
      } else {
        this.previousOperandTextElement.innerText = ''
      }
    }
};
  
function createCalculator(previousOperandTextElement, currentOperandTextElement) {
    return Object.assign(Object.create(calculatorPrototype), {
      previousOperandTextElement,
      currentOperandTextElement,
      currentOperand: '',
      previousOperand: '',
      operation: undefined
    });
}
  
const numberButtons = Array.from(document.getElementsByClassName("number"))
const operationButtons = Array.from(document.getElementsByClassName("operation"))
const dotButton = document.querySelector('.dot')
const equalsButton = document.querySelector(".equals")
const deleteButton = document.querySelector(".clear")
const allClearButton = document.querySelector('.allClear')
const previousOperandTextElement = document.querySelector(".previous")
const currentOperandTextElement = document.querySelector(".current")
const signalButton = document.querySelector('.signal')
  
const calculator = createCalculator(previousOperandTextElement, currentOperandTextElement)
  
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
    calculator.appendNumber(button.innerText);
    calculator.updateDisplay();
    });
});
  
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
    calculator.chooseOperation(button.innerText)
    calculator.updateDisplay()
    })
})

dotButton.addEventListener('click', () => {
  calculator.appendNumber('.')
  calculator.updateDisplay()
})
  
equalsButton.addEventListener('click', button => {
    calculator.compute()
    calculator.updateDisplay()
})
    
allClearButton.addEventListener('click', button => {
    calculator.clear()
    calculator.updateDisplay()
})
    
deleteButton.addEventListener('click', button => {
    calculator.delete()
    calculator.updateDisplay()
})

signalButton.addEventListener('click', () => {
  calculator.toggleSign()
})
  
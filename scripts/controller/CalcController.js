class CalcController {

	constructor() {

		this._lastOperator = '';
		this._lastNumber = '';
		this._operation = [];
		this._locale = 'pt-BR';
		this._displayCalcEl = document.querySelector("#display");
		this._displayDateEl = document.querySelector("#data");
		this._displayTimeEl = document.querySelector("#hora");
		this._currentDate;
		this.initialize();
		this.initButtonEvents();
	}

	initialize() {
		this.setDisplayDateTime();
	}

	addEventListenerAll(element, events, func) {

		let eventsSpl = events.split(' ');

		eventsSpl.forEach(ev => {

			element.addEventListener(ev, func);

		});

	}	

	clearAll() {
		this._operation = [];
		this.setLastNumberToDisplay();
	}

	clearEntry() {
		this._operation.pop();
		this.setLastNumberToDisplay();
	}

	getLastOperation() {
		return this._operation[this._operation.length-1];
	}

	setLastOperation(val) {
		this._operation[this._operation.length - 1] = val;
    }

	isOperator(val) {
		return (['+', '-', '*', '/', '%'].indexOf(val) > -1);
	}

	pushOperator(val) {
		this._operation.push(val);
		if (this._operation.length > 3) {

			console.log("bigger than 3");

			this.calc();
        }
	}

	getResult() {
		return eval(this._operation.join(""));
    }

	calc(){

		let last = '';

		this._lastOperator = this.getLastItem();

		console.log("Calc. arriving operation:" + this._operation +
		"\nOperation length: " + this._operation.length);

		if (this._operation.length < 3) {
			let firstItem = this._operation[0];
			this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

		if (this._operation.length > 3) {
			last = this._operation.pop();
			this._lastNumber = this.getResult();
		}
		else if (this._operation.length == 3) {
			this._lastNumber = this.getLastItem(false);
        }

		let result = this.getResult();

		if (last == '%') {
			result /= 100;
			this._operation = [result];
		} else {
			this._operation = [result];

			if (last) this._operation.push(last);
        }

		console.log("lastOperator: " + this._lastOperator);
		console.log("lastNumber: " + this._lastNumber);

		this.setLastNumberToDisplay();
	}

	getLastItem(isOperator =true) {

		let lastItem;

		for (let i = this._operation.length - 1; i >= 0; i--) {

			if (isOperator) {
				if (this.isOperator(this._operation[i])) {
					lastItem = this._operation[i];
					break;
				}
			}
			else {
				if (!this.isOperator(this._operation[i])) {
					lastItem = this._operation[i];
					break;
				}
            }

		}

		if (!lastItem) {
			lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

		return lastItem;
    }

	setLastNumberToDisplay(){

		let lastNumber = this.getLastItem(false);

		if (!lastNumber) lastNumber = 0;

		this.displayCalc=lastNumber;

    }

	addOperation(val) {

		if (isNaN(this.getLastOperation())) { //last is Not a number
			if (this.isOperator(val)) { //last is an operator
				this.setLastOperation(val);
			}
			else if (isNaN(val)){ //last is neither operator nor a number
				console.log(val);
			}
			else{ // is a point
				this.pushOperator(val);
				this.setLastNumberToDisplay();
            }
		}
		else { //is a Number
			console.log("isNum");

			if (this.isOperator(val)) {

				this.pushOperator(val);

			} else {
				let newVal = this.getLastOperation().toString() + val.toString();
				this.setLastOperation(parseInt(newVal));
				this.setLastNumberToDisplay();
            }
			
        }

		console.log(this._operation);
    }

	setError() {
		this.displayCalc = "Error";
    }

	execBtn(val) {

		switch (val) {
			case 'ac':
				this.clearAll();
				break;
			case 'ce':
				this.clearEntry();
				break;
			case 'soma':
				this.addOperation('+');
				break;
			case 'subtracao':
				this.addOperation('-');
				break;
			case 'divisao':
				this.addOperation('/');
				break;
			case 'multiplicacao':
				this.addOperation('*');
				break;
			case 'porcento':
				this.addOperation('%');
				break;
			case 'igual':
				this.calc();
				break;
			case 'ponto':
				this.addOperation('.');
				break;
			case '0':
			case '1':
			case '2':
			case '3':
			case '4':
			case '5':
			case '6':
			case '7':
			case '8':
			case '9':
			case '0':
				this.addOperation(parseInt(val));
				break;

			default:
				this.setError();
        }
    }


	initButtonEvents() {

		let buttons = document.querySelectorAll("#buttons > g, #parts > g");

		console.log(buttons);

		buttons.forEach((btn,index) => {
			this.addEventListenerAll(btn,"click drag", () => {
				console.log((btn.className.baseVal.replace("btn-", "")));
				let textBtn = btn.className.baseVal.replace("btn-", "");
				this.execBtn(textBtn);

			});

			this.addEventListenerAll(btn, "mouseover mouseup mousedown", () => {
				btn.style.cursor = "pointer";
			})
		});
	}

	setDisplayDateTime() {

		this.displayDate = this.currentDate.toLocaleDateString(this._locale,
			{day: "2-digit",
			month: "long",
			year: "numeric"});
		this.displayTime = this.currentDate.toLocaleTimeString(this._locale);

		setInterval(() => {
			this.displayDate = this.currentDate.toLocaleDateString(this._locale);
			this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
		}, 1000);

	}

	get currentDate() {
		return new Date();
	}

	get displayCalc() {
		return this._displayCalcEl.innerHTML;
	}

	set displayCalc(val) {
		this._displayCalcEl.innerHTML = val;
	}

	get displayDate() {
		return this._displayDateEl.innerHTML;
	}

	set displayDate(val) {
		this._displayDateEl.innerHTML = val;
	}

	get displayTime() {
		return this._displayTimeEl.innerHTML;
	}

	set displayTime(val) {
		this._displayTimeEl.innerHTML = val;
	}

}
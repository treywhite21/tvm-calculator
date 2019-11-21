# tvm-calculator

## Introduction
The tvm-calculator package is a library of time value of money calculations that you would find on a financial calculator. This includes functions to find present value, future value, payment amount, number of payments, and interest rate given a set of input parameters.

## Installation
Using npm:
```shell
$ npm i tvm-calculator
```
Note: add --save if you are using npm < 5.0.0

or

* Download or fork the repository from GitHub.
* Extract the file tvm-calculator from the project and include it in your application on the client side.

## Example Usage
```js
var tvmCalculator = require('tvm-calculator');

// Calculate future value of investment
const periodicPayment = tvmCalculator.calcPMT(
    interestRate, // Number: Interest Rate
    numberPayments, // Number: Number of Payments
    presentValue, // Number: Present Value
    futureValue, // Number: Future Value
    isBeginning, // Boolean: Is payment made at the BEGINNING of period? (false if END)
    isDiscrete, // Boolean: Is compounding DISCRETE? (false if CONTINUOUS)
    compoundingFrequency, // Number: Compounding Frequency (12 for monthly)
    paymentFrequency // Number: Payment Frequency
);

console.log('Payment amount (PMT): ', periodicPayment);
```

## Available Methods
Example method calls listed below. Further details to come.

### calcNper
```js
const numberPayments = tvmCalculator.calcNPer(rate, pmt, pv, fv, isBeginning, isDiscrete, cf, pf);
```

### calcInterestRate
```js
const interestRate = tvmCalculator.calcInterestRate(nper, pmt, pv, fv, isBeginning, isDiscrete, cf, pf) ;
```

### calcPV
```js
const presentValue = tvmCalculator.calcPV(rate, nper, pmt, fv, isBeginning, isDiscrete, cf, pf);
```

### calcPMT
```js
const paymentAmount = tvmCalculator.calcPMT(rate, nper, pv, fv, isBeginning, isDiscrete, cf, pf);
```

Example:
```js
var tvmCalculator = require("tvm-calculator")

const futureValue = tvmCalculator.calcPMT(4, 30, 100000, 0, false, true, 1, 1);

console.log("Payment: ", futureValue);
```
Prints "Payment: -5783.01"

### calcFV
```js
const futureValue = tvmCalculator.calcFV(rate, nper, pmt, pv, isBeginning, isDiscrete, cf, pf);
```

## To Do
* Add unit testing
* Improve documentation
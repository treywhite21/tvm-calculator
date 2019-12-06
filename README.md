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

// Specify params as object
const tvmParams = { pv: -100000, fv: 0, nper: 30, rate: 4 };

// Calculate payment amount of a loan
const periodicPayment = tvmCalculator.calcPMT(tvmParams);

// Log calculated result (3508.33)
console.log('Payment amount (PMT): ', periodicPayment);
```

## Parameters
Parameters are listed below. When solving for a value such as PMT, that parameter can be omitted.
Parameters specified as "Optional" will default to the values described below.
All parameters should be passed in as a single object.

rate, // Number: Interest Rate as whole number
nper, // Number: Number of Periods in term
pmt, // Number: Payment Amount
pv, // Number: Present Value (should be entered as negative)
fv, // Number: Future Value
isBeginning, // Boolean: Is payment made at the BEGINNING of period? (Optional: defaults to false)
isDiscrete, // Boolean: Is compounding DISCRETE? (Optional: defaults to true)
cf, // Number: Compounding Frequency (Optional: defaults to 12 for monthly)
pf, // Number: Payment Frequency (Optional: defaults to 12 for monthly)

## Available Methods
Example method calls listed below. Further details to come.

### calcNper
Calculate number of periods.
Required params: rate, pmt, pv, fv.

```js
const numberPeriods = tvmCalculator.calcNPer({ pv: -100000, fv: 0, pmt: 3508, rate: 4 });
console.log('Number of Periods (N)', numberPeriods); // 30.00
```

### calcInterestRate
Calculate interest rate.
Required params: nper, pmt, pv, fv.

```js
const interestRate = tvmCalculator.calcInterestRate({ pv: -100000, fv: 0, nper: 30, pmt: 3508 });
console.log('Interest Rate (I/Y)', interestRate); // 3.993
```

### calcPV
Calculate present value.
Required params: nper, pmt, fv, rate.

```js
const presentValue = tvmCalculator.calcPV({ nper: 30, fv: 0, pmt: 3508, rate: 4 });
console.log('Present Value (PV)', presentValue); // -99990.73
```

### calcPMT
Calculate payment amount.
Required params: nper, pv, fv, rate.

```js
const paymentAmount = tvmCalculator.calcPMT({ pv: -100000, fv: 0, nper: 30, rate: 4 });
console.log('Payment Amount (PMT)', paymentAmount); // 3508.33
```

### calcFV
Calculate future value.
Required params: nper, pv, pmt, rate.

```js
const futureValue = tvmCalculator.calcFV({ pv: -100000, pmt: 3508, nper: 30, rate: 4 });
console.log('Future Value (FV)', futureValue); // 10.24
```


Full Params Example:
```js
const tvmParams = {
    pv: -100000,
    fv: 0,
    nper: 30,
    rate: 4,
    isBeginning: false,
    isDiscrete: true,
    cf: 1,
    pf: 1,
};
const periodicPayment = tvmCalculator.calcPMT(tvmParams);

console.log("Payment Amount (PMT): ", periodicPayment); // 5783.01
```

## To Do
* Add unit testing
* Improve documentation
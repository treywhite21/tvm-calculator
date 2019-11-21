/* 
Basic financial formulas:
PV=Present Value. FV=Future value, PMT=payment per priod, NPer=Number of period,
IR=Annual interest rate, CF=Compound frequency, PF=payment frequency,
X=1 for beginning of period payment otherwise 0, i=effective interest

Financial equation: (General)
	(1): (PV+PMT(1+iX)/i)((1+i)^NPer-1)+PV + FV = 0
by using:
	(2): A=(1+i)^NPer-1
	(3): B=(1+iX)/i
you get:
	(4): (PV+PMT*B)*A+PV+FV=0
which solved for the other variable gives:
	(5): NPer=log((PMT*B-FV)/(PMT*B+PV))/log(1+i)
	(6): PV=-(FV+A*PMT*B)/(A+1)
	(7): PMT=-(FV+PV(A+1))/(A*B)
	(8): FV=-(PV+A(PV+PMT*B))
	(9): IR solved by iteration
Special case 1: IR=0 && PMT!=0; PV+PMT*NR+FV=0
	(10): FV=-(PV+NPer*PMT)
	(11): PV=-FV-NPer*PMT
	(12): PMT=-(FV+PV)/NPer
	(13): NPer=-(FV+PV)/PMT
Special case 2: IR!=0 && PMT=0
	(14): FV=-PV(1+A)
	(15): PV=-FV/(1+A)
	(16): NPer=log(-FV/PV)/log(1+i)
	(17): i=(FV/PV)^(1/NPer)-1  Condition PV*FV<0
*/

const calcRateEff = (rate, isDiscrete, cf, pf) => {
	if (isDiscrete) {
		return Math.pow((1 + rate / 100 / cf), cf / pf) - 1;
	}

	return Math.exp(rate / 100 / pf) - 1;
};

const calcRate = (rateEff, isDiscrete, cf, pf) => {
	if (isDiscrete) {
		return (cf * (Math.pow(1 + rateEff, pf / cf) - 1)) * 100;
	}

	return (Math.log(Math.pow(1 + rateEff, pf))) * 100;
};

const calcVars = (rate, nper, isBeginning, isDiscrete, cf, pf) => {
	const rateEff = calcRateEff(rate, isDiscrete, cf, pf);
	const x = (isBeginning ? 1 : 0);
	const a = Math.pow(1 + rateEff, nper) - 1;
	const b = (1 + rateEff * x) / rateEff;

	return { rateEff, x, a, b };
};

export const calcPV = params => {
	const { rate, nper, pmt, fv, isBeginning = false, isDiscrete = true, cf = 12, pf = 12 } = params;
	const vars = calcVars(rate, nper, isBeginning, isDiscrete, cf, pf);
	const { rateEff, a, b } = vars;
	let pv;

	if (rateEff === 0) {
		pv = -1 * (fv - nper * pmt);
	} else if (pmt === 0) {
		pv = -1 * (fv / (a + 1));
	} else {
		pv = -1 * ((fv + a * pmt * b) / (a + 1));
	}

	return pv.toFixed(2);
};

export const calcFV = params => {
	const { rate, nper, pmt, pv, isBeginning = false, isDiscrete = true, cf = 12, pf = 12 } = params;
	const vars = calcVars(rate, nper, isBeginning, isDiscrete, cf, pf);
	const { rateEff, a, b } = vars;
	let fv;

	if (rateEff === 0) {
		fv = -1 * (pv - nper * pmt);
	} else if (pmt === 0) {
		fv = -1 * (pv * (1 + a));
	} else {
		fv = -1 * (pv + a * (pv + pmt * b));
	}

	return fv.toFixed(2);
};

export const calcPMT = params => {
	const { rate, nper, pv, fv, isBeginning = false, isDiscrete = true, cf = 12, pf = 12 } = params;
	const vars = calcVars(rate, nper, isBeginning, isDiscrete, cf, pf);
	const { rateEff, a, b } = vars;
	let pmt;

	if (rateEff === 0) {
		pmt = -1 * ((fv + pv) / nper);
	} else {
		pmt = -1 * ((fv + pv * (a + 1)) / (a * b));
	}

	return pmt.toFixed(2);
};

export const calcNPer = params => {
	const { rate, pmt, pv, fv, isBeginning = false, isDiscrete = true, cf = 12, pf = 12 } = params;
	const vars = calcVars(rate, 0, isBeginning, isDiscrete, cf, pf);
	const { rateEff, b } = vars;
	let nper;

	if (rateEff === 0) {
		nper = -1 * ((fv + pv) / pmt);
	} else if (pmt === 0) {
		nper = Math.log(-1 * (fv / pv)) / Math.log(1 + rateEff);
	} else {
		let t = pv + pmt * b;

		if (t !== 0) {
			t = (-1 * fv + pmt * b) / t;
		}

		if (t !== 0) {
			nper = Math.log(t) / Math.log(1 + rateEff);
		}
	}

	return nper.toFixed(2);
};

/*
	(1): (PV+PMT(1+iX)/i)((1+i)^NPer-1)+PV + FV = 0
	by using:
	(2): A=(1+i)^NPer-1
	(3): B=(1+iX)/i
	you get:
	(4): (PV+PMT*B)*A+PV+FV=0
*/
const iNewton3 = (nper, pmt, pv, fv, isBeginning, isDiscrete, cf, pf) => {
	const fx = (i, x) => Math.pow(1 + i, nper) * pmt * (1 + x * i) - pmt * (1 + x * i) + fv * i + pv
		* i * Math.pow(1 + i, nper);
	const f1x = (i, x) => {
		const t = 1 + x * i;
		return (Math.pow(1 + i, nper) - 1) * (-1 * (pmt * t)) + nper * i * Math.pow(1 + i, nper - 1)
			* (pmt * t + pv * i);
	};
	/*
	const payment = (i, x) => {
		const a = Math.pow(1 + i, nper) - 1;
		const b = (1 + i * x) / i;
		return -1 * ((fv + pv * (a + 1)) / (a * b));
	};
	*/
	const period = (i, x) => {
		if (i === 0) {
			return -1 * ((pv + fv) / pmt);
		}
		const b = (1 + i * x) / i;
		return Math.log((-1 * fv + pmt * b) / (pv + pmt * b)) / Math.log(1 + i);
	};

	let rateEff;
	let a;

	// Check for i === 0 is a solution and return
	if ((pv + nper * pmt + fv).toFixed(4) === 0) {
		return 0;
	}

	if (pmt * fv <= 0) {
		rateEff = Math.abs((nper * pmt + pv - fv) / (nper * pv));
	} else if (pmt * fv > 0) {
		if (pv !== 0) {
			a = -1;
		} else {
			a = 1;
		}

		rateEff = Math.abs((-1 * (fv + a * nper * pmt))
			/ (3 * (pmt * Math.pow(nper - 1, 2) + pv + fv)));
	} else if (pv * pmt < 0) {
		rateEff = Math.abs((nper * pmt - fv + pv) / (nper * pv));
	} else {
		a = Math.abs(pmt / (Math.abs(pv) + Math.abs(-1 * fv)));
		rateEff = a + 1.0 / (a * nper * nper * nper);
	}

	const x = (isBeginning ? 1 : 0);
	const np0 = period(0, x);
	let direction = 1;

	if (np0 < nper) {
		// Positive interest
		direction = 1;
	}
	if (np0 > nper) {
		// Negative interest
		direction = -1;
	}
	if ((direction < 0 && rateEff > 0) || (direction > 0 && rateEff < 0)) {
		rateEff *= -1;
	}
	if (direction < 0 && rateEff < 0) {
		direction = 1;
		rateEff *= -1;
	}

	let iNew = rateEff;
	let iOld = rateEff;
	let iCalc = calcRate(rateEff, isDiscrete, cf, pf);
	let dx;
	let iCalcOld;
	let fi;
	let f1i;

	for (let count = 1; count <= 100; count += 1) {
		iOld = iNew;

		fi = fx(iOld, x);
		f1i = f1x(iOld, x);
		dx = iOld * (fi / f1i);
		iNew = iOld - dx;
		fi = fx(iNew, x);

		iCalc = calcRate(iNew, isDiscrete, cf, pf);
		iCalcOld = calcRate(iOld, isDiscrete, cf, pf);

		if (iCalc.toFixed(4) === iCalcOld.toFixed(4)) {
			break;
		}
	}

	// rateEff = iNew;
	return iNew;
};

export const calcInterestRate = params => {
	const { nper, pmt, pv, fv, isBeginning = false, isDiscrete = true, cf = 12, pf = 12 } = params;
	let rate;

	if (pmt === 0) {
		rate = Math.pow(-1 * (fv / pv), 1 / nper) - 1;
	} else {
		const i = iNewton3(nper, pmt, pv, fv, isBeginning, isDiscrete, cf, pf);
		rate = calcRate(i, isDiscrete, cf, pf) / 100;
	}

	rate *= 100;
	return rate.toFixed(2);
};

const tvmCalculator = {
    calcNPer,
    calcInterestRate,
    calcPV,
    calcPMT,
    calcFV
};

export default tvmCalculator;
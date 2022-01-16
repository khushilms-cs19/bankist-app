'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function(movements,sort = false){
	containerMovements.innerHTML = '';

	const movs = sort ? movements.slice().sort((a,b)=>a-b):movements;
	movs.forEach(function(mov, i){
		const type = mov>0?'deposit':'withdrawal';
		const html = `
			<div class="movements__row">
				<div class="movements__type movements__type--${type}">${i+1} ${type}</div>
				<div class="movements__value">${mov}€</div>
			</div>
		`;
		containerMovements.insertAdjacentHTML('afterbegin',html);

	})
}


const calcDisplayBalance = function(acc){
	const balance = acc.movements.reduce(((acc,cur)=>acc+cur),0);
	acc.balance = balance;
	labelBalance.textContent = `${balance} €`;
}


const calcDisplaySummary = function(account){
	const movements =account.movements;
	const incomes = movements
		.filter(mov=>mov>0)
		.reduce((acc, mov)=>acc+mov,0);
	
	const out = movements
		.filter(mov=>mov<0)
		.map((mov)=>Math.abs(mov))
		.reduce((acc, cur)=>acc+cur);

	const interest = movements 
		.filter(mov=>mov>0)
		.map(deposit => (deposit*account.interestRate)/100)
		.filter(int=>int>=1)
		.reduce((acc, int)=>acc+int,0);

	labelSumInterest.textContent = `${interest}€`;
	labelSumIn.textContent = `${incomes}€`;	
	labelSumOut.textContent = `${out}€`;
}



const createUsernames = function(accs){
	accs.forEach(function(acc) {
		acc.username = acc.owner.toLowerCase().split(" ").map((name)=>name.slice(0,1)).join("");
        console.log(acc.username);
	});
};


createUsernames(accounts);


let currentAccount;

const updateUI = function (acc){
	displayMovements(acc.movements);
	calcDisplayBalance(acc);
	calcDisplaySummary(acc);
}

btnLogin.addEventListener('click',function(e){
	e.preventDefault();
	currentAccount = accounts.find((acc)=>acc.username === inputLoginUsername.value);
	if(currentAccount?.pin === Number(inputLoginPin.value)){
		//display UI and message
		labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(" ")[0]}!`;
		containerApp.style.opacity = 100;
		inputLoginPin.value = "";
		inputLoginUsername.value = "";
		inputLoginPin.blur();
		updateUI(currentAccount);
	}
	console.log(currentAccount);
})

btnLoan.addEventListener('click',function(e){
	e.preventDefault();
	const amount = Number(inputLoanAmount.value);
	if(amount>0 && currentAccount.movements.some(mov=>mov>= amount*0.1)){
		currentAccount.movements.push(amount);
		updateUI(currentAccount);
		inputLoanAmount.value = "";
	};
})

btnTransfer.addEventListener('click',function(e){
	e.preventDefault();
	const amount = Number(inputTransferAmount.value);
	const receiverAcc = accounts.find((acc)=>inputTransferTo.value===acc.username);
	if(amount>0 && receiverAcc && currentAccount.balance>=amount &&receiverAcc?.username!==currentAccount.username){
		console.log("transfer valid");
		currentAccount.movements.push(-amount);
		receiverAcc.movements.push(amount);
		updateUI(currentAccount);
		inputTransferAmount.value = "";
		inputTransferTo.value = "";
	}
});

btnClose.addEventListener("click", function(e){
	e.preventDefault();
	if(currentAccount.pin === Number(inputClosePin.value) && currentAccount.username === inputCloseUsername.value){
		const accToDeleteIndex = accounts.findIndex((acc)=>acc.username===currentAccount.username);
		accounts.splice(accToDeleteIndex,1);
		inputClosePin.value = "";
		inputCloseUsername.value = "";
		containerApp.style.opacity=0;
	}
})

let isSorted = false;

btnSort.addEventListener('click',function(e){
	e.preventDefault();
	displayMovements(currentAccount.movements,!isSorted);
	isSorted = !isSorted;
})
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);



/////////////////////////////////////////////////
// let arr = ['a','b','c','d','e'];
// console.log(arr.slice(2));
// console.log(arr.slice(2,4));

// arr.splice(-1);
// console.log(arr);
// arr.splice(1,2);
// console.log(arr);

// //Reverse 
// arr = ['a','b','c','d','e'];
// let arr2 = ['j','i','h','g','f'];
// console.log(arr2.reverse());
// console.log(arr2);

// //concatenate
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr,...arr2]);


// //join 
// console.log(letters.join(" "));


// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// for(const movement of movements){
//   if(movement > 0){
//     console.log(`you deposited ${movement}`);
//   }else{
//     console.log(`You withdrew ${movement}`);
//   }
// }
// console.log("-----FOR EACH-----");
// movements.forEach((movement)=>{
//   if(movement>0){
//     console.log(`You deposited ${movement}`);
//   }else{
//     console.log(`You withdrew ${Math.abs(movement)}`);
//   }
// })

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);


// currencies.forEach((value, key, map)=>{
//   console.log(`${key}: ${value}`);
// });

// const currenciesUnique = new Set(["USD","GBP","USD","EUR","EUR"]);

// console.log(currenciesUnique);
// currenciesUnique.forEach(function(value, key, set){
//   console.log(`${key}: ${value}`);
// });

// const juliaData = [3, 5, 2, 12, 7];
// const kateData = [4, 1, 15, 8, 3];

// function checkDogs (juliaDogs, kateDogs){
// 	const newJuliaDogs = ([...juliaDogs]).slice(1,-2);
// 	const allDogs = newJuliaDogs.concat(kateDogs);
// 	allDogs.forEach((dog, ind)=>{
// 		if(dog<3){
// 			console.log(`Dog number ${ind+1} is still a puppy 🐶`);
// 		}else{
// 			console.log(`Dog number ${ind+1} is an adult, and is ${dog} years old`);
// 		}
// 	})
// }
// checkDogs(juliaData,kateData);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const euroToUsd = 1.1;
// const movementsInUsd = movements.map((movement)=>movement*euroToUsd);
// console.log("In Euros: "+movementsInUsd);
// console.log("In USD: "+movements);

// const movementDescriptions = movements.map((mov, i ,arr)=>`Movement ${i+1}: You ${mov>0?'deposited': 'withdrew'} ${Math.abs(mov)}`);

// console.log(movementDescriptions);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/*
const deposites = movements.filter((mov)=> mov>0);
const withdrawals = movements.filter((mov)=> mov<0).map((mov)=>Math.abs(mov));
console.log("The deposites are: "+deposites);
console.log("The withdrawals are: "+withdrawals);
*/

/*
console.log(movements);
const balance = movements.reduce(function(acc, cur, i, arr){
	console.log(`Interation number ${i}: ${acc}`)
	return acc + cur;
},0);
console.log("the Balance is: "+balance);

//max value in the array using the reduce method 
const maxValue = movements.reduce((acc, cur)=>cur>acc?cur:acc);
console.log(maxValue);
*/


/*
const data1 = [5, 2, 4, 1, 15, 8, 3];

const calcAverageHumanAge = function (dogAges){
	const humanAgeCoversion = (
		dogAges.map((dogAge)=>dogAge<=2?dogAge*2:(dogAge*4)+16)
		.filter((dogAge)=>dogAge>=18)
		.reduce((acc,cur,i,arr)=>acc+cur/arr.length,0)
		);
	return humanAgeCoversion;
}
const avgHumarAge = calcAverageHumanAge(data1);
console.log(avgHumarAge);
*/

/*
const euroToUsd = 1.1;
const totalDeposites = movements
	.filter(mov=>mov>0)
	.map(mov=>mov*euroToUsd)
	.reduce((acc, cur)=>acc+cur,0);
console.log(totalDeposites);
*/

// const firstWithdrawal = movements.find((mov)=>mov<0);
// console.log(movements);
// console.log(firstWithdrawal);

// console.log(movements);
// console.log(movements.some(mov=>mov>0));

// const arr = [[1,2,3],[4,5,6],7,8];
// console.log(arr.flat());
// const accountMovements = accounts.map(acc=>acc.movements);
// const allMovements = accountMovements.flat().reduce((acc,cur)=>acc+cur,0);

/*
const owners = ['Jonas', "Zach", "Adam", "Martha"];
console.log(owners.sort());
console.log(owners);

console.log(movements);
console.log(movements.sort((a, b)=>{
	return a-b;
}));

//alternative
console.log(movements.sort((a,b)=>b-a));
*/

// console.log([1,2,3,4,5,6,7]);
// console.log(new Array(1,2,3,4,5,6,7));

// const x = new Array(7);
// console.log(x);
// x.fill(1,3,5);
// // x.fill(1);
// console.log(x);
// x.fill(23,2,6);
// console.log(x);

// const y = Array.from({length: 7},()=>1);
// console.log(y);

// const z = Array.from({length: 7},(cur, i)=>i+1);
// console.log(z);



// labelBalance.addEventListener('click',function(e){
// 	e.preventDefault();
// 	const movementsUI = Array.from(document.querySelectorAll(".movements__value"),(ele)=>Number(ele.textContent.replace('€',"")));
// 	console.log(movementsUI);
// })

/*
const bankDepositeSum = Array.from(accounts,(acc)=>acc.movements)
						.flat()
						.filter((mov)=>mov>0)
						.reduce((acc,cur)=>acc+cur,0);
console.log(bankDepositeSum);

const numDepositesThousand = accounts.flatMap((acc)=>acc.movements).filter((mov)=>mov>=1000).reduce((acc)=>acc+1,0);
console.log(numDepositesThousand);

const {deposits:depo , withdrawals: withs} = accounts.flatMap((acc)=>acc.movements).reduce((acc, cur)=>{
	// if(cur>0){
	// 	acc.deposits+=cur;
	// 	return acc;
	// }else{
	// 	acc.withdrawals+=Math.abs(cur);
	// 	return acc;
	// }
	acc[cur>0?'deposits':'withdrawals']+=cur;
	return acc;
},	{deposits: 0, withdrawals: 0});
console.log(depo,withs);

const convertTitleCase = function (title){
	const words = title.split(" ").map((word)=>{
		if(word==='a'){
			return word;
		}else{
			return word[0].toUpperCase()+word.slice(1).toLowerCase();
		}
	});
	return words.join(" ");
}
console.log(convertTitleCase("this is a nice title"));
console.log(convertTitleCase("this is a LONg title but not too long"));
*/
const dogs = [
	{ weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
	{ weight: 8, curFood: 200, owners: ['Matilda'] },
	{ weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
	{ weight: 32, curFood: 340, owners: ['Michael'] }
  ];

dogs.forEach((dog)=>{
	const {weight} = dog;
	dog.recommendedFood = weight ** 0.75 *28;
});
console.log(dogs);

const sarahDog = function (dogs){
	const {recommendedFood, curFood} = dogs[dogs.findIndex((dog)=>dog.owners.includes("Sarah"))];
	if(curFood>recommendedFood*1.1){
		console.log("Sarah your dog is eating too much");
	}else if(curFood<recommendedFood*0.9){
		console.log("Sarah your dog is eating too less");
	}else{
		console.log("Sarah your dog is just eating fine");
	}
}

const {ownersEatTooLittle , ownersEatTooMuch} = dogs.reduce((all,dog)=>{
	const {recommendedFood, curFood, owners} = dog;
	if(curFood>recommendedFood*1.1){
		all.ownersEatTooMuch.push(owners);
	}else if(curFood<recommendedFood*0.9){
		all.ownersEatTooLittle.push(owners);
	}
	return all;
},{ownersEatTooMuch: [], ownersEatTooLittle: []});
console.log(ownersEatTooLittle);
console.log(ownersEatTooMuch);
console.log("the dog is eating okay", dogs.some((dog)=>dog.recommendedFood*1.1>dog.curFood && dog.recommendedFood*0.9<dog.curFood));
sarahDog(dogs);




class Ship {
	constructor(hull,firepower,accuracy,name,equipment) {
		this.hull = hull;
		this.firepower = firepower;
		this.accuracy = accuracy;
		this.name = name;
		this.equipment = equipment;
		if (this.equipment && this.equipment.includes("missles")) {
			this.missles = genRandomNumInRange(3,1);
		}
	}
	attack(target) {
		let firepower = this.firepower;
		let minAccToHit = Math.random();

		if (minAccToHit < this.accuracy) {
			target.takeDamage(this.firepower);
			console.log(this.name + ' hit successfully!');
		}
		else {
		 	console.log(this.name + ' missed!');
		}

		if (target.hull <= 0) {
			return true;
		}
	}
	takeDamage(firepower) {	
		if (firepower < 0) firepower = 0;
		this.hull -= firepower;
	}
}

class PlayerShip extends Ship {
	constructor(hull,firepower,accuracy,name,equipment) {
		super(hull,firepower,accuracy,name);
		this.equipment = equipment;
		if (this.equipment && this.equipment.includes("missles")) {
			this.missles = genRandomNumInRange(3,1);
		}
	}
	attack(target) {
		let firepower = this.firepower;
		let minAccToHit = Math.random()
		let useMissle = false;

		if (this.missles) {
			useMissle = yesNoPrompt("Use a missle? (Y/N)");
			if (useMissle) {
				firepower = 10;
				this.missles--;
			}
		}

		if (minAccToHit < this.accuracy) {
			target.takeDamage(firepower,useMissle);
			console.log(this.name + ' hit successfully!');
		}
		else {
		 	console.log(this.name + ' missed!');
		}
		if (target.name === "Boss Ship") {
			if (target.hull <= 0) {
				return true;
			}
			else {
				return target.attack(this);
			}
		}

		return alienFactory.attack(target);
	}
	takeDamage(firepower,missle) {
		if (this.equipment && this.equipment.includes("shields") && !missle) {
			firepower = firepower - genRandomNumInRange(4,0);
		}
			
		if (firepower < 0) firepower = 0;

		this.hull -= firepower;
	}
}

class BossShip extends PlayerShip {
	constructor() {
		let hull = genRandomNumInRange(30,18);
		let firepower = genRandomNumInRange(8,4);
		let accuracy = genRandomNumInRange(0.5,0.2,1);
		let equipmentArr = ["super laser","shields","missles"];
		let equipment = equipmentArr[genRandomNumInRange(2,0)];

		super(hull,firepower,accuracy,"Boss Ship",equipment);
		this.pods = [];
		this.generatePods(genRandomNumInRange(15,8));
	}
	generatePods(amount) {
		let hull = 0;

		for (i = 1; i <= amount; i++){
			hull = genRandomNumInRange(3,1);

			this.pods[this.pods.length] = new Ship(hull);
		}

		return this.pods;
	}
	attack(target) {
		let firepower = this.firepower;
		let minAccToHit = Math.random()
		let useMissle = false;

		if (this.missles) {
			useMissle = (Math.round(Math.random()) === 1);
			if (useMissle) {
				firepower = 10;
				this.missles--;
			}
		}

		if (minAccToHit < this.accuracy) {
			target.takeDamage(firepower,useMissle);
			console.log(this.name + ' hit successfully!');
		}
		else {
		 	console.log(this.name + ' missed!');
		}

		if (target.hull <= 0) {
			return true;
		}
		else {
			return target.attack(this);
		}
	}
	takeDamage(firepower,missle) {
		if (this.pods.length > 0) {
			let pod = this.pods[0];
			pod.takeDamage(firepower);
			if (pod.hull <= 0) {
				this.pods.shift();
				console.log("A pod exploded! "+this.pods.length+" pods left!");
				console.log(" ");
			}
		}
		else {
			if (this.equipment && this.equipment.includes("shields") && !missle) {
				firepower = firepower - genRandomNumInRange(4,0);
			}
			
			if (firepower < 0) firepower = 0;

			this.hull -= firepower;
		}
	}
}

const alienFactory = {
	aliens: [],
	totalAliens: 0,
	hardMode: false,
	generateAliens(amount) {
		let hull = 0;
		let firepower = 0;
		let accuracy = 0;
		let name = "";

		for (i = 1; i <= amount; i++){
			hull = genRandomNumInRange(6,3);
			firepower = genRandomNumInRange(4,2);
			accuracy = genRandomNumInRange(0.8,0.6,1);
			name = "Alien "+this.aliens.length;

			this.aliens[this.aliens.length] = new Ship(hull,firepower,accuracy,name);
		}
		this.totalAliens = this.aliens.length;

		return this.aliens;
	},
	displayAliens() {
		for (let i in this.aliens) {
			alien = this.aliens[i];
			console.log(alien.name+": hull("+alien.hull+") firepower("+alien.firepower+")");
		}
	},
	attack(origAlien) {
		let alien = {};

		if (this.hardMode) {
			for (let i in this.aliens) {
				alien = this.aliens[i];
				alien.attack(USS_Assembly);
				if (USS_Assembly.hull <= 0) {
					return true;
				}
			}
		}
		else {
			origAlien.attack(USS_Assembly);
			if (USS_Assembly.hull <= 0) {
				return true;
			}
		}

		if (origAlien.hull > 0) {
			origAlien.attack(USS_Assembly);
			return USS_Assembly.attack(origAlien);
		}
		else{
			return true;
		}
	}
}

function bossBattle(bossShip,totAliensDestroy) {
	console.log(bossShip);
	if (USS_Assembly.attack(bossShip)) {
		if (bossShip.hull <=0) {
			totAliensDestroy++;
			endGameText("You won.",totAliensDestroy);
		}
		else {
			endGameText("You were destroyed.",totAliensDestroy);
		}
	}
	
}

function findAlienIndex(name) {
	for (let i in alienFactory.aliens) {
		if (alienFactory.aliens[i].name === "Alien "+name) {
			return i;
		}
	}
	return -1;
}

function playGame() {
	let retreat = false;
	let totAliensDestroy = 0;
	let index = 0;

	console.log("The battle has started...");

	if (USS_Assembly.missles) {
		console.log("You have "+USS_Assembly.missles+" missles.");
	}

	for (let i = 0; i < alienFactory.totalAliens; i++) {
		
		console.log(" ");

		if (USS_Assembly.equipment && USS_Assembly.equipment.includes("super laser")) {
			alienFactory.displayAliens();
			index = prompt("Enter the number of the alien to attack.");
			if (!parseInt(index) || index <= 0) {
				index = 0;
			}
		}
		else {
			index = i;
		}

		index = findAlienIndex(index);

		alien = alienFactory.aliens[index];

		alienFactory.aliens.splice(index,1);
		
		if (USS_Assembly.attack(alien)) {
			if (USS_Assembly.hull <= 0) {
				endGameText("You were destroyed.",totAliensDestroy);
				return;
			}
			else {
				totAliensDestroy++;
				
				if (alienFactory.aliens.length === 0) {
					console.log("The "+alien.name+" was destroyed. "+(alienFactory.totalAliens - totAliensDestroy)+" left!");
					alert("The Boss Ship is here!");
					const bossShip = new BossShip();
					bossBattle(bossShip,totAliensDestroy);
					return;
				}
				else {
					console.log("The "+alien.name+" was destroyed. "+(alienFactory.totalAliens - totAliensDestroy)+" left!");
					retreat = yesNoPrompt("You have "+USS_Assembly.hull+" hull left. Do you want to retreat? (Y/N)");
					if (retreat) {
						endGameText("You retreated.",totAliensDestroy);
						return;
					}
					else {
						console.log("Never give up! Never surrender!");
					}
				}
			}
		}
	}
}

const USS_Assembly = new PlayerShip(20,5,0.7,"USS_Assembly",["super laser","shields","missles"]);

let numberOfAliens = prompt("How many aliens do you want to fight? Cancel for a random number.");
if (numberOfAliens < 1) {
	numberOfAliens = genRandomNumInRange(15,5);
}
console.log(numberOfAliens + " aliens are attacking Earth! Defend it!");

alienFactory.hardMode = true;
alienFactory.generateAliens(numberOfAliens);

playGame();

console.log(" ");
console.log("Refresh your browser to play another game.");



//-------------------//
//End main game logic
//-------------------//

//-------------------//
//Helper functions
//-------------------//

function endGameText(text,totAliensDestroyed) {
	console.log(" ");
	console.log(text);
	console.log("Game over. You destroyed "+totAliensDestroyed+" aliens.");
}

function genRandomNumInRange(top,bot,decPlaces) {
	if (!decPlaces) {
		decPlaces = 0;
	}

	let mult = "1";

	for (let i = 0; i < decPlaces; i++) {
		mult += "0";
	}

	mult = parseInt(mult);

	return Math.round(((Math.random()*(top-bot))+bot)*mult)/mult;
}

function yesNoPrompt(text) {
	yesNo = prompt(text);
	if (yesNo && (yesNo.toUpperCase() === "Y" || yesNo.toUpperCase() === "YES")) {
		return true;
	}
}

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
			if (target.equipment && target.equipment.includes("shields")) {
				firepower = firepower - genRandomNumInRange(4,0);
			}
			
			if (firepower < 0) firepower = 0;

			console.log(this.name + ' hit successfully!');
			target.hull -= firepower;
		}
		else {
		 	console.log(this.name + ' missed!');
		}

		if (target.hull <= 0) {
			return true;
		}
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
			useMissle = yesNoPrompt("Use a missle?");
			if (useMissle) {
				firepower = 10;
				this.missles--;
			}
		}

		if (minAccToHit < this.accuracy) {
			if (target.equipment && target.equipment.includes("shields") && !useMissle) {
				firepower = firepower - genRandomNumInRange(4,0);
			}
			
			if (firepower < 0) firepower = 0;

			console.log(this.name + ' hit successfully!');
			target.hull -= firepower;
		}
		else {
		 	console.log(this.name + ' missed!');
		}

		return alienFactory.attack(target);
	}

}

const USS_Assembly = new PlayerShip(20,5,0.7,"USS_Assembly",["super laser","shields","missles"]);

const alienFactory = {
	aliens: [],
	totalAliens: 0,
	generateAliens(amount) {
		let hull = 0;
		let firepower = 0;
		let accuracy = 0;

		for (i = 1; i <= amount; i++){
			hull = genRandomNumInRange(6,3);
			firepower = genRandomNumInRange(4,2);
			accuracy = genRandomNumInRange(0.8,0.6,1);

			this.aliens[this.aliens.length] = new Ship(hull,firepower,accuracy,"Alien");
		}
		this.totalAliens = this.aliens.length;

		return this.aliens;
	},
	displayAliens() {
		for (let i in this.aliens) {
			alien = this.aliens[i];
			console.log(i+": hull("+alien.hull+") firepower("+alien.firepower+")");
		}
	},
	attack(origAlien) {
		let alien = {};
		for (let i in this.aliens) {
			alien = this.aliens[i];
			alien.attack(USS_Assembly);
			if (USS_Assembly.hull <= 0) {
				return true;
			}
		}
		if (origAlien.hull > 0) {
			return USS_Assembly.attack(origAlien);
		}
		else{
			return true;
		}
	}
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
			index = prompt("Pick an alien to attack.");
			if (!parseInt(index) || index <= 0) {
				index = 0;
			}
		}
		else {
			index = i;
		}

		alien = alienFactory.aliens[index];
		
		if (USS_Assembly.attack(alien)) {
			if (USS_Assembly.hull <= 0) {
				endGameText("You were destroyed.",totAliensDestroy);
				return;
			}
			else {
				totAliensDestroy++;
				alienFactory.aliens.splice(index,1);
				if (alienFactory.aliens.length === 0) {
					endGameText("You won.",totAliensDestroy);
					return;
				}
				else {
					console.log("The alien was destroyed. "+(alienFactory.totalAliens - totAliensDestroy)+" left!");
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

let numberOfAliens = prompt("How many aliens do you want to fight? Cancel for a random number.");
if (numberOfAliens < 1) {
	numberOfAliens = genRandomNumInRange(15,5);
}
console.log(numberOfAliens + " aliens are attacking Earth! Defend it!");
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

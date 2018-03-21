class Ship {
	constructor(hull,firepower,accuracy,name,equipment) {
		this.hull = hull;
		this.firepower = firepower;
		this.accuracy = accuracy;
		this.name = name;
		this.equipment = equipment;
	}
	attack(target) {
		let firepower = this.firepower;
		let minAccToHit = Math.random()

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
		// if (minAccToHit >= this.accuracy) {
		// 	console.log(this.name + ' missed!');
		// }

		if (target.hull <= 0) {
			return true;
		}
		else {
			return target.attack(this);
		}
	}
}

const USS_Assembly = new Ship(20,5,0.7,"USS_Assembly",["super laser","shields"]);

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
	}
}

function playGame() {
	let retreat = false;
	let totAliensDestroy = 0;
	let index = 0;

	console.log("The battle has started...");

	for (let i = 0; i < alienFactory.totalAliens; i++) {
		
		console.log(" ");

		if (USS_Assembly.equipment.includes("super laser")) {
			alienFactory.displayAliens();
			index = prompt("Pick an alien to attack.");
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
					retreat = prompt("You have "+USS_Assembly.hull+" hull left. Do you want to retreat? (Y/N)");
					if (retreat !== null && (retreat.toUpperCase() === "Y" || retreat.toUpperCase() === "YES")) {
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


class Ship {
	constructor(hull,firepower,accuracy,name) {
		this.hull = hull;
		this.firepower = firepower;
		this.accuracy = accuracy;
		this.name = name;
	}
	attack(target) {
		if (Math.random() < this.accuracy) {
			console.log(this.name + ' hit successfully!');
			target.hull -= this.firepower;
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
}

const USS_Assembly = new Ship(20,5,0.7,"USS_Assembly");

const alienFactory = {
	aliens: [],
	generateAliens(amount) {
		let hull = 0;
		let firepower = 0;
		let accuracy = 0;

		for (i = 1; i <= amount; i++){
			hull = Math.round((Math.random()*3)+3);
			firepower = Math.round((Math.random()*2)+2);
			accuracy = Math.round(((Math.random()*0.2)+0.6)*10)/10;
			this.aliens[this.aliens.length] = new Ship(hull,firepower,accuracy,"Alien");
		}

		return this.aliens;
	}
}

function playGame() {
	let retreat = false;

	console.log("The battle has started...");

	for (alien of alienFactory.aliens) {
		console.log(" ");
		if (USS_Assembly.attack(alien)) {
			if (USS_Assembly.hull <= 0) {
				console.log("You were destroyed. Game over.");
				return;
			}
			else {
				if (alienFactory.aliens.indexOf(alien) === (alienFactory.aliens.length-1)) {
					console.log("You won. Game over.");
					return;
				}
				else {
					retreat = prompt("The alien was destroyed. You have "+USS_Assembly.hull+" hull left. Do you want to retreat? (Y/N)");
					if (retreat !== null && (retreat.toUpperCase() === "Y" || retreat.toUpperCase() === "YES")) {
						console.log("You retreated. Game over.");
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

let numberOfAliens = prompt("How many aliens do you want to fight?");
alienFactory.generateAliens(numberOfAliens);

playGame();

console.log(" ");
console.log("Refresh your browser to play another game.");










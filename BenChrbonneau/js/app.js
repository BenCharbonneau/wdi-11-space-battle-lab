class Ship {
	constructor(name,equipment,hullR,fpR,accR,shieldR,misR,missleDam) {
		this.hullR = hullR;
		this.fpR = fpR;
		this.accR = accR;
		this.hull = genRandomNumInRange(hullR[0],hullR[1]);
		this.firepower = genRandomNumInRange(fpR[0],fpR[1]);
		this.accuracy = genRandomNumInRange(accR[0],accR[1]);
		this.name = name;
		this.equipment = equipment;

		this.shieldR = shieldR;
		this.misR = misR;
		this.missleDam = missleDam;
		if (this.equipment && this.equipment.includes("missles")) {
			this.missles = genRandomNumInRange(misR[0],misR[1]);
		}
	}
	attack(target) {
		let firepower = this.firepower;
		let minAccToHit = Math.random();
		let useMissle = false;

		if (this.missles) {
			if (Math.random() < 0.2) {
				firepower = this.missleDam;
				this.missles--;
				useMissle = true;
			}
		}

		if (minAccToHit < this.accuracy) {
			target.takeDamage(this.firepower,useMissle);
			console.log(this.name + ' hit successfully!');
		}
		else {
		 	console.log(this.name + ' missed!');
		}

		if (target.hull <= 0) {
			return true;
		}
	}
	takeDamage(firepower,missle) {
		if (this.equipment && this.equipment.includes("shields") && !missle) {
			firepower = firepower - genRandomNumInRange(this.shieldR[0],this.shieldR[1]);
		}
			
		if (firepower < 0) firepower = 0;

		this.hull -= firepower;
	}
}

class PlayerShip extends Ship {
	attack(target) {
		let firepower = this.firepower;
		let minAccToHit = Math.random()
		let useMissle = false;

		if (this.missles) {
			useMissle = yesNoPrompt("Use a missle? (Y/N)");
			if (useMissle) {
				firepower = this.missleDam;
				this.missles--;
			}
		}

		if (minAccToHit < this.accuracy) {
			console.log(this.name + ' hit successfully!');
			target.takeDamage(firepower,useMissle);
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
		return alienFactory.attack(target,this);
	}
	buff(level,returnToBase) {
		this.hullR[0]+=2;
		this.hullR[1]+=2;
		this.shieldR[0]++;
		this.firepower++;
		this.firepower++;

		if (returnToBase) {
			if (level >= 2) {
				this.equipment.push("super laser");
				alert("You have targeting systems now! They let you pick which alien to attack.");
			}

			if (level >= 5) {
				this.equipment.push("shields");
				alert("Your scientists were able to copy the alien ship's technology. You have shields now!");
			}

			if (level >= 10) {
				this.equipment.push("missles");
				alert("Your scientists were able to copy the alien ship's technology. You have missles now!");
			}

			this.missleDam += 1;
			this.misR[0]++;
			this.misR[1]++;
			if (this.equipment && this.equipment.includes("missles")) {
				alert("Missles do "+this.missleDam+" damage now.");
			}

			this.hull = genRandomNumInRange(this.hullR[0],this.hullR[1]);
			if(this.missles) {
				this.missles = genRandomNumInRange(this.misR[0],this.misR[1]);
			}
		}
	}
}

class BossShip extends Ship {
	constructor(equipment,hullR,fpR,accR,podR,missleDam) {
		super("Boss Ship",equipment,hullR,fpR,accR);

		this.pods = [];
		this.podR = podR;
		this.generatePods();

		this.equipment = equipment;
		this.missleDam = missleDam;
	}
	generatePods() {
		let hullR = [3,1];
		let amount = genRandomNumInRange(this.podR[0],this.podR[1])

		for (i = 1; i <= amount; i++){
			this.pods[this.pods.length] = new Ship("",[],hullR,[0,0],[0,0]);
		}

		return this.pods;
	}
	attack(target) {
		let firepower = this.firepower;
		let minAccToHit = Math.random()
		let useMissle = false;

		if (this.missles) {
			if (Math.random() < 0.4) {
				firepower = this.missleDam;
				this.missles--;
				useMissle = true;
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
				firepower = firepower - genRandomNumInRange(this.shieldR[0],this.shieldR[1]);
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
	hullR: [6,3],
	fpR: [4,2],
	accR: [0.8,0.6],
	avialEquip: ["shields","missles"],
	equipment: [],
	generateAliens(amount) {
		let name = "";
		let equipment = this.equipment;

		for (i = 1; i <= amount; i++){
			name = "Alien "+this.aliens.length;

			this.aliens[this.aliens.length] = new Ship(name,equipment,this.hullR,this.fpR,this.accR);
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
	attack(origAlien,USS_Assembly) {
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
	},
	buff(level) {
		this.hullR[0]++;
		this.hullR[1]++;
		this.fpR[0]++;
		this.fpR[1]++;
		if (this.accR[0] !== 0.99) {
			this.accR[0] += 0.01;
			this.accR[1] += 0.01;
		}

		if(level === 5) {
			this.hardMode = true;
			alert("Aliens will all attack you at once now!");
		}

		if (level%10 === 0) {
			this.equipment.push(this.availEquip.shift());
		}
	}
}

const bossFactory = {
	hullR: [20,10],
	fpR: [5,3],
	accR: [0.5,0.2],
	equipment: [],
	podR: [5,2],
	missleDam: 10,
	generateBoss() {
		const bossShip = new BossShip(this.equipment,this.hullR,this.fpR,this.accR,this.podR,this.missleDam);
		return bossShip;
	},
	buff(level) {
		this.hullR[0]+=2;
		this.hullR[1]+=2;
		this.shieldR[0]++;
		this.fpR++;
		this.fpR++;
		this.podR[0] +=2;
		this.podR[1] +=2;

		if (level === 4) {
			this.equipment.push("shields");
			alert("The boss ship has shields now! They will block a random amount of damage every time it get's hit.");
		}

		if (level === 9) {
			this.equipment.push("missles");
			alert("The boss ship has missles now! They do "+this.missleDam+" damage and go through shields.");
		}

		if (level%5 === 0) {
			this.missleDam += 6;
			this.misR[0]++;
			this.misR[1]++;
		}
	}
}

function bossBattle(bossShip,totAliensDestroy,USS_Assembly) {
	console.log(" ");
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
	return 0;
}

function buffShips(level,returnToBase,USS_Assembly) {
	USS_Assembly.buff(level,returnToBase);
}

function battle(USS_Assembly) {
	
	let numberOfAliens = prompt("How many aliens do you want to fight? Cancel for a random number.");
	if (numberOfAliens < 1) {
		numberOfAliens = genRandomNumInRange(15,5);
	}

	console.log(numberOfAliens + " aliens are attacking Earth! Defend it!");

	alienFactory.generateAliens(numberOfAliens);


	let retreat = false;
	let totAliensDestroy = 0;
	let index = 0;
	let alien = {};

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
					const bossShip = bossFactory.generateBoss();
					bossBattle(bossShip,totAliensDestroy,USS_Assembly);
					return;
				}
				else {
					console.log("The "+alien.name+" was destroyed. "+(alienFactory.totalAliens - totAliensDestroy)+" left!");
					retreat = yesNoPrompt("You have "+USS_Assembly.hull+" hull left. Do you want to retreat? (Y/N)");
					if (retreat) {
						endGameText("You retreated.",totAliensDestroy);
						return retreat;
					}
					else {
						console.log("Never give up! Never surrender!");
					}
				}
			}
		}
	}
}

function restartGame() {
	const USS_Assembly = new PlayerShip("USS_Assembly",[],[20,20],[5,5],[0.7,0.7],[4,0],[],0);

	alienFactory.aliens = [];
	alienFactory.alienstotalAliens = 0;
	alienFactory.hardMode = false;
	alienFactory.hullR = [6,3];
	alienFactory.fpR = [4,2];
	alienFactory.accR = [0.8,0.6];
	alienFactory.avialEquip = ["shields","missles"];
	alienFactory.equipment = [];

	bossFactory.hullR = [20,10];
	bossFactory.fpR = [5,3];
	bossFactory.accR = [0.5,0.2];
	bossFactory.equipment = [];
	bossFactory.podR = [5,2];
	bossFactory.missleDam = 10;

	playGame(USS_Assembly);
}

function playGame() {
	let cont = true;
	let i = 0;
	let returnToBase;
	let missleText = "";
	let retreat = false;

	const USS_Assembly = new PlayerShip("USS_Assembly",[],[20,20],[5,5],[0.7,0.7],[4,0],[],0);

	while(cont) {

		retreat = battle(USS_Assembly);

		if (!retreat) {
			if (USS_Assembly.hull <= 0 || (i > 1 && !yesNoPrompt("Continue to the next battle? (Y/N)"))) {
				cont = false;
			}
			i++;
		}

		if (cont) {

			if (USS_Assembly.equipment && USS_Assembly.equipment.includes("missles")) {
				missleText = "and "+USS_Assembly.missles+" missles";
			}

			returnToBase = yesNoPrompt("You have "+USS_Assembly.hull+" hull"+missleText+". Return to base for repairs? (Y/N)")
		
			if (!retreat) buffShips(i,returnToBase,USS_Assembly);
		}
	}

	if (yesNoPrompt("You made it to level "+i+". Play another game?")) restartGame();
	else console.log("Thanks for playing!");
}


playGame();




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

function genRandomNumInRange(top,bot) {

	let decPlTop = 0;
	let decPlBot = 0;
	let decString = bot.toString().split(".")[1];

	if (decString) {
		decPlBot = decString.length;
	}

	decString = top.toString().split(".")[1];
	if (decString) {
		decPlTop = decString.length;
	}

	decPlaces = Math.max(decPlTop,decPlBot);

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

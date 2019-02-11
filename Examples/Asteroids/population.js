let genomeInputsN = 16;
let genomeOutputN = 4;
let bestPlayer;
let bestFitness = 0;
let showBest = true;
let showAll = false;

//The Population Class
//Here is where the power of all the classes
//comes together to destroy the game score records
class Population{
	constructor(size){
		this.population = [];

		this.generation = 0;
		this.matingPool = [];

		for(let i = 0; i < size; i++){
			this.population.push(new Player());
			this.population[i].brain.generateNetwork();
			this.population[i].brain.mutate();
		}

		bestPlayer = this.population[0].clone();;
	}

	updateAlive(show){
		for(let i = 0; i < this.population.length; i++){
			if(!this.population[i].dead){
				this.population[i].look();
				this.population[i].think();
				this.population[i].move();
				this.population[i].update();

				if(show && showAll)
					this.population[i].show();
			}
		}

		if(bestPlayer && !bestPlayer.dead){
			bestPlayer.look();
			bestPlayer.think();
			bestPlayer.move();
			bestPlayer.update();
			if(show && showBest)
				bestPlayer.show();
		}
	}

	done(){
		for(let i = 0; i < this.population.length; i++){
			if(!this.population[i].dead){
				return false;
			}
		}
		
		bestPlayer = bestPlayer.clone();
		return true;
	}
	
	naturalSelection(){
		this.calculateFitness();

		let averageSum = this.getAverageScore();
		console.log(averageSum);
		let children = [];
		
		this.fillMatingPool();
		for(let i = 0; i < this.population.length; i++){
			let parent1 = this.selectPlayer();
			let parent2 = this.selectPlayer();
			if(parent1.fitness > parent2.fitness)
				children.push(parent1.crossover(parent2));
			else
				children.push(parent2.crossover(parent1));
		}


		this.population.splice(0, this.population.length);
		this.population = children.slice(0);
		this.generation++;
		this.population.forEach((element) => { 
			element.brain.generateNetwork();
		});	

		console.log("Generation " + this.generation);
		//console.log(this);
	}

	calculateFitness(){
		let currentMax = 0;
		this.population.forEach((element) => { 
			element.calculateFitness();
			if(element.fitness > bestFitness){
				bestFitness = element.fitness;
				bestPlayer = element.clone();
				bestPlayer.brain.id = "BestGenome";
				bestPlayer.brain.draw();
			}

			if(element.fitness > currentMax)
				currentMax = element.fitness;
		});

		//Normalize
		this.population.forEach((element, elementN) => { 
			element.fitness /= currentMax;
		});
	}

	fillMatingPool(){
		this.matingPool.splice(0, this.matingPool.length);
		this.population.forEach((element, elementN) => { 
			let n = element.fitness * 100;
			for(let i = 0; i < n; i++)
				this.matingPool.push(elementN);
		});
	}

	selectPlayer(){
		let rand = Math.floor(random(0, this.matingPool.length));
		return this.population[this.matingPool[rand]];
	}

	getAverageScore(){
		let avSum = 0;
		this.population.forEach((element) => { 
			avSum += element.score;
		});

		return avSum / this.population.length;
	}
}
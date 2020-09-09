import { RebelAlliance, Empire } from './Alliance.mjs';
import { RebelPlanet, EmpirePlanet } from './Planet.mjs';
import { AllocationBar } from './AllocationBar.mjs';
import { Message } from './Message.mjs';

/***
 * Properties: rebels and empire arrays contain key classes which manage
 * user input, planets and game logic
 * Methods: endTurn listenes to the end turn button
 * endTurnHandler calculates the current number of rebel fleets, updates the UI,
 * calls destroy() and checks for victory
***/
export class Game {

  constructor() {
    const rebelPlanets = new Array(
      new RebelPlanet('Dantooine', 1, 3),
      new RebelPlanet('Lothal', 2, 2),
      new RebelPlanet('Hoth', 2, 0),
      new RebelPlanet('Chandrila', 3, 2),
      new RebelPlanet('Yavin-4', 1, 3),
      new RebelPlanet('Alderaan', 4, 4),
      new RebelPlanet('Mon-Calamari', 3, 2),
      new RebelPlanet('Bothawui', 3, 3),
      new RebelPlanet('Sullust', 1, 1)
    );

    const empirePlanets = new Array(
      new EmpirePlanet('Jakku', 4),
      new EmpirePlanet('Mustafar', 5),
      new EmpirePlanet('Byss', 5),
      new EmpirePlanet('Corellia', 5),
      new EmpirePlanet('Coruscant', 7),
      new EmpirePlanet('Naboo', 6),
      new EmpirePlanet('Kashyyyk', 4),
      new EmpirePlanet('Malastare', 5),
      new EmpirePlanet('Geonosis', 4)
    );
    let planNumber = null;
    let undeterminedPlanets = [...empirePlanets];
    let counter = 9;
    while (counter > 6) {
      planNumber = Math.floor((Math.random() * (counter-1)));
      empirePlanets[planNumber].hasPlans = true;
      undeterminedPlanets.splice(planNumber, 1);
      counter--;
    }


    this.rebels = new RebelAlliance(rebelPlanets);
    this.empire = new Empire(empirePlanets, this.rebels);
    this.rebels.setup(true);
    this.empire.setup(false);
    this.endTurnSetup();

    new Message("welcome");
    function initialRebelTurn(rebels) {
      new AllocationBar(rebels);
      new Message("initial");
    }
    setTimeout(initialRebelTurn, 3000, this.rebels);

  }

  endTurnSetup() {
    const _button = document.getElementById('turn-btn');
    _button.addEventListener('click', this.endTurnHandler.bind(this));
  }

  endTurnHandler() {
    this.rebels.totalFleetsPerTurn = 3;
    document.getElementById('turn-btn').disabled = true;

    // Deal with the amount of rebel fleets, food, credits and plans captured
    if (this.rebels.totalFoodPerTurn <= 0) {
      this.rebels.totalFleetsPerTurn += this.rebels.totalFoodPerTurn;
    }
    this.rebels.totalFleetsPerTurn += this.rebels.totalGoldPerTurn*0.5;
    if (this.rebels.totalFleetsPerTurn > 3) {
      this.rebels.totalFleetsPerTurn =
        Math.floor(this.rebels.totalFleetsPerTurn);
    } else {
      this.rebels.totalFleetsPerTurn = 3;
    }

    document.getElementById('credits-counter').innerHTML = `
    Total credits per turn: ${this.rebels.totalGoldPerTurn} million`;
    document.getElementById('food-counter').innerHTML = `
    Total food per turn: ${this.rebels.totalFoodPerTurn}`;
    document.getElementById('fleet-counter').innerHTML = `
    Rebel fleets per turn: ${this.rebels.totalFleetsPerTurn}`;

    // Invade an exposed planet, then destroy a planet using the Death Star
    let destroyNumber = Math.floor((Math.random() * this.rebels.size));
    this.empire.deathStar.destroy(this.rebels.planets[destroyNumber]);
    this.empire.deathStar.attack();

    // Check for victories
    if (this.empire.numberPlansFound == 3) {
      new Message("success");
      this.empire.deathStar.makeClickable(this.empire);
      document.getElementById('DeathStar').className = 'empire-planet-img';
    }

    function startRebelTurn(rebels) {
      new AllocationBar(rebels);
      document.getElementById('turn-btn').disabled = false;
    }
    setTimeout(startRebelTurn, 3500, this.rebels);
  }

}

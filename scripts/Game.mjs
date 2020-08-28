import { RebelAlliance, Empire } from './Alliance.mjs';
import { RebelPlanet, EmpirePlanet } from './Planet.mjs';
import { AllocationBar } from './AllocationBar.mjs';
import { Message } from './Message.mjs';

/***
 * Properties: rebelAlliance and empire arrays contain key classes which manage
 * user input, planets and game logic
 * Methods: endTurn listenes to the end turn button
 * endTurnHandler calculates the current number of rebel fleets, updates the UI,
 * calls destroy() and checks for victory
***/
export class Game {

  constructor() {
    const rebelPlanets = new Array(
      new RebelPlanet('Lothal', 2, 1),
      new RebelPlanet('Hoth', 1, 0),
      new RebelPlanet('Alderaan', 4, 4),
      new RebelPlanet('Yavin-4', 1, 3),
      new RebelPlanet('Mon-Calamari', 3, 1),
      new RebelPlanet('Sullust', 1, 1),
      new RebelPlanet('Chandrila', 3, 2),
      new RebelPlanet('Dantooine', 1, 3),
      new RebelPlanet('Bothawui', 2, 3)
    );
    const empirePlanets = new Array(
      new EmpirePlanet('Coruscant', 5, true),
      new EmpirePlanet('Naboo', 5, true),
      new EmpirePlanet('Mustafar', 5, true),
      new EmpirePlanet('Kashyyyk', 5, false),
      new EmpirePlanet('Corellia', 5, false),
      new EmpirePlanet('Byss', 5, false),
      new EmpirePlanet('Malastare', 5, false),
      new EmpirePlanet('Jakku', 5, false),
      new EmpirePlanet('Geonosis', 5, false)
    );
    this.rebelAlliance = new RebelAlliance(rebelPlanets);
    this.empire = new Empire(empirePlanets, this.rebelAlliance);
    this.rebelAlliance.setup(true);
    this.empire.setup(false);
    this.endTurnSetup();
    new AllocationBar(this.rebelAlliance);
    new Message("initial");
  }

  endTurnSetup() {
    const _button = document.getElementById('turn-btn');
    _button.addEventListener('click', this.endTurnHandler.bind(this));
  }

  endTurnHandler() {
    this.rebelAlliance.totalFleetsPerTurn = 2;
    document.getElementById('turn-btn').disabled = false;
    // Deal with the amount of rebel fleets, food and gold and plans captured
    if (this.rebelAlliance.totalFoodPerTurn <= 0) {
      this.rebelAlliance.totalFleetsPerTurn += this.rebelAlliance.totalFoodPerTurn;
    }
    this.rebelAlliance.totalFleetsPerTurn += this.rebelAlliance.totalGoldPerTurn*0.5;
    if (this.rebelAlliance.totalFleetsPerTurn > 3) {
      this.rebelAlliance.totalFleetsPerTurn = 
        Math.floor(this.rebelAlliance.totalFleetsPerTurn);
    } else {
      this.rebelAlliance.totalFleetsPerTurn = 3;
    }

    document.getElementById('gold-counter').innerHTML = `
    Total gold per turn: ${this.rebelAlliance.totalGoldPerTurn}`;
    document.getElementById('food-counter').innerHTML = `
    Total food per turn: ${this.rebelAlliance.totalFoodPerTurn}`;
    document.getElementById('fleet-counter').innerHTML = `
    Rebel fleets per turn: ${this.rebelAlliance.totalFleetsPerTurn}`;

    /* Invade a planet with little troops, then destroy a planet using the 
    Death Star */
    let destroyNumber = Math.floor((Math.random() * this.rebelAlliance.size));
    this.empire.deathStar.destroy(this.rebelAlliance.planets[destroyNumber]);
    this.empire.deathStar.attack();

    // Check for victories
    if (this.empire.numberPlansFound == 3) {
      new Message("success");
      this.empire.deathStar.makeClickable(this.empire);
      document.getElementById('DeathStar').className = 'empire-planet-img';
    }

    // TODO: Rework this once the animation is finished
    function startRebelTurn(rebels) { 
      new AllocationBar(rebels);
      document.getElementById('turn-btn').disabled = false;
    }
    setTimeout(startRebelTurn, 3250, this.rebelAlliance);
  }

}
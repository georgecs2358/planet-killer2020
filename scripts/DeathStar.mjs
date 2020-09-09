import { Main } from './Main.mjs'
import { Planet } from './Planet.mjs'
import { Message } from './Message.mjs';

/***
  * Methods: clickHandler will call defend with the rebelAttackPlanet as the
  * invading planet. hoverHandler displays information in the correct position.
  * destroy will remove the inputted Rebel planet from the game
  * defend might remove planet from Empire's control.
***/
export class DeathStar extends Planet {

  constructor(name, enemy) {
    super(name);
    this.enemy = enemy;
    this.fleets = 10;
    this.hasAttacked = true;
  }

  clickHandler(empire) {
    this.defend(empire.enemy.attackingPlanet);
    empire.enemy.attackingPlanet = null;
  }

  hoverHandler() {
    document.getElementById('current-stats').innerHTML = `
    <img class="surface-img" src="${this.imageSurfacePathName}" 
    alt="${this.name} image">
    <div class="planet-stats">
    <p><u>The Death Star</u></p>
    <p>Fleets: ${this.fleets}</p>
    <p><em>That's no moon...</em></p>
    </div>
    `;
  }

  destroy(rebelPlanet) {
// 		const dsImageRect =	 document.getElementById('DeathStar')
// 			.getBoundingClientRect();
// 		const rpImageRect =	document.getElementById(rebelPlanet.name)
// 			.getBoundingClientRect();
// 		const initialX = dsImageRect.x + 0.5*dsImageRect.width;
// 		const initialY = dsImageRect.y - 0.3*dsImageRect.height;
// 		const targetX = rpImageRect.x - 0.5*rpImageRect.width;
// 		const targetY = rpImageRect.y - 0.5*rpImageRect.height;
		
    const _img = document.getElementById(rebelPlanet.name);
    _img.src="images/rocks.png";
    _img.className = "";
    _img.nextElementSibling.remove();
    this.enemy.removePlanet(rebelPlanet);
    rebelPlanet.removeHoverable();
    if (!(this.enemy.size)) {
      Main.endGame(false);
    }
    if (this.hasAttacked) {
      new Message("destroy", rebelPlanet, 0);
      this.hasAttacked = false;
    } else {
      new Message("destroy", rebelPlanet);
    }
  }

  attack() {
    let unguarded = this.enemy.planets.filter(planet => planet.fleets < 2);
    if (unguarded.length > 1) {
      unguarded.sort((a, b) => b.goldPerTurn - a.goldPerTurn);
    }
    if (this.fleets > 5) {
      this.fleets -= 2;
      this.hasAttacked = true;
      this.enemy.removePlanet(unguarded[0]);
      unguarded[0].fleets = 2;
      unguarded[0].goldPerTurn = 0;
      unguarded[0].foodPerTurn = 0;
      document.getElementById(`${unguarded[0].name}`)
        .className = "empire-planet-img";
    }
    
  }

  defend(attackingPlanet) {
    if (attackingPlanet === null) {
      new Message("prompt");
      return;
    }
    if (attackingPlanet.fleets > this.fleets) {
      document.getElementById('death-star-box').innerHTML =
      `<img src="images/rocks.png" alt="Planet rubble">`;
      Main.endGame(true);
    }
    if (attackingPlanet.fleets - this.fleets >= 0) {
      attackingPlanet.fleets -= this.fleets;
    } else {
      attackingPlanet.fleets = 0;
    }
    this.fleets = 0;
  }

}

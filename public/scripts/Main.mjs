import { Game } from './Game.mjs';

/***
 * Main class which is an entry and exit point to the Game. The only class
 * which is not instantiated, as only used at the beginning and end of the app.
 * Also used for playing the animation which pauses game and destroys a planet.
 * Methods: startGame causes the main button will instantiate Game
 *  endGame configures the correct ending screen
 *  endGameHandler simply refreshes the page
***/
export class Main {

  static startGame() {
    document.getElementById('main-btn').addEventListener(
      'click', this.startGameHandler
    );
  }

  static startGameHandler() {
    document.getElementById('start-window').style.display = 'none';
    document.getElementById('game-window').style.display = 'grid';
    new Game();
  }

  static endGame(isRebelVictory) {
    document.getElementById('game-window').style.display = 'none';
    document.getElementById('start-window').style.display = 'grid';
    const _newImage = document.createElement('img');
    _newImage.className = "main-img";

    if (isRebelVictory) {
      document.getElementById('instructions').innerHTML = `
      <h1 style="color:#00f">VICTORY</h1>
      <h2 id="outro">Congratulations General! We have destroyed the Death Star,
      this is a major victory for the Rebel Alliance, the Empire's tyranny
      will soon be over. The Jedi Order can be restored!</h2>
      <br><p style="padding-left:0px"> Thank you for playing :) For more stuff
      I have written check out my webpage: </p>
      <br><a href="https://georgejs97.github.io target="_blank">
      georgejs97.github.io</a>`;
      _newImage.src = "images/rebel-victory.jpeg";
      _newImage.style.boxShadow = "1px 5px 5px #00b";
    } else {
      document.getElementById('instructions').innerHTML = `
      <h1 style="color:#f00">DEFEAT</h1>
      <h2 id="outro">What is left of the Rebel Alliance must flee to the outer
      rim. The Empire has achieved Galactic Domination using the Death Star,
      the Alliance has been shattered...</h2>
      <br><p style="padding-left:0px"> Thank you for playing :) For more stuff
      I have written check out my webpage: </p>
      <br><a href="https://georgejs97.github.io" target="_blank">
      georgejs97.github.io</a>`;
      _newImage.src = "images/empire-victory.jpeg";
      _newImage.style.boxShadow = "1px 5px 5px #b00";
    }
    document.getElementById('instructions').style.overflowY = "hidden";
    document.getElementById('intro-image').replaceChild(
      _newImage, document.getElementById('destruction')
    );
    document.getElementById('main-btn').removeEventListener(
      'click', this.startGameHandler
    );
    document.getElementById('main-btn').textContent = "Play again";
    document.getElementById('main-btn').addEventListener(
      'click', this.endGameHandler
    );
  }

  static endGameHandler() {
    window.location.reload();
  }

}

Main.startGame();

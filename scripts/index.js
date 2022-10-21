const deck = [
  "./images/bobrossparrot.gif",
  "./images/explodyparrot.gif",
  "./images/fiestaparrot.gif",
  "./images/metalparrot.gif",
  "./images/revertitparrot.gif",
  "./images/tripletsparrot.gif",
  "./images/unicornparrot.gif"
];
const backFaceImg = "./images/back.png";
const altMsg = "parrot variation";
const delayView = 1000;
const clockTick = 1000;

function kevinRandom(arr) {
  const hash = {};
  const sorted = [];
  for (let i = 0; i < arr.length; i++) {
    hash[i] = arr[i];
  }
  let randomIndex;
  let hashLen = Object.keys(hash).length-1;
  for (let i = arr.length; i > 0; i--) {
    randomIndex = Math.floor(Math.random()*i);
    if (randomIndex === i)
      randomIndex = i-1;
    sorted.push(hash[randomIndex]);
    hash[randomIndex] = hash[hashLen--];
  }
  return sorted;
}

if (typeof Element.prototype.clearElementChildren === "undefined") {
  Object.defineProperty(Element.prototype, "clearElementChildren", {
    configurable: true,
    enumerable: false,
    value() {
      while(this.firstElementChild) {
        this.removeChild(this.lastElementChild);
      }
    }
  });
}

function delay(miliseconds) {
  return new Promise(resolve => {
    setTimeout(resolve, miliseconds);
  });
}

class ParrotsGame {
  constructor() {
    this.midPlay = false;
    this.tempi = 0;
    this.foundPairs = 0;
    this.clockID = 0;
    this.selected = undefined;
    this.startTime = undefined;
    let numCards = parseInt(prompt("Quantas cartas devem ser usadas? (número par entre 3 e 15)"));
    while ((numCards !== numCards) || numCards % 2 || numCards < 4 || numCards > 14) {
      numCards = parseInt(prompt("Escolha um número par no intervalo de 4 a 14, incluidos"));
    }
    this.numPairs = numCards/2;
    this.startPlaying();
  }

  startPlaying() {
    const pairs = deck.slice(0, this.numPairs);
    const cards = pairs.concat(pairs);
    const sortedCards = kevinRandom(cards);
    this.injectCards(sortedCards);
  }

  injectCards(cards) {
    cards.forEach(card => {
      const newCard = document.createElement("div");
      newCard.classList.add("card");
      newCard.innerHTML = `
        <div class="front-face face">
          <img draggable="false" src=${card} alt=${altMsg}>
        </div>
        <div class="back-face face">
          <img draggable="false" src=${backFaceImg} alt=${altMsg}>
        </div>
      `;
      const page = document.getElementById("page");
      page.appendChild(newCard);
      newCard.addEventListener("click", this.selectCard.bind(this));
    });
    this.startTime = (new Date()).getTime();
    this.clockID = setInterval(this.updateClock.bind(this), clockTick);
  }

  async selectCard(e) {
    if (this.midPlay) {
      return;
    }
    this.tempi++;
    if (!this.selected) {
      e.currentTarget.classList.add("selected");
      this.selected = e.currentTarget;
    } else if (this.selected !== e.currentTarget) {
      const showingFront = this.selected.firstElementChild.firstElementChild;
      const selectedFront = e.currentTarget.firstElementChild.firstElementChild;
      e.currentTarget.classList.add("selected");
      if (selectedFront.src === showingFront.src) {
        this.foundPairs++;
        this.selected = undefined;
        this.checkEndGame();
      } else {
        const cardSelected = e.currentTarget;
        const previouslySelected = this.selected;
        this.selected = undefined;
        this.midPlay = true;
        await delay(delayView);
        cardSelected.classList.remove("selected");
        previouslySelected.classList.remove("selected");
        this.midPlay = false;
      }
    }
  }

  checkEndGame() {
    if (this.foundPairs === this.numPairs) {
      const [ minutesPLayed, secondsPlayed ] = this.timeElapsed();
      let finalMsg = `Parabéns! Você completou o jogo em ${this.tempi} jogadas, gastando`;
      if (minutesPLayed) {
        finalMsg += ` ${minutesPLayed} minuto(s) e`;
      }
      finalMsg += ` ${secondsPlayed} segundos`;
      alert(finalMsg);
      clearInterval(this.clockID);
      this.askUserRestart();
    }
  }

  askUserRestart() {
    const tryAgain = confirm("Deseja reiniciar a partida?");
    if (tryAgain){
      const page = document.getElementById("page");
      page.clearElementChildren();
      main();
    }
  }

  updateClock() {
    const clock = document.getElementById("clock");
    const [ minutesPLayed, secondsPlayed ] = this.timeElapsed();
    clock.innerText = `${minutesPLayed.toString().padStart(2, "0")}:`+
                       `${secondsPlayed.toString().padStart(2, "0")}`;
  }

  timeElapsed() {
    const second = 1000; // 1000 miliseconds
    const minute = 60; // 60 seconds
    const playedTime = ((new Date()).getTime()-this.startTime)/second;
    return [Math.floor(playedTime/minute), Math.floor(playedTime%minute)];
  }
}

main();

function main() {
  new ParrotsGame();
}

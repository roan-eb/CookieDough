class Cookie {
    name = "";
    htmlElement = undefined;
    score = undefined;
    factor = 1;

    constructor(newName, newHTMLElement, newScore) {
        this.name = newName;
        this.htmlElement = newHTMLElement;
        this.htmlElement.onclick = this.onCookieClicked;
        this.score = newScore;
    }

    onCookieClicked = () => {
        this.score.onCookieClicked(this.factor);
    }

    onStyleChangeChocolate() {
        this.htmlElement.classList.add("cookie--chocolate");
    }

    onStyleChangeVelvet() {
        this.htmlElement.classList.add("cookie--velvet");
    }
}

class Score {
    score;
    name = "";
    htmlElement = undefined;

    constructor(newScore, newName, newHTMLElement) {
        this.score = newScore;
        this.name = newName;
        this.htmlElement = newHTMLElement;
        this.htmlElement.innerText = newScore;
    }

    onCookieClicked(factorFromCookie) {
        this.score = this.score + factorFromCookie;
        this.htmlElement.innerText = this.score;
    }

    subtractScore() {
        this.score = this.score - 100;
        this.htmlElement.innerText = this.score;
    }

    onAutoScoreClicked() {
        setInterval(() => {
            this.score = this.score + 500;
            this.htmlElement.innerText = this.score;
        }, 10000)
    }

    addPoints() {
        this.score = this.score + 10000;
        this.htmlElement.innerText = this.score;
    }

    scoreLoaded(newScore){
        this.score = newScore;
        this.htmlElement.innerText = this.score;
    }
}

class Multiplier {
    factor = 100;
    htmlElement = undefined;
    cookie = undefined;
    bought = false;

    constructor(htmlElement, cookie) {
        this.htmlElement = htmlElement;
        this.cookie = cookie;
        this.htmlElement.onclick = this.onMultiplierClicked;
    }

    onMultiplierClicked = () => {
        if (this.bought === false) {
            this.bought = true;
            this.cookie.score.subtractScore();
            this.cookie.factor = this.factor;
            this.cookie.factor = 100;
        }
    }
}

class AutoScore {
    htmlElement = undefined;
    score = undefined;
    bought = false;

    constructor(htmlElement, score) {
        this.htmlElement = htmlElement;
        this.score = score;
        this.htmlElement.onclick = this.onAutoScoreClicked;
    }

    onAutoScoreClicked = () => {
        if (this.bought === false) {
            this.bought = true;
            this.score.subtractScore();
            this.score.onAutoScoreClicked();
        }
    }
}

class ChocolateCookie {
    htmlElement = undefined;
    bought = false;
    cookie = undefined;

    constructor(htmlElement, cookie) {
        this.htmlElement = htmlElement;
        this.cookie = cookie;
        this.htmlElement.onclick = this.onChocolateCookieClicked;
    }

    onChocolateCookieClicked = () => {
        if (this.bought === false && window.localStorage.getItem("ChocolateCookie") !== "true") {
            this.bought = true;
            window.localStorage.setItem("ChocolateCookie", this.bought);
            this.cookie.score.addPoints();
        }

        this.cookie.onStyleChangeChocolate();

    }

}

class VelvetCookie {
    htmlElement = undefined;
    bought = false;
    cookie = undefined;

    constructor(htmlElement, cookie) {
        this.htmlElement = htmlElement;
        this.cookie = cookie;
        this.htmlElement.onclick = this.onVelvetCookieClicked;
    }

    onVelvetCookieClicked = () => {
        if (this.bought === false && window.localStorage.getItem("VelvetCookie") !== "true") {
            this.bought = true;
            window.localStorage.setItem("VelvetCookie", this.bought);
            this.cookie.score.addPoints();
        }

        this.cookie.onStyleChangeVelvet();

    }

}

class Save {
    htmlElement;
    auto;
    multiplier;

    constructor(newHTMLElement, auto, multiplier){
        this.htmlElement = newHTMLElement;
        this.auto = auto;
        this.multiplier = multiplier;
        this.htmlElement.onclick = this.onSaveButtonClicked;
    }

    onSaveButtonClicked = () => {
        window.localStorage.setItem("score", score.score);
        window.localStorage.setItem("autoScore", this.auto.bought);
        window.localStorage.setItem("multiplier", this.multiplier.bought);
    }
}

class Load{
    score;
    autoScore;
    multiplier;

    constructor(score, autoScore, multiplier, cookie){
        this.score = score;
        this.autoScore = autoScore;
        this.multiplier = multiplier;
        this.cookie = cookie;
        this.onLoad();
    }

    onLoad = function(){
        const scoreFromLocalStorage = window.localStorage.getItem("score");
        const autoScoreFromLocalStorage = window.localStorage.getItem("autoScore");
        const multiplierFromLocalStorage = window.localStorage.getItem("multiplier");

        if(scoreFromLocalStorage !== null && scoreFromLocalStorage !== "false"){
            this.score.scoreLoaded(parseInt(scoreFromLocalStorage));
        }
        if(autoScoreFromLocalStorage !== null && autoScoreFromLocalStorage !== "false"){
            this.autoScore.bought = true;
            this.score.onAutoScoreClicked();
        }
        if(multiplierFromLocalStorage !== null && multiplierFromLocalStorage !== "false"){
            this.multiplier.bought = true;
            this.cookie.factor = 100;
        }

    }
}

/* setup for score and cookie */
const score = new Score(0, "Default Score", document.getElementById("js--score"));
const cookie = new Cookie("Default Cookie", document.getElementById("js--cookie"), score);

/* setup for desktop upgrades */
const multiplier = new Multiplier(document.getElementById("js--multiplier"), cookie);
const auto = new AutoScore(document.getElementById("js--autoScore"), score);
const chocolate = new ChocolateCookie(document.getElementById("js--chocolate"), cookie);
const velvet = new VelvetCookie(document.getElementById("js--velvet"), cookie);
const save = new Save(document.getElementById("js--save"), auto, multiplier);
const load = new Load(score, auto, multiplier, cookie); 

/* setup for mobile upgrades */
const multiplierMobile = new Multiplier(document.getElementById("js--multiplier--mobile"), cookie);
const autoMobile = new AutoScore(document.getElementById("js--autoScore--mobile"), score);
const chocolateMobile = new ChocolateCookie(document.getElementById("js--chocolate--mobile"), cookie);
const velvetMobile = new VelvetCookie(document.getElementById("js--velvet--mobile"), cookie);
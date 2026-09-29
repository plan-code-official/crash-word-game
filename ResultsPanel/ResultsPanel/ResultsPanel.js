import './ResultsPanel.css';
import panelFrame from './assets/banal.png';
import celebrationTitle from './assets/good.png';
import coinsImage from './assets/money.png';
import correctImage from './assets/right.png';
import wrongImage from './assets/wrong.png';
import exitButtonImage from '../../src/assets/Exit.png';
import retryButtonImage from '../../src/assets/Retry.png';

const numberValue = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : 0;
};

export class ResultsPanel {
  constructor(root, options = {}) {
    this.root = root;
    this.onRetry = options.onRetry;
    this.onBack = options.onBack;
    this.#build();
  }

  #build() {
    this.el = document.createElement("div");
    this.el.className = "results-overlay";

    const screen = document.createElement("section");
    screen.className = "results-screen";
    screen.setAttribute("aria-label", "نتائج اللعبة");

    // Sci-Fi Frame Container
    const panel = document.createElement("div");
    panel.className = "results-panel";
    panel.style.setProperty("--results-panel-image", `url(${panelFrame})`);
    const panelFrameImg = document.createElement("img");
    panelFrameImg.className = "results-panel__frame";
    panelFrameImg.src = panelFrame;
    panelFrameImg.alt = "";
    panelFrameImg.setAttribute("aria-hidden", "true");
    panel.append(panelFrameImg);

    const content = document.createElement("div");
    content.className = "results-panel__content";

    // Zone 1: Success Image OR Red Fail Text
    this.titleImg = document.createElement("img");
    this.titleImg.className = "results-panel__title";
    this.titleImg.src = celebrationTitle;
    this.titleImg.alt = "أحسنت";

    this.failTitle = document.createElement("div");
    this.failTitle.className = "results-panel__fail-title";
    this.failTitle.textContent = "حاول مرة أخرى!";
    this.failTitle.style.display = "none";

    // Zone 2: 3 Stat Cards (LTR)
    const stats = document.createElement("div");
    stats.className = "results-stats";

    // 1. Correct Answers
    const correctCard = document.createElement("div");
    correctCard.className = "results-stat-card results-stat-card--correct";
    const correctImg = document.createElement("img");
    correctImg.src = correctImage;
    correctImg.alt = "إجابات صحيحة";
    this.correctText = document.createElement("strong");
    correctCard.append(correctImg, this.correctText);

    // 2. Earned Coins
    const coinsCard = document.createElement("div");
    coinsCard.className = "results-stat-card results-stat-card--coins";
    const coinsImg = document.createElement("img");
    coinsImg.src = coinsImage;
    coinsImg.alt = "عملات مكتسبة";
    this.coinsText = document.createElement("strong");
    const coinsLabel = document.createElement("span");
    coinsLabel.textContent = "فِلُوس";
    coinsCard.append(coinsImg, this.coinsText, coinsLabel);

    // 3. Wrong Answers
    const wrongCard = document.createElement("div");
    wrongCard.className = "results-stat-card results-stat-card--wrong";
    const wrongImg = document.createElement("img");
    wrongImg.src = wrongImage;
    wrongImg.alt = "إجابات خاطئة";
    this.wrongText = document.createElement("strong");
    wrongCard.append(wrongImg, this.wrongText);

    stats.append(correctCard, coinsCard, wrongCard);
    content.append(this.titleImg, this.failTitle, stats);
    panel.append(content);

    // Zone 3: Bottom Action Buttons (RTL: Exit Right, Retry Left)
    const actions = document.createElement("div");
    actions.className = "results-actions";

    const backBtn = document.createElement("button");
    backBtn.className = "results-action results-action--back";
    backBtn.type = "button";
    backBtn.setAttribute("aria-label", "خروج");
    backBtn.onclick = () => { if (this.onBack) this.onBack(); };
    const backBtnImg = document.createElement("img");
    backBtnImg.className = "results-action__bg";
    backBtnImg.src = exitButtonImage;
    backBtnImg.alt = "خروج";

    backBtn.append(backBtnImg);

    const retryBtn = document.createElement("button");
    retryBtn.className = "results-action results-action--retry";
    retryBtn.type = "button";
    retryBtn.setAttribute("aria-label", "إعادة المحاولة");
    retryBtn.onclick = () => { if (this.onRetry) this.onRetry(); };
    const retryBtnImg = document.createElement("img");
    retryBtnImg.className = "results-action__bg";
    retryBtnImg.src = retryButtonImage;
    retryBtnImg.alt = "إعادة المحاولة";

    retryBtn.append(retryBtnImg);

    actions.append(backBtn, retryBtn);
    screen.append(panel, actions);
    this.el.append(screen);
  }

  show(data = {}) {
    const correct = numberValue(data.correctAnswers);
    const wrong = numberValue(data.wrongAnswers);
    const earnedCoins = numberValue(data.coins);

    this.correctText.textContent = correct;
    this.wrongText.textContent = wrong;
    this.coinsText.textContent = `+${earnedCoins}`;

    const totalAnswers = correct + wrong;
    if (totalAnswers > 0 && correct / totalAnswers >= 0.5) {
      this.titleImg.style.display = "block";
      this.failTitle.style.display = "none";
    } else {
      this.titleImg.style.display = "none";
      this.failTitle.style.display = "block";
    }

    this.root.appendChild(this.el);
  }

  hide() {
    this.el.remove();
  }
}

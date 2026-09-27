import './ResultsPanel.css';
import panelFrame from './assets/banal.png';
import celebrationTitle from './assets/good.png';
import coinsImage from './assets/money.png';
import correctImage from './assets/right.png';
import wrongImage from './assets/wrong.png';
import buttonFrame from './assets/boutton.png';
import exitBtnIcon from '../../src/assets/ExitButton.svg';
import retryBtnIcon from '../../src/assets/retry.png';

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
    screen.dir = "rtl";

    const panel = document.createElement("div");
    panel.className = "results-panel";
    panel.style.setProperty("--results-panel-image", `url(${panelFrame})`);

    const content = document.createElement("div");
    content.className = "results-panel__content";

    const titleImg = document.createElement("img");
    titleImg.className = "results-panel__title";
    titleImg.src = celebrationTitle;
    titleImg.alt = "أحسنت";


    const stats = document.createElement("div");
    stats.className = "results-stats";
    stats.setAttribute("aria-label", "إحصاءات الأداء");

    const correctCard = document.createElement("div");
    correctCard.className = "results-stat-card results-stat-card--correct";
    const correctImg = document.createElement("img");
    correctImg.src = correctImage;
    correctImg.alt = "إجابات صحيحة";
    this.correctText = document.createElement("strong");
    correctCard.append(correctImg, this.correctText);

    const coinsCard = document.createElement("div");
    coinsCard.className = "results-stat-card results-stat-card--coins";
    const coinsImg = document.createElement("img");
    coinsImg.src = coinsImage;
    coinsImg.alt = "عملات مكتسبة";
    this.coinsText = document.createElement("strong");
    const coinsLabel = document.createElement("span");
    coinsLabel.textContent = "فِلُوس";
    coinsCard.append(coinsImg, this.coinsText, coinsLabel);

    stats.append(correctCard, coinsCard);
    content.append(titleImg, stats);
    panel.append(content);

    const actions = document.createElement("div");
    actions.className = "results-actions";

    const backBtn = document.createElement("button");
    backBtn.className = "results-action results-action--back";
    backBtn.type = "button";
    backBtn.onclick = () => { if (this.onBack) this.onBack(); };
    const backBtnImg = document.createElement("img");
    backBtnImg.className = "results-action-bg";
    backBtnImg.src = buttonFrame;
    backBtnImg.alt = "";
    backBtnImg.setAttribute("aria-hidden", "true");
    const backGrp = document.createElement("span");
    backGrp.className = "results-action__group";
    const backTxt = document.createElement("span");
    backTxt.textContent = "خروج";
    const backIcon = document.createElement("img");
    backIcon.className = "results-action__exit-icon";
    backIcon.src = exitBtnIcon;
    backIcon.style.height = "22px";
    backIcon.style.marginRight = "8px";
    backIcon.style.position = "relative";
    backGrp.append(backTxt, backIcon);
    backBtn.append(backBtnImg, backGrp);

    const retryBtn = document.createElement("button");
    retryBtn.className = "results-action results-action--retry";
    retryBtn.type = "button";
    retryBtn.onclick = () => { if (this.onRetry) this.onRetry(); };
    const retryBtnImg = document.createElement("img");
    retryBtnImg.className = "results-action-bg";
    retryBtnImg.src = buttonFrame;
    retryBtnImg.alt = "";
    retryBtnImg.setAttribute("aria-hidden", "true");
    const retryIcon = document.createElement("img");
    retryIcon.src = retryBtnIcon;
    retryIcon.style.height = "26px";
    retryIcon.style.position = "relative";
    const retryTxt = document.createElement("span");
    retryTxt.textContent = "ثانِيَةً";
    retryTxt.style.marginRight = "8px";
    retryBtn.append(retryBtnImg, retryIcon, retryTxt);

    actions.append(backBtn, retryBtn);
    screen.append(panel, actions);
    this.el.append(screen);
  }

  show(data = {}) {
    const correct = numberValue(data.correctAnswers);
    const earnedCoins = numberValue(data.coins);

    this.correctText.textContent = correct;
    this.coinsText.textContent = `+${earnedCoins}`;

    this.root.appendChild(this.el);
  }

  hide() {
    this.el.remove();
  }
}

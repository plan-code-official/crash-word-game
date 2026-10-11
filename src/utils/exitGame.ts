/**
 * Single source of truth for leaving the game.
 * Used by the welcome screen, the in-game exit button, the error screens
 * and the results panel so they all behave identically.
 */
export const exitGame = (): void => {
  // If the user came from the portal, trigger the browser's native "Back"
  if (window.history.length > 1) {
    window.history.back();
  } else {
    // Opened directly in a new tab: fall back to the root domain
    window.location.href = '/';
  }
};

import Sentiment from "sentiment";
const sentiment = new Sentiment();

/**
 * Detects emotion from a given text message using sentiment analysis.
 * @param {string} message - The text message to analyze.
 * @returns {string} - Detected emotion (Happy, Angry, Neutral).
 */
export const detectEmotion = (message) => {
    const analysis = sentiment.analyze(message);
    const score = analysis.score;

    if (score > 0) return "Happy 😊";
    if (score < 0) return "Angry 😠";
    return "Neutral 😐";
};

import properties from "@/properties";
import Logger from "js-logger";

const logger = Logger.get("logger");
export default {
  async saveRating(rating) {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(rating),
    };
    try {
      return await fetch(
        `${properties.VISITS_SERVER_URL}/visitor/rating`,
        options
      );
    } catch (err) {
      logger.error("Error saving entity", rating);
      throw err;
    }
  },
  async saveVisit() {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    };
    try {
      return await fetch(`${properties.VISITS_SERVER_URL}/visitor/`, options);
    } catch (err) {
      logger.error("Error saving visitor");
      throw err;
    }
  },
};

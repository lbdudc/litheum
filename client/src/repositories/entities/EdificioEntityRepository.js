import { HTTP } from "@/common/http-common";
import Logger from "js-logger";
import properties from "@/properties";

const logger = Logger.get("logger");
const RESOURCE_NAME = "entities/edificios";
const GEOMETRIES_ROUTE = "geometries";

export default {
  async getAll(options = {}) {
    try {
      return (await HTTP.get(`${RESOURCE_NAME}`, options)).data;
    } catch (err) {
      logger.error("Error fetching all", options);
      throw err;
    }
  },

  async getAllWithout(entityName) {
    try {
      return (await HTTP.get(`${RESOURCE_NAME}/without/${entityName}`)).data;
    } catch (err) {
      logger.error("Error fetching all without " + entityName);
      throw err;
    }
  },

  async get(id) {
    try {
      return (await HTTP.get(`${RESOURCE_NAME}/${id}`)).data;
    } catch (err) {
      logger.error("Error fetching entity with id " + id);
      throw err;
    }
  },

  async getGeom(geomName) {
    try {
      return Promise.resolve([]);
      //const response = (await HTTP.get(`${GEOMETRIES_ROUTE}/${geomName}`)).data;
      //return response || [];
    } catch (err) {
      logger.error("Error getting geometry " + geomName);
      throw err;
    }
  },

  async getData(options = {}) {
    try {
      return (await HTTP.get(`${RESOURCE_NAME}/data`, options)).data;
    } catch (err) {
      logger.error("Error fetching all", options);
      throw err;
    }
  },

  async getGraphicsData(refCat) {
    const options = {
      method: "GET",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    };
    try {
      const response = await fetch(
        `${properties.FLASK_SERVER_URL}/recalc/edificios/${refCat}/graphs`,
        options
      );
      return await response.json();
    } catch (err) {
      logger.error("Error on energetic demand recal", newVals);
      throw err;
    }
  },

  async save(entity) {
    if (entity.id) {
      try {
        return (await HTTP.put(`${RESOURCE_NAME}/${entity.id}`, entity)).data;
      } catch (err) {
        logger.error("Error updating entity", entity);
        throw err;
      }
    } else {
      try {
        return (await HTTP.post(`${RESOURCE_NAME}`, entity)).data;
      } catch (err) {
        logger.error("Error saving entity", entity);
        throw err;
      }
    }
  },

  async delete(id) {
    try {
      return await HTTP.delete(`${RESOURCE_NAME}/${id}`);
    } catch (err) {
      logger.error("Error deleting entity with id " + id);
      throw err;
    }
  },

  async getDataFromItem(id) {
    try {
      return await HTTP.get(`${RESOURCE_NAME}/${id}/data`);
    } catch (err) {
      logger.error("Error fetching entity with id " + id);
      throw err;
    }
  },

  async getMaxBounds() {
    try {
      return (await HTTP.get(`${RESOURCE_NAME}/maxBounds`)).data;
    } catch (err) {
      logger.error("Error fetching max bounds");
      throw err;
    }
  },

  async getIntervalValues(options = {}) {
    try {
      return (await HTTP.get(`${RESOURCE_NAME}/intervals`, options)).data;
    } catch (err) {
      logger.error("Error fetching intervals values");
      throw err;
    }
  },

  async recalcGeomData(newVals) {
    const options = {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newVals),
    };
    try {
      const response = await fetch(
        `${properties.FLASK_SERVER_URL}/recalc/edificios`,
        options
      );
      return await response.json();
    } catch (err) {
      logger.error("Error on energetic demand recal", newVals);
      throw err;
    }
  },

  async getRadiationGraphData(refCat) {
    try {
      return (await HTTP.get(`${RESOURCE_NAME}/${refCat}/radiation`)).data;
    } catch (err) {
      logger.error("Error on get radiation graph data", newVals);
      throw err;
    }
  },

  async getDemandGaphData(refCat) {
    try {
      return (await HTTP.get(`${RESOURCE_NAME}/${refCat}/demand`)).data;
    } catch (err) {
      logger.error("Error on get demand graph data", newVals);
      throw err;
    }
  },
};

import { apiGet } from "./api";

export const serviceService = {
  getBanners: () => {
    return apiGet("/banner");
  },

  getServices: () => {
    return apiGet("/services");
  },
};

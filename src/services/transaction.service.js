import { apiGet, apiPost } from "./api";

export const transactionService = {
  getTransactionHistory: () => {
    return apiGet("/transaction/history");
  },

  payment: (serviceCode) => {
    return apiPost("/transaction", { service_code: serviceCode });
  },
};

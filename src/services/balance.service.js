import { apiGet, apiPost } from "./api";

export const balanceService = {
  getBalance: () => {
    return apiGet("/balance");
  },

  topUp: (amount) => {
    return apiPost("/topup", { top_up_amount: amount });
  },
};

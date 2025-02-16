import { apiGet, apiPost, apiPut } from "./api";

export const authService = {
  login: (data) => {
    return apiPost("/login", {
      email: data.email,
      password: data.password,
    });
  },

  register: (data) => {
    return apiPost(
      "/registration",
      {
        email: data.email,
        first_name: data.firstName,
        last_name: data.lastName,
        password: data.password,
      },
      {
        referrer: "https://api-doc-tht.nutech-integrasi.com/",
      }
    );
  },

  getProfile: () => {
    return apiGet("/profile");
  },

  updateProfile: (data) => {
    return apiPut("/profile/update", {
      first_name: data.firstName,
      last_name: data.lastName,
    });
  },

  updateImage: (data) => {
    const formData = new FormData();
    formData.append("file", data.file);

    return apiPut("/profile/image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
};

export const API_BASE_URL = "http://localhost:5001"; // Base URL for the API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GET_USER_INFO: "/api/v1/auth/getUser",
  },
  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard/get",
  },
  INCOME: {
    ADD_INCOME: "/api/v1/income/add",
    GET_INCOME: "/api/v1/income/get",
    UPDATE_INCOME: (incomeId) => `/api/v1/income/update/${incomeId}`,
    DELETE_INCOME: (incomeId) => `/api/v1/income/delete/${incomeId}`,
    DOWNLOAD_iNCOME: "/api/v1/income/downloadexcel",
  },
  EXPENSE: {
    ADD_EXPENSE: "/api/v1/expense/add",
    GET_EXPENSE: "/api/v1/expense/get",
    UPDATE_EXPENSE: (expenseId) => `/api/v1/expense/update/${expenseId}`,
    DELETE_EXPENSE: (expenseId) => `/api/v1/expense/delete/${expenseId}`,
    DOWNLOAD_EXPENSE: "/api/v1/expense/downloadexcel",
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/auth/uploadImage",
  },
};


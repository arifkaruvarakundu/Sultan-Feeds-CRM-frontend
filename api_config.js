let API_BASE_URL;

if (process.env.NODE_ENV === "production") {
  API_BASE_URL = "https://app.souqalsultan.com";
} else {
  API_BASE_URL = "http://localhost:8000";
}

export default API_BASE_URL;

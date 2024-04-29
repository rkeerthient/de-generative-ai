import { Environment } from "@yext/search-headless-react";

const searchConfig = {
  apiKey: import.meta.env.YEXT_PUBLIC_API_KEY,
  experienceKey: import.meta.env.YEXT_PUBLIC_EXP_KEY,
  locale: "en",
  environment:
    import.meta.env.YEXT_PUBLIC_ACCOUNTTYPE === "PROD"
      ? Environment.PROD
      : Environment.SANDBOX,
};

export default searchConfig;

import dotenv from "dotenv";

dotenv.config();

export const {
  PORT,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  ROLE_ARN,
  API_DESTINATION_ARN,
  AWS_REGION,
} = process.env;

if (!PORT) {
  throw new Error("PORT is not set");
}

if (!AWS_ACCESS_KEY_ID) {
  throw new Error("AWS_ACCESS_KEY_ID is not set");
}

if (!AWS_SECRET_ACCESS_KEY) {
  throw new Error("AWS_SECRET_ACCESS_KEY is not set");
}

if (!ROLE_ARN) {
  throw new Error("ROLE_ARN is not set");
}

if (!API_DESTINATION_ARN) {
  throw new Error("API_DESTINATION_ARN is not set");
}

if (!AWS_REGION) {
  throw new Error("AWS_REGION is not set");
}

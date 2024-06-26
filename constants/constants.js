// NEXT_PUBLIC_ENVIRONMENT= development ｜ production
const API_DOMAIN =
  process.env.NEXT_PUBLIC_ENVIRONMENT == "production"
    ? "http://159.13.33.0/v1" //"https://api.bluestone.one/v1"
    : "http://localhost:3005/v1";

const ZERO_BYTES32 =
  "0x0000000000000000000000000000000000000000000000000000000000000000";

module.exports = {
  API_DOMAIN,
  ZERO_BYTES32,
};

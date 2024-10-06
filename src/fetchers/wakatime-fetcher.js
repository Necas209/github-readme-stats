import axios from "axios";
import { CustomError, MissingParamError } from "../common/utils.js";

/**
 * WakaTime data fetcher.
 *
 * @param {{username: string, api_domain: string }} props Fetcher props.
 * @returns {Promise<WakaTimeData>} WakaTime data response.
 */
const fetchWakatimeStats = async ({ username, api_domain }) => {
  if (!username) {
    throw new MissingParamError(["username"]);
  }

  const allowedDomains = ["wakatime.com", "another-allowed-domain.com"];
  const sanitizedUsername = encodeURIComponent(username);
  const domain = api_domain ? api_domain.replace(/\/$/gi, "") : "wakatime.com";
  
  if (!allowedDomains.includes(domain)) {
    throw new CustomError(`Invalid API domain: ${domain}`, "INVALID_API_DOMAIN");
  }
  
  try {
    const { data } = await axios.get(
      `https://${domain}/api/v1/users/${sanitizedUsername}/stats?is_including_today=true`,
    );

    return data.data;
  } catch (err) {
    if (err.response.status < 200 || err.response.status > 299) {
      throw new CustomError(
        `Could not resolve to a User with the login of '${username}'`,
        "WAKATIME_USER_NOT_FOUND",
      );
    }
    throw err;
  }
};

export { fetchWakatimeStats };
export default fetchWakatimeStats;

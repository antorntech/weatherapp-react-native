import axios from "axios";
import { apikey } from "../constants";

const foreCastEndpoint = (
  params
) => `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${params.city}&days=${params.days}&aqi=no&alerts=no
`;
const locationEndpoint = (params) =>
  `https://api.weatherapi.com/v1/search.json?key=${apikey}&q=${params.city}`;

const apiCall = async (endpoint) => {
  const options = {
    method: "GET",
    url: endpoint,
  };

  try {
    const response = await axios.request(options);
    return response.data;
  } catch (error) {
    console.log("Error", error);
    return null;
  }
};
export const getWeather = async (params) => {
  return apiCall(foreCastEndpoint(params));
};
export const getLocation = async (params) => {
  return apiCall(locationEndpoint(params));
};

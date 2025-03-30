// services/api/services/geo.ts
import useFetch from "@/services/api/use-fetch";
import { API_URL } from "@/services/api/config";

export type City = {
  id: number;
  name: string;
};

export type Province = {
  id: number;
  name: string;
  cities: City[];
};

export const useGetProvincesWithCitiesService = () => {
  const fetchBase = useFetch();

  return async (): Promise<Province[]> => {
    const response = await fetchBase(`${API_URL}/geo/provinces-with-cities`, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch provinces with cities");
    }

    return await response.json();
  };
};

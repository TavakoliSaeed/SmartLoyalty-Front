// services/api/services/gifts.ts

import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { RequestConfigType } from "./types/request-config";

export type Gift = {
  ID: number;
  Code: string;
  Name: string;
  RequiredScore: number;
};

export type GiftRequestData = {
  gift_id: number;
};

export type GiftRequestResponse = {
  code: number;
  error: string;
};

export function useRequestNewGiftService() {
  const fetchBase = useFetch();

  return useCallback(
    (data: GiftRequestData, requestConfig?: RequestConfigType) => {
      return fetchBase(`${API_URL}/gift/request`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<GiftRequestResponse>);
    },
    [fetchBase]
  );
}

export function useGetGiftsService() {
  const fetchBase = useFetch();

  return useCallback(() => {
    return fetchBase(`${API_URL}/gift`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    }).then(wrapperFetchJsonResponse<Gift[]>);
  }, [fetchBase]);
}

export type MyGiftRequest = {
  ID: number;
  GiftID: number;
  GiftCode: string;
  FinalSellerID: number;
  Status: "pending" | "approved" | "rejected";
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
};

export function useGetMyGiftRequestsService() {
  const fetchBase = useFetch();

  return useCallback(() => {
    return fetchBase(`${API_URL}/gift/requests/my`, {
      method: "GET",
    }).then(wrapperFetchJsonResponse<MyGiftRequest[]>);
  }, [fetchBase]);
}

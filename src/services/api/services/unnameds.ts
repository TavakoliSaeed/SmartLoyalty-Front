import { useCallback } from "react";
import useFetch from "../use-fetch";
import { API_URL } from "../config";
import wrapperFetchJsonResponse from "../wrapper-fetch-json-response";
import { InfinityPaginationType } from "../types/infinity-pagination";
import { RequestConfigType } from "./types/request-config";
import { unnamed as Entity } from "../types/unnamed";

export type GetunnamedsRequest = {
  page: number;
  limit: number;
};

export type GetunnamedsResponse = InfinityPaginationType<Entity>;

export function useGetunnamedsService() {
  const fetch = useFetch();

  return useCallback(
    (data: GetunnamedsRequest, requestConfig?: RequestConfigType) => {
      const requestUrl = new URL(`${API_URL}/v1/unnameds`);
      requestUrl.searchParams.append("page", data.page.toString());
      requestUrl.searchParams.append("limit", data.limit.toString());

      return fetch(requestUrl, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<GetunnamedsResponse>);
    },
    [fetch]
  );
}

export type GetunnamedRequest = {
  id: Entity["id"];
};

export type GetunnamedResponse = Entity;

export function useGetunnamedService() {
  const fetch = useFetch();

  return useCallback(
    (data: GetunnamedRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/unnameds/${data.id}`, {
        method: "GET",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<GetunnamedResponse>);
    },
    [fetch]
  );
}

export type CreateunnamedRequest = Omit<
  Entity,
  "id" | "createdAt" | "updatedAt"
>;

export type CreateunnamedResponse = Entity;

export function useCreateunnamedService() {
  const fetch = useFetch();

  return useCallback(
    (data: CreateunnamedRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/unnameds`, {
        method: "POST",
        body: JSON.stringify(data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<CreateunnamedResponse>);
    },
    [fetch]
  );
}

export type EditunnamedRequest = {
  id: Entity["id"];
  data: Partial<Omit<Entity, "id" | "createdAt" | "updatedAt">>;
};

export type EditunnamedResponse = Entity;

export function useEditunnamedService() {
  const fetch = useFetch();

  return useCallback(
    (data: EditunnamedRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/unnameds/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(data.data),
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<EditunnamedResponse>);
    },
    [fetch]
  );
}

export type DeleteunnamedRequest = {
  id: Entity["id"];
};

export type DeleteunnamedResponse = undefined;

export function useDeleteunnamedService() {
  const fetch = useFetch();

  return useCallback(
    (data: DeleteunnamedRequest, requestConfig?: RequestConfigType) => {
      return fetch(`${API_URL}/v1/unnameds/${data.id}`, {
        method: "DELETE",
        ...requestConfig,
      }).then(wrapperFetchJsonResponse<DeleteunnamedResponse>);
    },
    [fetch]
  );
}

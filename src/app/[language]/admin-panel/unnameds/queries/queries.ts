"use client";

import HTTP_CODES_ENUM from "@/services/api/types/http-codes";
import { createQueryKeys } from "@/services/react-query/query-key-factory";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  GetunnamedRequest,
  useGetunnamedService,
  useGetunnamedsService,
} from "@/services/api/services/unnameds";

export const unnamedsQueryKeys = createQueryKeys(["unnameds"], {
  list: () => ({
    key: [],
  }),
  byId: (id: string) => ({
    key: [id],
  }),
});

export const useGetunnamedsQuery = () => {
  const fetch = useGetunnamedsService();

  const query = useInfiniteQuery({
    queryKey: unnamedsQueryKeys.list().key,
    initialPageParam: 1,
    queryFn: async ({ pageParam, signal }) => {
      const { status, data } = await fetch(
        {
          page: pageParam,
          limit: 10,
        },
        {
          signal,
        }
      );

      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data: data.data,
          nextPage: data.hasNextPage ? pageParam + 1 : undefined,
        };
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage;
    },
  });

  return query;
};

export const useGetunnamedQuery = ({ id }: GetunnamedRequest) => {
  const fetch = useGetunnamedService();

  return useQuery({
    queryKey: unnamedsQueryKeys.byId(id).key,
    queryFn: async ({ signal }) => {
      const { status, data } = await fetch(
        {
          id,
        },
        {
          signal,
        }
      );

      if (status === HTTP_CODES_ENUM.OK) {
        return {
          data,
        };
      }
    },
  });
};

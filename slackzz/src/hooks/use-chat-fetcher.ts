import { useSocket } from "@/providers/web-socket";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { MessageWithUser } from "@/types/app";

type CahtFetcherProps = {
  queryKey: string;
  apiUrl: string;
  paramKey: "channelId" | "recipientId";
  paramValue: string;
  pageSize: number;
};

export const useChatFetcher = ({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
  pageSize,
}: CahtFetcherProps) => {
  const { isConnected } = useSocket();

  const fetcher = async ({
    pageParam = 0,
  }: any): Promise<{ data: MessageWithUser[] }> => {
    const url = 
    `${apiUrl}?${paramKey}=${encodeURIComponent(paramValue)}&page=${pageParam}&size=${pageSize}`;

    {/** 发送http请求获取url数据 */}
    const { data } = await axios.get<MessageWithUser>(url);

    return data as any;
  };

  {/** 
    使用useInfiniteQuery hook 获取数据 
    queryKey: [queryKey, paramValue] 查询键
    queryFn: fetcher 获取数据函数
    getNextPageParam: (lastPage, allPages) => lastPage.data.length === pageSize ? allPages.length : undefined 获取下一页参数
    initialPageParam: 0 初始页参数
    retry: 3 重试次数
    refetchInterval: isConnected ? false : 1000 重试间隔
    enabled: isConnected 是否启用
    staleTime: 1000 * 60 * 5 数据过期时间
    refetchOnWindowFocus: true 窗口聚焦时重试
    refetchOnReconnect: true 重连时重试
    */}

  return useInfiniteQuery<{ data: MessageWithUser[] }, Error>({
    queryKey: [queryKey, paramValue],
    queryFn: fetcher,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.length === pageSize ? allPages.length : undefined,
    initialPageParam: 0,
    retry: 3,
    refetchInterval: isConnected ? false : 1000,
    enabled: true,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

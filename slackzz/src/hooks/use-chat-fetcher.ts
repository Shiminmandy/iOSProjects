
import { useSocket } from "@/providers/web-socket";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { MessageWithUser } from "@/types/app";

type CahtFetcherProps = {
    queryKey:string;
    apiUrl:string;
    paramKey:'channelId' | 'recipientId';
    paramValue:string;
    pageSize:number;

}

export const useChatFetcher = ({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
    pageSize,
}: CahtFetcherProps) => {
    const {isConnected} = useSocket();

    const fetcher = async ({pageParam = 0}: any) : Promise<{ data: MessageWithUser[]} >=> {

        const url = `${apiUrl}?${paramKey}=${encodeURIComponent(
            paramValue
        )}&page=${pageParam}&size=${pageSize}`;

        const {data} = await axios.get<MessageWithUser>(url);
        
        return data as any;

    }

    return useInfiniteQuery<{data: MessageWithUser[]},Error>({
        queryKey: [queryKey,paramValue],
        queryFn: fetcher,
        getNextPageParam: (lastPage, allPages) => lastPage.data.length===pageSize ? allPages.length : undefined,
        initialPageParam: 0,
        retry:3,
        refetchInterval: isConnected ? false : 1000,
        enabled: isConnected,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    });
} 

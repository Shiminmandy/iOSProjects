import { RefObject, useEffect, useState } from "react";

{
  /** 自定义hook，引用dom元素，指向div元素，用于处理聊天区域的滚动 
    chatRef: 聊天区域的引用
    bottomRef: 底部区域的引用
    count: 消息数量
    通过<div ref={chatRef}>绑定到元素
    */
}
type UseChatScrollHandlerProps = {
  chatRef: RefObject<HTMLDivElement | null>;
  bottomRef: RefObject<HTMLDivElement | null>;
  count: number;
};

export const useChatScrollHandler = ({
  chatRef,
  bottomRef,
  count,
}: UseChatScrollHandlerProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    {
      /** 通过ref访问dom元素，获取底部和顶部区域的引用 */
    }
    const bottomDiv = bottomRef?.current;
    const topDiv = chatRef?.current;

    const shouldAutoScroll = () => {
      {
        /** 
         * IF 1: 首次加载自动滚动
         * 
         * 应用场景：
         * - 用户刚打开聊天页面，消息正在加载
         * - 消息加载完成后，底部元素（bottomDiv）出现
         * - 此时应该自动滚动到底部，让用户看到最新消息
         * 
         * 例子：
         * 1. 用户打开微信聊天，页面加载历史消息
         * 2. 消息渲染完成后，自动滚动到最底部
         * 3. 用户看到最新的消息，而不是停留在顶部
         * 
         * 为什么需要 hasInitialized？
         * - 确保只在首次加载时执行一次
         * - 避免后续消息更新时重复执行这个逻辑
         */
      }
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      {/** 
       * IF 2: 安全检查 - 防止 DOM 元素不存在时报错
       * 
       * 应用场景：
       * - 组件刚渲染，DOM 元素还没创建完成
       * - 组件卸载后，ref 变为 null
       * - 网络慢，消息还没加载，chatRef 指向的元素不存在
       * 
       * 例子：
       * 1. 页面刚打开，聊天容器还在加载中
       * 2. 此时调用 scrollHeight 会报错
       * 3. 提前检查，如果元素不存在，直接返回 false，不执行滚动
       * 
       * 为什么需要这个检查？
       * - 防止访问 null 的属性导致程序崩溃
       * - 优雅降级：元素不存在就不滚动，而不是报错
       */
      }
      if (!topDiv) return false;

      {/** 
       * IF 3: 智能判断是否应该自动滚动
       * 
       * 计算距离底部的距离：
       * scrollHeight: 顶部区域的总高度（所有内容的高度）
       * scrollTop: 顶部区域被卷去的高度（用户滚动了多少）
       * clientHeight: 顶部区域的可视高度（用户能看到的高度）
       * 
       * 公式：distanceFromBottom = 总高度 - 已滚动 - 可见高度
       * 
       * 应用场景：
       * 
       * 场景 A：用户在看最新消息（应该自动滚动）
       * - 用户位置：接近底部，距离底部 50px
       * - distanceFromBottom = 50 ≤ 100
       * - 新消息到达 → 自动滚动到底部 ✅
       * - 用户体验：新消息出现时，自动跟随到底部
       * 
       * 场景 B：用户在看历史消息（不应该滚动）
       * - 用户位置：在顶部，距离底部 500px
       * - distanceFromBottom = 500 > 100
       * - 新消息到达 → 不滚动，不打断用户 ❌
       * - 用户体验：用户在看历史消息时，不会被新消息打断
       * 
       * 场景 C：用户正在往上滚动查看历史
       * - 用户位置：在中间，距离底部 200px
       * - distanceFromBottom = 200 > 100
       * - 新消息到达 → 不滚动 ✅
       * - 用户体验：用户可以安心查看历史消息
       * 
       * 为什么是 100px？
       * - 100px 是一个"接近底部"的阈值
       * - 如果用户距离底部 ≤ 100px，认为用户在看最新消息
       * - 如果用户距离底部 > 100px，认为用户在看历史消息
       * - 这个值可以根据实际需求调整（比如 50px 或 150px）
       */
      }
      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      return distanceFromBottom <= 100;
    };

    {/** 
     * IF 4: 执行自动滚动
     * 
     * 应用场景：
     * - shouldAutoScroll() 返回 true（需要滚动）
     * - 执行平滑滚动到底部
     * 
     * 例子：
     * 1. 新消息到达，用户位置接近底部
     * 2. shouldAutoScroll() 判断应该滚动
     * 3. 延迟 100ms 后执行滚动（等待 DOM 更新）
     * 4. 平滑滚动到底部，用户看到新消息
     * 
     * 为什么用 setTimeout？
     * - 等待新消息渲染完成
     * - 确保 DOM 更新后再滚动
     * - 避免滚动时元素还没渲染，导致滚动位置不准确
     * 
     * 为什么用 scrollIntoView？
     * - 浏览器原生 API，性能好
     * - behavior: "smooth" 提供平滑滚动效果
     * - 自动滚动到目标元素（bottomRef）
     */
    }
    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [count, hasInitialized, chatRef, bottomRef]);

  {/** useEffect 会在依赖项变化时自动执行，并在执行时调用 shouldAutoScroll */}
};

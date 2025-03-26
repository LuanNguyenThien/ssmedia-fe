import { useEffect, useRef } from "react";

const useChatScrollToBottom = (prop, isStopSetScrolling) => {
    const scrollRef = useRef(null);
    console.log("useChatScrollToBottom", isStopSetScrolling.current);
    useEffect(() => {
        if (scrollRef.current && !isStopSetScrolling.current) {
            scrollRef.current.scrollTop =
                scrollRef.current?.scrollHeight -
                scrollRef.current?.clientHeight;

            isStopSetScrolling.current = true;
        }
    }, [prop]);

    return scrollRef;
};
export default useChatScrollToBottom;

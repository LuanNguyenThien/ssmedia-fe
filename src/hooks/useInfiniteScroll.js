import { useCallback, useEffect } from 'react';
import { debounce } from 'lodash';

const useInfiniteScroll = (bodyRef, bottomLineRef, callback) => {
  const handleScroll = useCallback(
    debounce(() => {
      const containerHeight = bodyRef?.current?.getBoundingClientRect().height;
      const { top: bottomLineTop } = bottomLineRef?.current?.getBoundingClientRect();
      if (bottomLineTop - 40 <= containerHeight) {
        callback();
      }
    }, 300), // Giới hạn gọi callback mỗi 300ms
    [bodyRef, bottomLineRef, callback]
  );

  useEffect(() => {
    const bodyRefCurrent = bodyRef?.current;
    bodyRefCurrent?.addEventListener('scroll', handleScroll, true);
    return () => {
      if (bodyRefCurrent) {
        bodyRefCurrent.removeEventListener('scroll', handleScroll, true);
      }
    };
  }, [bodyRef, handleScroll]);
};

export default useInfiniteScroll;

import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { postService } from '@services/api/post/post.service';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import Post from '@components/posts/post/Post';
import { Spinner } from '@chakra-ui/react'; // Dùng spinner từ Chakra UI
import '@pages/social/search/SearchPage.scss';

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const bodyRef = useRef(null);
  const bottomLineRef = useRef();
  useInfiniteScroll(bodyRef, bottomLineRef, fetchSearchResults);

  const location = useLocation();
  const searchQuery = location.state?.query || '';

  useEffect(() => {
    fetchSearchResults();
  }, [searchQuery]);

  async function fetchSearchResults() {
    setLoading(true);
    try {
      const response = await postService.searchPosts(searchQuery);
      setSearchResults(response.data.posts);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="search-page" ref={bodyRef}>
      {loading && searchResults.length === 0 && (
        <div className="search-page__loading">
          <Spinner width="50px" height="50px" />
          <p>Đang tìm kiếm...</p>
        </div>
      )}

      {!loading && searchResults.length === 0 && (
        <div className="search-page__no-results">
          <p>Không tìm thấy kết quả nào</p>
        </div>
      )}

      {searchResults
        .filter((post) => post.privacy !== 'Private')
        .map((post) => (
          <Post key={post.id} post={post} showIcons={false} className="search-page__post" />
        ))}

      {loading && searchResults.length > 0 && (
        <div className="search-page__loading-more">
          <Spinner width="10px" height="10px" />
          <p>Đang tải thêm bài viết...</p>
        </div>
      )}

      <div ref={bottomLineRef} className="search-page__bottom-line"></div>
    </div>
  );
};

export default SearchPage;
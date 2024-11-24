import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { postService } from '@services/api/post/post.service';
import useInfiniteScroll from '@hooks/useInfiniteScroll';
import Post from '@components/posts/post/Post';
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
      console.log('searchQuery:', searchQuery);
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
      {/* Render search results */}
      {searchResults
        .filter((post) => post.privacy !== 'Private')
        .map((post) => (
          <Post key={post.id} post={post} showIcons={false} className="search-page__post" />
        ))}
      <div ref={bottomLineRef} className="search-page__bottom-line"></div>
    </div>
  );
};

export default SearchPage;

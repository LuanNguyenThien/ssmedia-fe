import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { postService } from '@services/api/post/post.service';
import useInfiniteScroll from '@hooks/useInfiniteScroll';

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
    <div ref={bodyRef}>
      {/* Render search results */}
      {searchResults.map((post) => (
        <div key={post._id}>{post.post}</div>
      ))}
      <div ref={bottomLineRef}></div>
    </div>
  );
};

export default SearchPage;
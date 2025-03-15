import '@components/header/components/searchButton/SearchButtonMb.scss';
import { IoSearch } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const SearchButtonMb = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchKeyPress = () => {
    navigate('/app/social/search', { state: { query: searchTerm } });
  };
  const { isOpenSearchBar } = useSelector((state) => state.sidebarState);
  return (
    <>
      {isOpenSearchBar && (
        <div className="search-box animate__animated animate__fadeInDown">
          <button onClick={handleSearchKeyPress} className="btn-search">
            <IoSearch />
          </button>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="input-search"
            placeholder="Type to Search..."
          />
        </div>
      )}
    </>
  );
};

export default SearchButtonMb;

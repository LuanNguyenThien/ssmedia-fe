// import { Box, Text, Avatar, Spinner } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import '@components/chat/list/search-list/SearchList.scss';
import Avatar from '@components/avatar/Avatar';
import { useLocation, useNavigate, createSearchParams } from 'react-router-dom';

const SearchList = ({
  result,
  isSearching,
  searchTerm,
  setSelectedUser,
  setSearch,
  setIsSearching,
  setSearchResult,
  setComponentType
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const addUsernameToUrlQuery = (user) => {
    setComponentType('searchList');
    setSelectedUser(user);
    const url = `${location.pathname}?${createSearchParams({ username: user.username.toLowerCase(), id: user._id })}`;
    navigate(url);
    setSearch('');
    setIsSearching(false);
    setSearchResult([]);
  };

  return (
    <div className="search-result">
      <div className="search-result-container">
        {!isSearching && result.length > 0 && (
          <>
            {result.map((user) => (
              <div
                data-testid="search-result-item"
                className="search-result-container-item"
                key={user._id}
                onClick={() => addUsernameToUrlQuery(user)}
              >
                <Avatar
                  name={user.username}
                  bgColor={user.avatarColor}
                  textColor="#ffffff"
                  size={40}
                  avatarSrc={user.profilePicture}
                />
                <div className="username">{user.username}</div>
              </div>
            ))}
          </>
        )}

        {searchTerm && isSearching && result.length === 0 && (
          <div className="search-result-container-empty" data-testid="searching-text">
            <span>Searching...</span>
          </div>
        )}

        {searchTerm && !isSearching && result.length === 0 && (
          <div className="search-result-container-empty" data-testid="nothing-found">
            <span>Nothing found</span>
            <p className="search-result-container-empty-msg">We couldn&apos;t find any match for {searchTerm}</p>
          </div>
        )}
      </div>
    </div>
    // <Box className="search-result" p={4} borderWidth={1} borderRadius="md" boxShadow="md">
    //   <Box className="search-result-container">
    //     {!isSearching && result.length > 0 && (
    //       result.map((user) => (
    //         <Box
    //           data-testid="search-result-item"
    //           className="search-result-container-item"
    //           key={user._id}
    //           display="flex"
    //           alignItems="center"
    //           p={2}
    //           borderRadius="md"
    //           bg="gray.100"
    //           mb={2}
    //           cursor="pointer"
    //           onClick={() => {
    //             setSelectedUser(user);
    //             setComponentType('chat');
    //             setSearch('');
    //             setSearchResult([]);
    //           }}
    //           _hover={{ bg: 'gray.200' }}
    //         >
    //           <Avatar
    //             name={user.username}
    //             bgColor={user.avatarColor}
    //             textColor="#ffffff"
    //             size="md"
    //             src={user.profilePicture}
    //           />
    //           <Text ml={3} fontWeight="bold">{user.username}</Text>
    //         </Box>
    //       ))
    //     )}

    //     {searchTerm && isSearching && result.length === 0 && (
    //       <Box className="search-result-container-empty" data-testid="searching-text" display="flex" alignItems="center">
    //         <Spinner size="sm" mr={2} />
    //         <Text>Searching...</Text>
    //       </Box>
    //     )}

    //     {searchTerm && !isSearching && result.length === 0 && (
    //       <Box className="search-result-container-empty" data-testid="nothing-found" textAlign="center">
    //         <Text fontWeight="bold">Nothing found</Text>
    //         <Text>We couldn&apos;t find any match for <strong>{searchTerm}</strong></Text>
    //       </Box>
    //     )}
    //   </Box>
    // </Box>
  );
};

SearchList.propTypes = {
  result: PropTypes.array,
  isSearching: PropTypes.bool,
  searchTerm: PropTypes.string,
  setSelectedUser: PropTypes.func,
  setSearch: PropTypes.func,
  setIsSearching: PropTypes.func,
  setSearchResult: PropTypes.func,
  setComponentType: PropTypes.func
};

export default SearchList;

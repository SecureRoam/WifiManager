import React from 'react';

const SearchBar = ({ onSearch }) => {
  const handleSearchChange = (event) => {
    onSearch(event.target.value);
  };

  return (
    <div className="search-bar">
      <input type="text" placeholder="Search networks..." onChange={handleSearchChange} />
    </div>
  );
};

export default SearchBar;

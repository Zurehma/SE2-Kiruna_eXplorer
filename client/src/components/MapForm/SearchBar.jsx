import "../../styles/SearchBar.css";

import React, { useState } from 'react';

const SearchBar = ({ documents, setFilteredDocuments,setFiltering }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        if(value === ''){
            setFiltering(false);
        }else{
            setFiltering(true);
        }
        setSearchTerm(value);
        const filteredDocs = documents.filter(doc => doc.title.toLowerCase().includes(value));
        setFilteredDocuments(filteredDocs);
    };

    return (
        <input
            type="text"
            className="search-input"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by title..."
        />
    );
};

export default SearchBar;

import "../../styles/SearchBar.css";

import React, { useState } from 'react';
import './SearchBar.css'; // Assicurati che il percorso sia corretto

const SearchBar = ({ documents, setFilteredDocuments }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
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

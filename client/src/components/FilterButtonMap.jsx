import React, { useState, useEffect, useRef } from 'react';
import API from '../../API'; // Adjust this path based on your project structure

const FilterButtonMap = ({ setFilter }) => {
    // State management
    const [showFilters, setShowFilters] = useState(false);
    const [documentTypes, setDocumentTypes] = useState([]);
    const [selectedDocumentType, setSelectedDocumentType] = useState('');
    const dropdownRef = useRef(null); // Reference to the dropdown element

    // Fetch document types when the filter button is clicked
    const handleShowFilters = async () => {
        setShowFilters(!showFilters);
        if (!showFilters && documentTypes.length === 0) { // Fetch only if dropdown is opened for the first time
            try {
                const types = await API.getDocumentTypes();
                setDocumentTypes(types);
            } catch (error) {
                console.error('Error fetching document types:', error);
            }
        }
    };

    // Handle selection of document type
    const handleSelectType = (type) => {
        setSelectedDocumentType(type);
        setFilter(type);
        // setShowFilters(false); 
    };

    // Handle click outside of dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowFilters(false);
            }
        };

        if (showFilters) {
            document.addEventListener('mousedown', handleClickOutside);
        } 

        // Clean up event listener on component unmount or dropdown close
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showFilters]);

    return (
        <>
            {/* Filter Button */}
            <button
                onClick={handleShowFilters}
                style={{
                    position: 'absolute',
                    top: '5%',
                    right: '1%',
                    background: 'white',
                    border: 'none',
                    padding: '8px 15px',
                    borderRadius: '5px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                    cursor: 'pointer',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
                <i className="bi bi-funnel" style={{ fontSize: '20px', marginRight: '8px' }}></i>
                <span>Filter</span>
            </button>

            {/* Custom Dropdown for Document Types */}
            {showFilters && (
                <div
                    ref={dropdownRef}
                    style={{
                        position: 'absolute',
                        top: '10%',
                        right: '1%',
                        background: 'white',
                        border: '1px solid #ddd',
                        borderRadius: '5px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                        zIndex: 1000,
                        width: '220px',
                        padding: '10px',
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>Select Document Type:</div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}
                    >
                        <div
                            onClick={() => handleSelectType('')}
                            style={{
                                cursor: 'pointer',
                                padding: '10px',
                                borderRadius: '5px',
                                backgroundColor: selectedDocumentType === '' ? '#e0e0e0' : '#ffffff',
                                transition: 'background-color 0.3s',
                                textAlign: 'center',
                                boxShadow: selectedDocumentType === '' ? 'inset 0 0 5px rgba(0,0,0,0.1)' : 'none'
                            }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = selectedDocumentType === '' ? '#e0e0e0' : '#ffffff'}
                        >
                            All Types
                        </div>
                        {documentTypes.map((type, index) => (
                            <div
                                key={index}
                                onClick={() => handleSelectType(type.name)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '10px',
                                    borderRadius: '5px',
                                    backgroundColor: selectedDocumentType === type.name ? '#e0e0e0' : '#ffffff',
                                    transition: 'background-color 0.3s',
                                    textAlign: 'center',
                                    boxShadow: selectedDocumentType === type.name ? 'inset 0 0 5px rgba(0,0,0,0.1)' : 'none'
                                }}
                                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                                onMouseLeave={(e) => e.target.style.backgroundColor = selectedDocumentType === type.name ? '#e0e0e0' : '#ffffff'}
                            >
                                {type.name}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
};

export default FilterButtonMap;

import React, { useState } from 'react';

const AddParts = () => {
    // Dummy parts array
    const parts = ['Part A', 'Part B', 'Part C', 'Part D', 'Part E'];

    const [selectedParts, setSelectedParts] = useState([]);

    const handleSelectPart = (part) => {
        setSelectedParts([...selectedParts, part]);
    };

    const handleRemovePart = (part) => {
        setSelectedParts(selectedParts.filter((p) => p !== part));
    };

    return (
        <div>
            {/* Render the parts for selection */}
            <div>
                <h2>Select Parts:</h2>
                {parts.map((part) => (
                    <div key={part}>
                        <span>{part}</span>
                        <button onClick={() => handleSelectPart(part)}>Select</button>
                    </div>
                ))}
            </div>

            {/* Render the selected parts */}
            <div>
                <h2>Selected Parts:</h2>
                {selectedParts.map((part) => (
                    <div key={part}>
                        <span>{part}</span>
                        <button onClick={() => handleRemovePart(part)}>Remove</button>
                    </div>
                ))}
            </div>

            {/* Render the cart to show all the parts chosen */}
            <div>
                <h2>Cart:</h2>
                {selectedParts.length > 0 ? (
                    selectedParts.map((part) => (
                        <div key={part}>
                            <span>{part}</span>
                        </div>
                    ))
                ) : (
                    <p>No parts selected.</p>
                )}
            </div>

            {/* Add a button to save the selected parts */}
            <button onClick={() => console.log(selectedParts)}>Save</button>
        </div>
    );
};

export default AddParts;
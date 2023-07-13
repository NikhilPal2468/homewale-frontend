import React from "react";

const PropertyList = ({ properties }) => {
  return (
    <div>
      <h3>Property List</h3>
      <ul>
        {properties.map((property) => (
          <li key={property.id}>{property.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PropertyList;
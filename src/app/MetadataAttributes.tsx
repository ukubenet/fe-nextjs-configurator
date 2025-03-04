import React, { useState, useEffect, useCallback } from 'react';

function MetadataAttributes({ attributes }) {

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // setFormData((prev) => ({
    //   ...prev,
    //   [name]: type === 'checkbox' ? checked : value,
    // }));
  };



  return (
    <>
      <h3>Attributes</h3>
      <table id="attributes-table" border="1">
        <thead>
          <tr><td>Attribute</td><td>Type</td><td></td></tr>
        </thead>
        {Object.entries(attributes).map(([name, attribute]) => (
        <tr className="attribute-main-row" key={name}>
          <td>
            <input name="attribute[]" value={name} className="attribute-name" required onChange={handleChange}/>
          </td>
          <td>
            <select name="attribute_type[]" className="attribute_type" onChange={handleChange}>
              {attributeTypes.map((option) => (
                <option value={option} key={option} selected={attribute.type === option}>{option}</option>
              ))}
            </select>
          </td>
          <td>
            <button type="button" onClick={() => {/* Add delete logic */}}>Delete</button>
          </td>
        </tr>
        ))}
      </table>

      <div><button type="button" id="new-attribute">New Attribute</button></div>

      {/* Similar structure for Indexes and Transactions go here */}

      <div>
        <button id="submitButton">Submit</button>
      </div>
      </>
  );
}

export default MetadataAttributes;

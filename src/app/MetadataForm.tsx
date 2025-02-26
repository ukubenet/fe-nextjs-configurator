import React, { useState, useEffect, useCallback } from 'react';

function MetadataForm({ entity, entityType, appName, attributeTypes, references, balances, template }) {
  const [formData, setFormData] = useState({
    entityName: entity.EntityName,
    attributes: {},
    customTemplate: template,
    search: {},
    transactions: {},
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    document.getElementById('submitButton').disabled = true;
    try {
      const response = await fetch(
        `/v1/metadata/api/\${appName}/\${entityType}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        },
      );
      if (response.status === 201) {
        window.location.href = `/v1/app/config/\${appName}`;
      } else {
        console.error(`Status: \${response.status}`);
        document.getElementById('submitButton').disabled = false;
      }
    } catch (error) {
      console.error(error);
      document.getElementById('submitButton').disabled = false;
    }
  };

  return (
    <form id="metadata-form" onSubmit={handleFormSubmit}>
      <div>
        <button id="submitButton">Submit</button>
      </div>
      <input
        type="hidden"
        name="entity-name"
        value={formData.entityName}
        onChange={handleChange}
      />
      <h3>Attributes</h3>
      <table id="attributes-table" border="1">
        <thead>
          <tr><td>Attribute</td><td>Type</td><td></td></tr>
        </thead>
        {Object.entries(entity.Attributes).map(([name, attribute]) => (
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
    </form>
  );
}

export default MetadataForm;

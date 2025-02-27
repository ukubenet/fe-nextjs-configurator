"use client"
import { useState, useEffect } from "react";

export default function EditItem({
  params,
}: {
  params: { appName: string; type: string; entity: string };
}) {
  // Access URL parameters
  const { appName, type, entity } = params;
  
  // Use these values in your component
  console.log(appName, type, entity);
 
  const [formData, setFormData] = useState({ title: "", description: "" });

  // Fetch existing item data
  // useEffect(() => {
  //   if (id) {
  //     fetch(`/api/items/${id}`)
  //       .then((res) => res.json())
  //       .then((data) => setFormData(data));
  //   }
  // }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // // Submit the updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/items/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // router.push("/"); // Redirect after successful update
    }
  };

  return (
    <div>
      <h2>Edit Metadata</h2>
      <form onSubmit={handleSubmit}>
        {/* <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        /> */}
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
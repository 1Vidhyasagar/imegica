import React, { useState } from "react";
import "./form.scss";
import { Navigate } from "react-router-dom";

const CreateForm = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    number:"",
    photo: "",
    formData: new FormData(),
    error: "",
    open: false,
  });
  const { name, email, number, formData, error, open } = user;

  const handleChange = (event) => {
    const { name } = event.target;
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setUser({ ...user, [name]: value, error: "" });
  };

  const submit = async () => {
    try {
      const res = await fetch(`http://localhost:9000/create`, {
        method: "post",
        body: formData,
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        setUser({ ...user, error: data.error });
      } else {
        setUser({ name: "", email: "",number:"", photo: "", open: true });
      }
    } catch (err) {
      console.log(err);
    }
  };

  //form
  const fillForm = () => {
    return (
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group">
          <div className="form-group">
            <label className="text-muted">name</label>
            <input
              type="text"
              value={name}
              name="name"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="text-muted">email</label>
            <input
              type="text"
              value={email}
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="text-muted">mobile number</label>
            <input
              type="number"
              value={number}
              name="number"
              onChange={handleChange}
            />
          </div>
          <label className="text-muted" >photo</label>
          <input type="file" onChange={handleChange} name="photo" />
        </div>

        <button
          className="btn btn-raised btn-primary mt-2"
          onClick={() => submit()}
        >
          submit
        </button>
      </form>
    );
  };
  if (open) {
    return <Navigate to="/" />;
  }
  return (
    <div className="container">
      <h2 className="mt-5 mb-5">User Details</h2>
      <div
        className="alert alert-danger"
        style={{ display: error ? "" : "none" }}
      >
        {error}
      </div>
      <div className="alert alert-info" style={{ display: open ? "" : "none" }}>
        post successfully sumitted
      </div>
      {fillForm()}
    </div>
  );
};

export default CreateForm;

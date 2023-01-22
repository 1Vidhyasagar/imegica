import React, { useEffect, useState } from "react";
import "./form.scss";
import { Navigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";


const EditForm = () => {
  const location = useLocation();

  const [user, setUser] = useState({
    name: "",
    email: "",
    number:"",
    photo: "",

    error: "",
    open: false,
  });
  const [form] = useState({
    formData: new FormData(),
  });
  const { formData } = form;
  const { _id, name, email, number, error, open } = user;

  useEffect(() => {
    setUser({ ...location.state });
  }, [location.state]);
  const handleChange = (event) => {
    const { name } = event.target;
    const value = name === "photo" ? event.target.files[0] : event.target.value;
    formData.set(name, value);
    setUser({ ...user, [name]: value, error: "" });
  };

  const submit = async () => {
    try {
      const res = await fetch(`http://localhost:9000/edit/${_id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        setUser({ ...user, error: data.error });
      } else {
        setUser({ name: "", email: "", number:"", photo: "", open: true });
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
          <label className="text-muted">name</label>
          <input type="text" value={name} name="name" onChange={handleChange} />
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
            name="mobile"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="text-muted">photo</label>
          <input type="file" onChange={handleChange} name="photo" />
        </div>
        <Link to={"./"}>
          <button
            className="btn btn-raised btn-primary mt-2"
            onClick={() => submit()}
          >
            Update
          </button>
        </Link>
      </form>
    );
  };
  if (open) {
    return <Navigate to="/" />;
  }
  return (
    <div className="container">
      <h2 className="mt-5 mb-5">Edit Form</h2>
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

export default EditForm;

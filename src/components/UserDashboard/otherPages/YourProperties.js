import React from "react";
import SideBar from "../SideBar";

function YourProperties() {
  return (
    <div className="h-100">
      <div className="row h-100">
        <div className="col-12 col-lg-3">
          <SideBar />
        </div>
        <div className="col-12 col-lg-9">
          <div className="container">
            <p className="fw-bold border-bottom py-4">My Properties</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default YourProperties;

import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";
import PostFormError from "../PostFormError";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./SideBar/sidebar";
import styles from "./styles.module.css";

const initialValues = {
  property_type: "",
  apartment_name: "",
  bhk_type: "",
  floor: "",
  total_floors: "",
  property_age: "",
  facing: "",
  builtup_area: "",
};

const PROPERTY_TYPES = [
  { key: "Apartment", value: "apartment" },
  { key: "Independent House", value: "independent" },
  { key: "Gated Community", value: "gated" },
];
const BHK_TYPES = [
  { key: "1 RK", value: "1rk" },
  { key: "1 BHK", value: "1bhk" },
  { key: "2 BHK", value: "2bhk" },
  { key: "3 BHK", value: "3bhk" },
  { key: "4 BHK", value: "4bhk" },
  { key: "4 BHK", value: "4+bhk" },
];
const PROPERTY_AGE = [
  { key: "Less than 1 year", value: "<1" },
  { key: "Between 1 to 3 years", value: "1-3" },
  { key: "Between 3 to 5 years", value: "3-5" },
  { key: "Between 5 to 10 years", value: "5-10" },
  { key: "Greater than 10 years", value: ">10" },
];
const FACING = [
  { key: "North", value: "N" },
  { key: "South", value: "S" },
  { key: "East", value: "E" },
  { key: "West", value: "W" },
  { key: "North-East", value: "NE" },
  { key: "North-West", value: "NW" },
  { key: "South-East", value: "SE" },
  { key: "South-West", value: "SW" },
  { key: "Don't Know", value: "unknown" },
];
const FLOORS = [
  { key: "Ground", value: "0" },
  { key: "1", value: "1" },
  { key: "2", value: "2" },
  { key: "3", value: "3" },
  { key: "4", value: "4" },
  { key: "5", value: "5" },
  { key: "6", value: "6" },
  { key: "7", value: "7" },
  { key: "8", value: "8" },
  { key: "9", value: "9" },
  { key: "10", value: "10" },
  { key: "11", value: "11" },
  { key: "12", value: "12" },
  { key: "13", value: "13" },
  { key: "14", value: "14" },
  { key: "15", value: "15" },
  { key: "16", value: "16" },
  { key: "17", value: "17" },
  { key: "18", value: "18" },
  { key: "19", value: "19" },
  { key: "20", value: "20" },
  { key: "21", value: "21" },
  { key: "22", value: "22" },
  { key: "23", value: "23" },
  { key: "24", value: "24" },
  { key: "25", value: "25" },
  { key: "26", value: "26" },
  { key: "27", value: "27" },
  { key: "28", value: "28" },
  { key: "29", value: "29" },
  { key: "30", value: "30" },
  { key: "31", value: "31" },
  { key: "32", value: "32" },
  { key: "33", value: "33" },
  { key: "34", value: "34" },
  { key: "35", value: "35" },
  { key: "36", value: "36" },
  { key: "37", value: "37" },
  { key: "38", value: "38" },
  { key: "39", value: "39" },
  { key: "40", value: "40" },
  { key: "41", value: "41" },
  { key: "42", value: "42" },
  { key: "43", value: "43" },
  { key: "44", value: "44" },
  { key: "45", value: "45" },
  { key: "46", value: "46" },
  { key: "47", value: "47" },
  { key: "48", value: "48" },
  { key: "49", value: "49" },
  { key: "50", value: "50" },
  { key: "51", value: "51" },
  { key: "52", value: "52" },
  { key: "53", value: "53" },
  { key: "54", value: "54" },
  { key: "55", value: "55" },
  { key: "56", value: "56" },
  { key: "57", value: "57" },
  { key: "58", value: "58" },
  { key: "59", value: "59" },
  { key: "60", value: "60" },
  { key: "61", value: "61" },
  { key: "62", value: "62" },
  { key: "63", value: "63" },
  { key: "64", value: "64" },
  { key: "65", value: "65" },
  { key: "66", value: "66" },
  { key: "67", value: "67" },
  { key: "68", value: "68" },
  { key: "69", value: "69" },
  { key: "70", value: "70" },
  { key: "71", value: "71" },
  { key: "72", value: "72" },
  { key: "73", value: "73" },
  { key: "74", value: "74" },
  { key: "75", value: "75" },
  { key: "76", value: "76" },
  { key: "77", value: "77" },
  { key: "78", value: "78" },
  { key: "79", value: "79" },
  { key: "80", value: "80" },
  { key: "81", value: "81" },
  { key: "82", value: "82" },
  { key: "83", value: "83" },
  { key: "84", value: "84" },
  { key: "85", value: "85" },
  { key: "86", value: "86" },
  { key: "87", value: "87" },
  { key: "88", value: "88" },
  { key: "89", value: "89" },
  { key: "90", value: "90" },
  { key: "91", value: "91" },
  { key: "92", value: "92" },
  { key: "93", value: "93" },
  { key: "94", value: "94" },
  { key: "95", value: "95" },
  { key: "96", value: "96" },
  { key: "97", value: "97" },
  { key: "98", value: "98" },
  { key: "99", value: "99" },
];

const validationSchema = Yup.object({
  property_type: Yup.string().required("Select Property Type"),
  apartment_name: Yup.string(),
  bhk_type: Yup.string().required("Select BHK Type"),
  floor: Yup.string().required("Floors required"),
  total_floors: Yup.string().required("Total floors required"),
  property_age: Yup.string().required("Property Age required"),
  facing: Yup.string().required("Building Facing is required"),
  builtup_area: Yup.string().required("Built Up Area is Required"),
});

function PropertyDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const houseObject = location.state;

  const formValues = Object.entries(initialValues).reduce(
    (result, [key, value]) => {
      if (
        houseObject &&
        houseObject.hasOwnProperty(key) &&
        initialValues.hasOwnProperty(key)
      ) {
        if (houseObject[key] === null) result[key] = "";
        else result[key] = houseObject[key];
      }
      return result;
    },
    {}
  );

  const onSubmit = async (values) => {
    try {
      const { data } = await axios.post(
        `secure/api/newProperty/house/update/${location.state.id}`,
        values
      );

      const { house } = data;
      navigate(`/property/manage/house/${house.id}/locality`, {
        state: { ...house },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const [propertyTypeValue, setPropertyTypeValue] = useState(
    formValues.property_type
  );

  const handleSelectChange = (event, values) => {
    const { value } = event.target;
    setPropertyTypeValue(value);
    values.property_type = value;
  };

  return (
    <div className={`container`}>
      <div className={`d-flex flex-row justify-content-center`}>
        <div className={`w-20 ${styles.container}`}>
          <Sidebar pathname={location.pathname} />
        </div>
        <div
          className={`w-75 ms-2 px-4 d-flex flex-column ${styles.container}`}
        >
          <h5 className="ps-4 py-4 border-bottom">Property Details</h5>
          <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ values }) => (
              <Form className="w-100 p-2 px-4">
                {/* Property Type */}
                <div className="d-flex flex-column flex-sm-row align-items-center justify-content-around w-100 gap-4">
                  <div className="mb-3 w-100">
                    <label htmlFor="property_type">Property Type</label>
                    <Field
                      component="select"
                      id="property_type"
                      name="property_type"
                      className="form-control"
                      value={propertyTypeValue}
                      onChange={(event) => {
                        handleSelectChange(event, values);
                      }}
                    >
                      <option value="">Select</option>
                      {PROPERTY_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.key}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="property_type"
                      component={PostFormError}
                    />
                  </div>

                  {propertyTypeValue === "apartment" ? (
                    <div className="mb-3 w-100">
                      <label htmlFor="apartment_name">Apartment Name</label>
                      <Field
                        type="text"
                        id="apartment_name"
                        name="apartment_name"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="apartment_name"
                        component={PostFormError}
                      />
                    </div>
                  ) : (
                    ""
                  )}
                </div>

                <div className="d-flex flex-column flex-md-row align-items-center justify-content-around w-100 gap-4">
                  {/* Bhk Type */}
                  <div className="mb-3 w-100 pb-2">
                    <label htmlFor="bhk_type">BHK Type</label>
                    <Field
                      component="select"
                      id="bhk_type"
                      name="bhk_type"
                      className="form-control"
                    >
                      <option value="">Select</option>
                      {BHK_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.key}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="bhk_type" component={PostFormError} />
                  </div>

                  <div className="mb-3 w-100 d-flex flex-row align-items-center justify-content-around gap-2 mt-3 pb-2">
                    {/* Floor */}
                    <div className="mb-3 w-100">
                      <label htmlFor="floor">FLoor</label>
                      <Field
                        component="select"
                        id="floor"
                        name="floor"
                        className="form-control h-25"
                      >
                        <option value="">Select</option>
                        {FLOORS.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.key}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="floor" component={PostFormError} />
                    </div>
                    {/* Total Floors */}
                    <div className="mb-3 w-100">
                      <label htmlFor="total_floors">Total Floors</label>
                      <Field
                        component="select"
                        id="total_floors"
                        name="total_floors"
                        className="form-control"
                      >
                        <option value="">Select</option>
                        {FLOORS.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.key}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="total_floors"
                        component={PostFormError}
                      />
                    </div>
                  </div>
                </div>

                {/* Property age */}
                <div className="mb-3">
                  <label htmlFor="property_age">Property Age</label>
                  <Field
                    component="select"
                    id="property_age"
                    name="property_age"
                    className="form-control"
                  >
                    <option value="">Select</option>
                    {PROPERTY_AGE.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.key}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="property_age" component={PostFormError} />
                </div>

                {/* Facing */}
                <div className="mb-3">
                  <label htmlFor="facing">Facing</label>
                  <Field
                    component="select"
                    id="facing"
                    name="facing"
                    className="form-control"
                  >
                    <option value="">Select</option>
                    {FACING.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.key}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="facing" component={PostFormError} />
                </div>

                {/* Bulitup Area */}
                <div className="mb-3">
                  <div>
                    <label>Builtup Area(in Sq.ft)</label>
                    <Field
                      type="number"
                      id="builtup_area"
                      name="builtup_area"
                      className="form-control"
                    />
                  </div>
                  <ErrorMessage name="builtup_area" component={PostFormError} />
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className={`w-100 justify-content-end primary-color mt-2`}
                >
                  Save & Continue
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetails;

import React, { useContext, useEffect, useState } from "react";
import Sidebar from "./SideBar/sidebar";
import styles from "./styles.module.css";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";
import PostFormError from "../PostFormError";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomPhoneInput from "../../Authentication/Register/CustomPhoneInput";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { AMENITIES } from "../../constants";
import { LoadContext } from "../../../context/load-context";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const WATER_SUPPLY = [
  { key: "CORPORATION" },
  { key: "BOREWELL" },
  { key: "BOTH" },
];

const initialValues = {
  bathrooms_count: 0,
  balcony_count: 0,
  water_supply: "",
  secondary_number: "",
  gym: false,
  gated_security: false,
  lift: false,
  ac: false,
  geyser: false,
  washing_machine: false,
  water_filter: false,
  cctv: false,
  fridge: false,
  swimming_pool: false,
  tv: false,
  power_backup: false,
  gas_pipeline: false,
  fire_safety: false,
  club_house: false,
  wifi: false,
  park: false,
  visitor_parking: false,
  shopping_center: false,
};

const validationSchema = Yup.object({
  bathrooms_count: Yup.number().min(0),
  balcony_count: Yup.number().min(0),
  water_supply: Yup.string().required("Information required"),
  gym: Yup.boolean(),
  gated_security: Yup.boolean(),
  fridge: Yup.boolean(),
  ac: Yup.boolean(),
  geyser: Yup.boolean(),
  tv: Yup.boolean(),
  swimming_pool: Yup.boolean(),
  shopping_center: Yup.boolean(),
  cctv: Yup.boolean(),
  washing_machine: Yup.boolean(),
  microwave: Yup.boolean(),
  power_backup: Yup.boolean(),
  gas_pipeline: Yup.boolean(),
  fire_safety: Yup.boolean(),
  club_house: Yup.boolean(),
  water_filter: Yup.boolean(),
  wifi: Yup.boolean(),
  visitor_parking: Yup.boolean(),
  lift: Yup.boolean(),
  park: Yup.boolean(),
});

function Amenities() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setLoading } = useContext(LoadContext);
  const [postPropertyPageNo, setPostPropertyPageNo] = useState(0);

  let curPageNo = 4;

  const [houseObject, setHouseObject] = useState(null);
  const { id: houseId } = useParams();

  useEffect(() => {
    try {
      const fetchData = async (houseId) => {
        setLoading(true);
        const { data } = await axios.get(
          `/secure/api/gethouse?houseId=${houseId}`
        );

        setPostPropertyPageNo(data?.post_property_page_no);
        setHouseObject(data);
      };

      fetchData(houseId);
    } catch (e) {
      toast.error(e?.response?.data?.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [houseId]);

  let formValues = {};

  if (houseObject) {
    formValues = Object.entries(initialValues).reduce(
      (result, [key, value]) => {
        if (
          // eslint-disable-next-line no-prototype-builtins
          houseObject.hasOwnProperty(key) &&
          // eslint-disable-next-line no-prototype-builtins
          initialValues.hasOwnProperty(key)
        ) {
          if (houseObject[key] === null) result[key] = value;
          else result[key] = houseObject[key];
        }
        return result;
      },
      {}
    );
  } else {
    formValues = initialValues;
  }

  formValues.partNo = "4";

  if (!formValues.balcony_count) formValues.balcony_count = 0;
  if (!formValues.bathrooms_count) formValues.bathrooms_count = 0;

  const onSubmit = async (values) => {
    if (values.bathrooms_count <= 0) {
      toast.error("Bathroom count must be > 0", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } else {
      try {
        values.postPropertyPageNo = Math.max(postPropertyPageNo, curPageNo);
        await axios.post(
          `secure/api/newProperty/house/update/${houseId}`,
          values
        );

        navigate(`/property/manage/house/${houseId}/gallery`);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleBathroomCount = (action, setFieldValue, bathroomsCount) => {
    if (action === "decrease" && bathroomsCount > 0) {
      setFieldValue("bathrooms_count", bathroomsCount - 1);
    } else {
      setFieldValue("bathrooms_count", bathroomsCount + 1);
    }
  };

  const handleBalconyCount = (action, setFieldValue, balconyCount) => {
    if (action === "decrease" && balconyCount > 0) {
      setFieldValue("balcony_count", balconyCount - 1);
    } else {
      setFieldValue("balcony_count", balconyCount + 1);
    }
  };

  const renderAmenities = () => {
    const renderedItems = [];

    for (let i = 0; i <= AMENITIES.length - 4; i += 4) {
      renderedItems.push(
        <div className="container d-flex mx-auto mb-2 w-100" key={i}>
          <div className="d-flex gap-1 align-items-center w-100 gap-2">
            <div className="d-flex flex-column flex-md-row gap-2 w-100">
              <div className="d-flex align-items-center justify-content-center w-100">
                <Field
                  type="checkbox"
                  name={AMENITIES[i].key}
                  id={AMENITIES[i].key}
                  className={`${styles.input_checkbox} w-25`}
                />
                <label
                  className={`${styles.input_label}  p-2 p-2 py-4 w-100`}
                  htmlFor={AMENITIES[i].key}
                >
                  {AMENITIES[i].icon} {AMENITIES[i].label}
                </label>
              </div>
              <div className="d-flex align-items-center justify-content-center w-100">
                <Field
                  type="checkbox"
                  name={AMENITIES[i + 1].key}
                  id={AMENITIES[i + 1].key}
                  className={`${styles.input_checkbox} w-25`}
                />
                <label
                  className={`${styles.input_label}  p-2 p-2 py-4 w-100`}
                  htmlFor={AMENITIES[i + 1].key}
                >
                  {AMENITIES[i + 1].icon} {AMENITIES[i + 1].label}
                </label>
              </div>
            </div>
            <div className="d-flex flex-column flex-md-row gap-2 w-100">
              <div className="d-flex align-items-center justify-content-center w-100">
                <Field
                  type="checkbox"
                  name={AMENITIES[i + 2].key}
                  id={AMENITIES[i + 2].key}
                  className={`${styles.input_checkbox} w-25`}
                />
                <label
                  className={`${styles.input_label}  p-2 p-2 py-4 w-100`}
                  htmlFor={AMENITIES[i + 2].key}
                >
                  {AMENITIES[i + 2].icon} {AMENITIES[i + 2].label}
                </label>
              </div>
              <div className="d-flex align-items-center justify-content-center w-100">
                <Field
                  type="checkbox"
                  name={AMENITIES[i + 3].key}
                  id={AMENITIES[i + 3].key}
                  className={`${styles.input_checkbox} w-25`}
                />
                <label
                  className={`${styles.input_label}  p-2 p-2 py-4 w-100`}
                  htmlFor={AMENITIES[i + 3].key}
                >
                  {AMENITIES[i + 3].icon} {AMENITIES[i + 3].label}
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return renderedItems;
  };

  return (
    <div className="container">
      <div className={`d-flex flex-column flex-sm-row justify-content-center`}>
        <div className={`w-20 ${styles.container}`}>
          <Sidebar
            pathname={location.pathname}
            houseId={houseId}
            postPropertyPageNo={postPropertyPageNo}
          />
        </div>
        <div
          className={`w-75 ms-2  px-4 d-flex flex-column ${styles.container}`}
        >
          <h5 className="ps-4 py-4 border-bottom">Amenities</h5>
          <Formik
            initialValues={formValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {({ values, setFieldValue }) => (
              <Form className="w-100 p-2 px-4">
                {/* Bathroom Count */}
                <div className="d-flex flex-column flex-sm-row align-items-center justify-content-around w-100 gap-4">
                  <div className="mb-3 w-100">
                    <label htmlFor="property_type">Bathroom Count</label>
                    <div className="mb-3 w-100 border rounded d-flex form-control justify-content-between align-items-center">
                      <button
                        type="button"
                        className="rounded w-2 h-2"
                        disabled={values.bathrooms_count <= 0}
                        onClick={() =>
                          handleBathroomCount(
                            "decrease",
                            setFieldValue,
                            values.bathrooms_count
                          )
                        }
                      >
                        <AiOutlineMinus />
                      </button>
                      <span className="">{values.bathrooms_count}</span>
                      <button
                        type="button"
                        className="rounded w-2 h-2"
                        onClick={() =>
                          handleBathroomCount(
                            "increase",
                            setFieldValue,
                            values.bathrooms_count
                          )
                        }
                      >
                        <AiOutlinePlus />
                      </button>
                    </div>
                    <ErrorMessage
                      name="property_type"
                      component={PostFormError}
                    />
                  </div>
                  <div className="mb-3 w-100">
                    <label htmlFor="property_type">Balcony Count</label>
                    <div className="mb-3 w-100 border rounded d-flex form-control justify-content-between align-items-center">
                      <button
                        type="button"
                        className="rounded w-2 h-2"
                        disabled={values.balcony_count <= 0}
                        onClick={() =>
                          handleBalconyCount(
                            "decrease",
                            setFieldValue,
                            values.balcony_count
                          )
                        }
                      >
                        <AiOutlineMinus />
                      </button>
                      <span className="">{values.balcony_count}</span>
                      <button
                        type="button"
                        className="rounded w-2 h-2"
                        onClick={() =>
                          handleBalconyCount(
                            "increase",
                            setFieldValue,
                            values.balcony_count
                          )
                        }
                      >
                        <AiOutlinePlus />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column flex-md-row align-items-center justify-content-around w-100 gap-4">
                  <div className="mb-3 w-100">
                    <label htmlFor="water_supply">Water Supply</label>
                    <Field
                      component="select"
                      id="water_supply"
                      name="water_supply"
                      className="form-control"
                    >
                      <option value="">Select</option>
                      {WATER_SUPPLY.map((type) => (
                        <option key={type.key} value={type.key}>
                          {type.key}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="water_supply"
                      component={PostFormError}
                    />
                  </div>

                  <div className="mb-3 w-100">
                    <label htmlFor="secondary_number">Secondary Number</label>
                    <Field
                      name="secondary_number"
                      id="secondary_number"
                      type="tel"
                      values={values}
                      variable="secondary_number"
                      component={CustomPhoneInput}
                    />
                  </div>
                </div>
                {renderAmenities()}
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
      <ToastContainer />
    </div>
  );
}

export default Amenities;

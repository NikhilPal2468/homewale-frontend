import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button } from "react-bootstrap";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Sidebar from "./SideBar/sidebar";

const CITIES = ["Mumbai", "Bangalore", "Gurgaon", "Delhi", "Hyderabad"];

function PgLocality() {
  const location = useLocation();
  const navigate = useNavigate();

  const { id: pgId } = useParams();

  const [city, setCity] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [locality, setLocality] = useState("");
  const [street, setStreet] = useState("");
  const [suggestionList, setSuggestionList] = useState([]);

  //   useEffect(() => {
  //     try {
  //       const fetchData = async (pgId) => {
  //         setLoading(true);
  //         const { data } = await axios.get(
  //           `/secure/api/getPg?pgId=${pgId}`
  //         );

  //         setLoading(false);
  //         setCity(data?.city);
  //         setLocality(data?.locality);
  //         setStreet(data?.street);
  //       };

  //       fetchData(pgId);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }, [pgId]);

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setSuggestionList([]);
    setLocality("");
    setStreet("");
  };

  const handleLocalityChange = (e) => {
    setLocality(e.target.value);
    setShowSuggestions(true);
    setStreet("");
  };

  const handleCitySelect = (place) => {
    setLocality(place);
    setShowSuggestions(false);
    setSuggestionList([]);
  };

  useEffect(() => {
    const autoCompleteApi = async () => {
      if (showSuggestions)
        await axios
          .get(`/public/api/autocomplete?city=${city}&text=${locality}`)
          .then((response) => {
            setSuggestionList(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
    };
    autoCompleteApi();
  }, [locality, city, showSuggestions]);

  const handleStreetChange = (e) => {
    setStreet(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!city || !locality || !street) return;

    const payLoad = {
      city: city,
      locality: locality,
      street: street,
      partNo: "2",
    };

    try {
      await axios.post(`secure/api/newProperty/pg/update/${pgId}`, payLoad);
      navigate(`/property/manage/pg/${pgId}/pgdetails`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container h-100">
      <div className={`d-flex flex-column flex-sm-row justify-content-center`}>
        <div className={`w-20 ${styles.container}`}>
          <Sidebar pathname={location.pathname} />
        </div>
        <div
          className={`w-75 ms-2 px-4 d-flex flex-column ${styles.container}`}
        >
          <h5 className="ps-4 py-4 border-bottom">Locality Details</h5>
          <form
            onSubmit={handleFormSubmit}
            className="h-100 d-flex flex-column"
          >
            <div className="d-flex flex-row w-100 justify-content-center align-items-center gap-4">
              <div className={`mb-3 w-100 ${styles.sticky_city}`}>
                <label htmlFor="city">Select City</label>
                <select
                  name="city"
                  id="city"
                  value={city}
                  onChange={handleCityChange}
                  className={`form-control ${styles.selectBox}`}
                  required
                >
                  <option value="">Select</option>
                  {CITIES &&
                    CITIES.map((city) => {
                      return (
                        <option value={city} key={city}>
                          {city}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="position-relative mb-3 w-100">
                <label htmlFor="locality">Locality</label>
                <input
                  type="text"
                  name="locality"
                  id="locality"
                  className="form-control"
                  value={locality}
                  onChange={handleLocalityChange}
                  required
                />
                <div
                  className={`${styles.autocomplete_dropdown_container} ${
                    suggestionList.length === 0
                      ? styles.remove_dropdown_container
                      : ""
                  }`}
                >
                  {suggestionList &&
                    suggestionList.map((place) => {
                      return (
                        <div
                          key={place?.placeId}
                          className={styles.suggestion_item}
                          role="button"
                          onClick={() => {
                            handleCitySelect(place?.description);
                          }}
                        >
                          {place?.description}
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
            <div className="d-flex flex-row w-100 justify-content-center align-items-center gap-4">
              <div className="mb-3 w-100">
                <label htmlFor="city">Landmark/Street</label>
                <input
                  type="text"
                  name="street"
                  id="street"
                  value={street}
                  className="form-control"
                  onChange={handleStreetChange}
                  required
                />
              </div>
              <div className="w-100"></div>
            </div>

            <div className="">
              <Button
                variant="primary"
                type="submit"
                className={`w-100 justify-content-end primary-color align-self-end`}
              >
                Save & Continue
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PgLocality;
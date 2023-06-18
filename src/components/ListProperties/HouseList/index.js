import React, { useContext, useEffect, useState } from "react";
// import styles from "./styles.module.css";
import axios from "axios";
import HouseCard from "../HouseCard";
import { LoadContext } from "../../../context/load-context";
import useDebounceQuery from "../../hooks/useDebounceQuery";

const HouseList = ({
  city = "",
  propertyType = "",
  locality = "",
  bhkType = [],
  preferredTenants = [],
  price = [],
  furnishing = [],
  twoWheelerParking = false,
  fourWheelerParking = false,
  withImage = false,
  userDetails = {},
}) => {
  const [houses, setHouses] = useState([]);
  const { setLoading } = useContext(LoadContext);

  const shortlistArray = [
    ...(userDetails ? userDetails.house_shortlists : []),
    ...(userDetails ? userDetails.pg_shortlists : []),
  ];

  if (bhkType === []) {
    console.log("first");
  }
  const { query: priceDebounced = [], debounceQuery } = useDebounceQuery();

  useEffect(() => {
    const fetchData = async () => {
      let payload = {
        city: city,
        text: [locality],
        pgNo: "1",
        propertyType: propertyType,
        filters: {
          bhk_type: bhkType.length === 0 ? undefined : bhkType,
          preferred_tenants:
            preferredTenants.length === 1 ? undefined : preferredTenants,
          price_greater_than: priceDebounced?.[0],
          price_less_than: priceDebounced?.[1],
          furnishing_type: furnishing.length === 0 ? undefined : furnishing,
          two_wheeler_parking:
            twoWheelerParking === false ? undefined : twoWheelerParking,
          four_wheeler_parking:
            fourWheelerParking === false ? undefined : fourWheelerParking,
          property_with_image: withImage === false ? undefined : withImage,
        },
      };

      try {
        setLoading(true);

        // get all properties
        const { data } = await axios.post(
          "/public/api/listProperties",
          payload
        );
        const { allhouses = [], count = 0 } = data || {};
        console.log("count:", count);

        setLoading(false);
        setHouses(allhouses);

        // get shortlist array
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    fetchData();
  }, [
    city,
    propertyType,
    locality,
    bhkType,
    preferredTenants,
    priceDebounced,
    furnishing,
    twoWheelerParking,
    fourWheelerParking,
    withImage,
  ]);

  useEffect(() => {
    debounceQuery(price);
  }, [debounceQuery, price]);

  return houses.length ? (
    <div className="p-1 col-12 col-md-7 col-lg-8">
      {houses.map((house) => {
        const {
          houses_id = "",
          apartment_name = "",
          locality = "",
          rent = 0,
          rent_negotiable = false,
          deposit = 0,
          builtup_area = "",
          furnishing_type = "",
          bhk_type = "",
          preferred_tenants = "",
          available_from = "",
        } = house || {};
        return (
          <HouseCard
            key={houses_id}
            houses_id={houses_id}
            apartment_name={apartment_name}
            locality={locality}
            rent={rent}
            rent_negotiable={rent_negotiable}
            deposit={deposit}
            builtup_area={builtup_area}
            furnishing_type={furnishing_type}
            bhk_type={bhk_type}
            preferred_tenants={preferred_tenants}
            available_from={available_from}
            propertyType={propertyType}
            userDetails={userDetails}
            shortlistArray={shortlistArray}
          />
        );
      })}
    </div>
  ) : (
    <div>No properties to show for now</div>
  );
};

export default HouseList;

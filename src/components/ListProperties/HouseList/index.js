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
  parking = [],
  withImage = false,
  userDetails = {},
}) => {
  const [houses, setHouses] = useState([]);
  const { setLoading, isReset, setReset } = useContext(LoadContext);

  const shortlistArray = [
    ...(userDetails ? userDetails.house_shortlists : []),
    ...(userDetails ? userDetails.house_shortlists : []),
  ];

  const { query: priceDebounced = [], debounceQuery } = useDebounceQuery();

  useEffect(() => {
    const fetchData = async () => {
      let payload = {
        city: city,
        text: [locality],
        pgNo: "1",
        propertyType,
        filters: {
          bhk_type: bhkType.length === 0 ? undefined : bhkType,
          preferred_tenants:
            preferredTenants.length === 1 ? undefined : preferredTenants,
          price_greater_than: priceDebounced?.[0],
          price_less_than: priceDebounced?.[1],
          furnishing_type: furnishing.length === 0 ? undefined : furnishing,
          parking: parking.length === 1 ? undefined : parking,
          property_with_image: withImage ? 1 : undefined,
        },
      };

      try {
        setLoading(true);

        // get all properties
        const { data } = await axios.post(
          "/public/api/listProperties",
          payload
        );
        const { allhouses = [], totalCount = 0 } = data || {};
        console.log("allhouses:", allhouses);
        console.log("count:", totalCount);
        setHouses(allhouses);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (!isReset) {
      fetchData();
    } else {
      setReset(false);
    }
  }, [
    city,
    propertyType,
    locality,
    bhkType,
    preferredTenants,
    priceDebounced,
    furnishing,
    parking,
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
          images,
        } = house || {};
        return (
          <HouseCard
            key={houses_id}
            house_id={houses_id}
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
            images={images}
          />
        );
      })}
    </div>
  ) : (
    <div>No properties to show for now</div>
  );
};

export default HouseList;

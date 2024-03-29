import React, { useState } from "react";
import SideBar from "./SideBar";
import ProfilePage from "./otherPages/ProfilePage";
import YourShortlists from "./otherPages/YourShortlists";
import YourProperties from "./otherPages/YourProperties";
import OwnersContacted from "./otherPages/OwnersContacted";
import styles from "./styles.module.css";
const UserDashboard = () => {
  const [navigation, setNavigation] = useState("profile");
  console.log("navigation:", navigation);
  const NAVIGATION_MAPPING = {
    profile: <ProfilePage />,
    properties: <YourProperties />,
    shortlists: <YourShortlists />,
    ownerContacted: <OwnersContacted />,
  };

  return (
    <div className={styles.user_dashboard}>
      <SideBar navigation={navigation} setNavigation={setNavigation} />
      <div>{NAVIGATION_MAPPING[navigation]}</div>
    </div>
  );
};

export default UserDashboard;

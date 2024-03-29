import React, { useContext } from "react";
import { LoadContext } from "../../context/load-context";
import Backdrop from "@mui/material/Backdrop";

import { CircularProgress } from "@mui/material";

const Loader = () => {
  const { isLoading } = useContext(LoadContext);
  return (
    isLoading && (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
        {/* <img src={loaderGif} alt="loader-gif" /> */}
      </Backdrop>
    )
  );
};

export default Loader;

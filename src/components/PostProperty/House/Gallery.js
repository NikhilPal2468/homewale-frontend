import React, { useState, useEffect, useContext } from "react";
import Sidebar from "./SideBar/sidebar";
import styles from "./styles.module.css";
import { BsCameraFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import FinalModal from "../FinalModal";
import { LoadContext } from "../../../context/load-context";
import Resizer from "react-image-file-resizer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PICTURE_TYPES = [
  "Kitchen",
  "Bedroom",
  "Hall",
  "Dining",
  "Outside",
  "Bathroom",
  "Balcony",
];

function Gallery() {
  const location = useLocation();
  const { setLoading } = useContext(LoadContext);

  const { id: houseId } = useParams();
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postPropertyPageNo, setPostPropertyPageNo] = useState(0);

  // let curPageNo = 5;

  const handleInputChange = async (e) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const filesArray = Array.from(e.target.files);
    setImageFiles(filesArray);

    const formData = new FormData();

    for (let i = 0; i < filesArray.length; i++) {
      formData.append("image", filesArray[i]);
    }
  };

  const handleSubmit = async () => {
    const values = {};
    values.postPropertyPageNo = 5;
    await axios.post(`secure/api/newProperty/house/update/${houseId}`, values);
    setShowModal(true);
  };

  // To load images saved in db on intial load or refresh
  useEffect(() => {
    try {
      const fetchImageData = async (houseId) => {
        setLoading(true);
        const response = await axios.get(
          `/secure/api/getHouseImage/${houseId}`
        );
        if (response.data) {
          setUploadedImages([...response.data]);
        }
        setLoading(false);
      };

      fetchImageData(houseId);
    } catch (e) {
      setLoading(false);
      console.log(e);
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
    }
  }, [houseId]);

  // To fetch house data
  useEffect(() => {
    try {
      const fetchData = async (houseId) => {
        setLoading(true);
        const { data } = await axios.get(
          `/secure/api/gethouse?houseId=${houseId}`
        );

        setPostPropertyPageNo(data?.post_property_page_no);
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

  // To update uploaded images state on new image upload
  useEffect(() => {
    if (!imageFiles || imageFiles.length === 0) return;

    // const uploadImages = async (resizedFiles) => {
    //   const formData = new FormData();

    //   for (let i = 0; i < resizedFiles.length; i++) {
    //     formData.append("image", resizedFiles[i]);
    //   }
    //   try {
    //     setLoading(true);
    //     const response = await axios.post(
    //       `secure/api/newProperty/house/uploadImage/${houseId}`,
    //       formData,
    //       {
    //         headers: {
    //           "Content-Type": "multipart/form-data",
    //         },
    //       }
    //     );
    //     if (response.data) {
    //       setUploadedImages((prev) => {
    //         if (prev) return [...prev, ...response.data];
    //         else return [...response.data];
    //       });
    //     }

    //     setImageFiles([]);
    //   } catch (error) {
    //     console.error(error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    const uploadPromises = [];

    imageFiles.forEach((file) => {
      uploadPromises.push(
        new Promise((resolve, reject) => {
          Resizer.imageFileResizer(
            file,
            800, // Set your desired maximum width
            600, // Set your desired maximum height
            "JPEG", // Output format (JPEG, PNG, WEBP)
            70, // Output quality (0-100)
            0, // Rotation angle (in degrees, 0-360)
            (resizedFile) => {
              try {
                const formData = new FormData();
                formData.append("image", resizedFile, resizedFile.name);

                setLoading(true);
                axios
                  .post(
                    `/secure/api/newProperty/house/uploadImage/${houseId}`,
                    formData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  )
                  .then((response) => {
                    setUploadedImages((prev) => {
                      if (prev) return [...prev, ...response.data];
                      else return [...response.data];
                    });
                    resolve(); // Resolve the promise when the upload is successful
                  })
                  .catch((error) => {
                    console.error(error);
                    reject(error); // Reject the promise if there is an error during the upload
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              } catch (error) {
                console.error(error);
                reject(error); // Reject the promise if there is an error
              }

              // setImageFiles([]);
            },
            "blob" // Output type ('blob' for File object or 'base64' for data URL)
          );
        })
      );
    });
  }, [imageFiles, houseId]);

  // To handle description change for each image
  const handleDescriptionChange = async (e, imageId) => {
    const description = e.target.value;

    try {
      await axios.put(
        `/secure/api/house/uploadImage/change-description/${imageId}`,
        {
          description: description,
        }
      );

      setUploadedImages((prevImages) => {
        let update = prevImages.map((curPhoto) => {
          if (curPhoto.id === imageId) {
            curPhoto.description = description;
          }
          return curPhoto;
        });
        return update;
      });
    } catch (err) {
      console.log(err);
    }
  };

  // To handle deletion of image
  const handleDelete = async (e, imageId) => {
    try {
      setLoading(true);
      await axios.delete(`/secure/api/house/deleteImage/${imageId}`);
      setLoading(false);
      setUploadedImages((prevImages) => {
        return prevImages.filter((curPhoto) => curPhoto.id !== imageId);
      });
    } catch (err) {
      console.log(err);
    }
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
          className={`w-75 ms-2 px-4 d-flex flex-column ${styles.container}`}
        >
          <h5 className="ps-4 py-4 border-bottom mx-8 p-4">Upload Photos</h5>
          <div role="button" className="px-4 py-2 m-2 border">
            <label htmlFor="image" className="btn w-100">
              <div className="m-4">
                {<BsCameraFill size="30" className={`${styles.icon}`} />}
                <p>Increase Your Response Rate:</p>
                <h5 className="mb-4">Add Photos to Get 5X More Inquiries!</h5>
                <span
                  className={`${styles.image_input} p-2 px-4 fw-semibold rounded`}
                  title="Please limit Photos below 5mb"
                >
                  Add Photos
                </span>
              </div>
            </label>
            <input
              type="file"
              name="image"
              id="image"
              style={{ display: "none" }}
              className={`${styles.image_input}`}
              onChange={handleInputChange}
              multiple
              accept="image/jpeg, image/png, image/gif"
            />
          </div>
          <div className={`${styles.image_container}`}>
            {uploadedImages &&
              uploadedImages.map((image) => {
                // console.log(image);
                return (
                  <div
                    className={`card ${styles.card_image}`}
                    key={image.filename}
                  >
                    <img
                      className={`card-img-top ${styles.image}`}
                      src={image.media_url}
                      alt={image.filename}
                    />
                    <div className="card-body border d-flex align-items-center justify-content-center">
                      <select
                        name="description"
                        id="description"
                        onChange={(e) => {
                          handleDescriptionChange(e, image.id);
                        }}
                        className="form-control"
                      >
                        <option value="">Picture Type</option>
                        {PICTURE_TYPES.map((cur) => {
                          return (
                            <option key={cur} value={cur}>
                              {cur}
                            </option>
                          );
                        })}
                      </select>
                      <p
                        className="my-auto ms-2"
                        role="button"
                        onClick={(e) => {
                          handleDelete(e, image.id);
                        }}
                      >
                        {<MdDelete size={30} />}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
          <button
            onClick={(e) => handleSubmit(e)}
            className={`w-100 justify-content-end px-2 my-4 fw-semibold py-1 rounded ${styles.button}`}
          >
            Finish Posting
          </button>
        </div>
      </div>
      {showModal && (
        <FinalModal
          showModal={showModal}
          setShowModal={setShowModal}
          propertyId={houseId}
          propertyType={"house"}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default Gallery;

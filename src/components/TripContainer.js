import React from "react";
import { useState, useEffect } from "react";
import "../styles/Trippage.css";
import PropTypes from "prop-types";
import { db, auth } from "../firebase-config.js";
import { useNavigate } from "react-router-dom";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import Rating from "@mui/material/Rating";
import { addRating } from "../api/api";
import { getImage } from "../Data/CountriesByRegion";
import checkUserIdInField from "./Admin";
import trashcan from "../img/trashcan.svg";

export function TripContainer({ trip, calculateAverageRating }) {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(trip.description);
  const [tripName, setTripName] = useState(trip.tripName);
  const [authorRating, setAuthorRating] = useState(trip.authorRating);
  const [isAdmin, setIsAdmin] = useState(false);
  //let ratings = trip.rating;
  const isAuthor =
    auth.currentUser !== null
      ? trip.authorName === auth.currentUser.displayName
      : false;

  useEffect(() => {
    const useAdminUser = async () => {
      const userEmail = auth.currentUser.email; // Replace this with your actual user ID
      console.log("userEmail", userEmail);

      const result = await checkUserIdInField(
        "roles",
        "eHpUakLV9o1r9zA6h6Qs",
        userEmail
      );
      setIsAdmin(result);
    };

    useAdminUser();
  }, []);

  const handleUpdateTrip = async (id) => {
    if (isAuthor || isAdmin) {
      const document = doc(db, "trips", id);
      await updateDoc(document, {
        description: description,
        tripName: tripName,
        authorRating: authorRating,
      });
      console.log(auth.currentUser);
    }
    handleToggle();
  };

  //const lol = useState(true);

  const handleToggle = () => {
    setEditing((current) => !current);
  };

  const handleDeleteButtonClick = async (id) => {
    if (isAuthor || isAdmin) {
      const document = doc(db, "trips", id);
      await deleteDoc(document);
    }
    navigate("/");
  };

  return (
    <div key={trip.id}>
      <textarea
        className="title"
        disabled={!editing}
        value={tripName}
        onChange={(event) => {
          setTripName(event.target.value);
        }}
      />
      <h3 className="author">{trip.authorName}</h3>
      <img className="image" src={getImage(trip.region[0])} />
      <textarea
        className="tripDescription"
        disabled={!editing}
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
        }}
      />
      <div className="locationContainer">
        <div className="locationArray">Region: {trip.region.join(", ")}</div>
        <div className="locationArray">
          Countries: {trip.countries.join(", ")}
        </div>
      </div>
      <Rating
        className="tripRating"
        value={authorRating}
        readOnly={!editing}
        size="large"
        onChange={(event, newValue) => {
          const newRatings = trip.rating;
          const i = newRatings.indexOf(authorRating);
          if (i !== -1) {
            newRatings.splice(i, 1);
          }
          setAuthorRating(newValue);
          newRatings.push(newValue);
          addRating(trip.id, newRatings);
          calculateAverageRating();
        }}
      />
      <button
        className="lightbutton"
        id={isAuthor || isAdmin ? "editTripButton" : "notVisibleEditButton"}
        disabled={!(isAuthor || isAdmin)}
        onClick={
          editing
            ? () => {
                handleUpdateTrip(trip.id);
              }
            : () => handleToggle()
        }
      >
        {editing ? "Ferdig" : "Edit"}
      </button>
      <button
        className="lightbutton"
        id={isAuthor || isAdmin ? "deleteTripButton" : "notVisibleDeleteButton"}
        disabled={!(isAuthor || isAdmin)}
        onClick={() => {
          handleDeleteButtonClick(trip.id);
        }}
      >
        <img id="trashcan_icon" src={trashcan}></img>
        <h4 id="delete_text">Delete</h4>
      </button>
    </div>
  );
}

TripContainer.propTypes = {
  trip: PropTypes.object,
  calculateAverageRating: PropTypes.func.isRequired,
};

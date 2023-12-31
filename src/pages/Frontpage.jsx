import React, { useState, useEffect } from "react";
//import ReactDOM from 'react-dom';
import TripComponent from "../components/TripComponent.js";
import ToplistComponent from "../components/ToplistComponent.js";
import "../styles/frontpage.css";
import "../styles/toplist.css";
import PropTypes from "prop-types";
import { getAllTrips, searchFor, getSortedTripsByRating } from "../api/api.js";
import { NavLink } from "react-router-dom";
import calculateWeights from "../utils/calculateWeights.js";
import { auth } from "../firebase-config.js";
import sortWeights from "../utils/sortWeights.js";
import adHeader from "../img/nidarHeader.png";
import { FilterFrontpage } from "../components/FilterFrontpage.js";

//import image from "../img/test.jpg";

const FrontPage = () => {
  const [trips, setTrips] = useState([]);
  const [topList, setTopList] = useState([]);
  const [recommendedTrips, setReccommendedTrips] = useState([]);

  useEffect(() => {
    const fetchTopList = async () => {
      const allTrips = await getAllTrips();
      //console.log(allTrips);
      const bestTrips = await getSortedTripsByRating(allTrips);
      //console.log(bestTrips);
      let topSix = bestTrips.slice(0, 6);
      //console.log(topSix);
      setTopList(topSix);
    };

    fetchTopList();
  }, []);

  useEffect(() => {
    const fetchAllTrips = async () => {
      const allTrips = await getAllTrips();
      setTrips(allTrips);
    };

    const getRecommendedTrips = async () => {
      const userEmail = auth.currentUser.email;
      const userId = auth.currentUser.uid;
      const weights = await calculateWeights(userEmail);
      const topFourWeights = sortWeights(weights);
      const allTripsMatchingWeights = await searchFor(topFourWeights);
      const allTripsFiltered = allTripsMatchingWeights.filter(
        (trip) => trip.authorID != userId
      );
      const shuffled = allTripsFiltered.sort(() => 0.5 - Math.random());
      let fourTrips = shuffled.slice(0, 4);
      setReccommendedTrips(fourTrips);
    };

    fetchAllTrips();
    getRecommendedTrips();
  }, []);

  return (
    <div id="body">
      <NavLink to="/newtrip" id="shareTrip" className="button" type="button">
        Share your own adventure!
      </NavLink>
      {/*Topplisten */}
      <div id="toplist sectionLineBreak" className="sectionLineBreak">
        <h2>Top list</h2>
        <div id="toplist_grid">
          {topList.map((trip, index) => {
            const ratings = trip.rating;
            const average = Math.round(
              ratings.reduce((a, b) => a + b, 0) / ratings.length
            );
            return (
              <NavLink
                key={trip.id}
                to="/trip"
                state={{ from: trip }}
                style={{ textDecoration: "none" }}
              >
                <div className="toplist_item">
                  <div id="number_border">
                    <h3 className="toplist_number">{index + 1 + "."}</h3>
                  </div>

                  <ToplistComponent
                    tripID={trip.id}
                    name={trip.tripName}
                    averageRating={average}
                    region={trip.region[0]}
                  />
                </div>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/*Alle reisene på forsiden */}
      <div className="flex_images">
        <h2 className="header2">{auth.currentUser && "Recommended For You"}</h2>
        <div className="front_grid">
          {recommendedTrips.map((trip) => {
            const ratings = trip.rating;
            const average = Math.round(
              ratings.reduce((a, b) => a + b, 0) / ratings.length
            );
            return (
              <div key={trip.id}>
                <NavLink
                  key={trip.id}
                  to="/trip"
                  state={{ from: trip }}
                  style={{ textDecoration: "none" }}
                >
                  <TripComponent
                    tripID={trip.id}
                    name={trip.tripName}
                    averageRating={average}
                    region={trip.region[0]}
                  />
                </NavLink>
              </div>
            );
          })}
          <div className="sectionLineBreak"></div>
        </div>
        <div className="filter">
          {" "}
          <FilterFrontpage />
        </div>
        <h2 className="header2">Trips</h2>
        <div className="front_grid">
          {trips.map((trip) => {
            const ratings = trip.rating;
            const average = Math.round(
              ratings.reduce((a, b) => a + b, 0) / ratings.length
            );
            return (
              <NavLink
                key={trip.id}
                to="/trip"
                state={{ from: trip }}
                style={{ textDecoration: "none" }}
              >
                <TripComponent
                  tripID={trip.id}
                  name={trip.tripName}
                  averageRating={average}
                  region={trip.region[0]}
                />
              </NavLink>
            );
          })}
        </div>
        <a href="https://nidarkampanje.nidar.no/nidar-ving-kampanje/">
          <img className="adHeader" src={adHeader} alt="Ad Header" />
        </a>
      </div>
    </div>
  );
};

FrontPage.propTypes = {
  trips: PropTypes.array,
};

export default FrontPage;

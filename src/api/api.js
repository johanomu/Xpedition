import { db } from "../firebase-config";
import {
  getDocs,
  collection,
  addDoc,
  query,
  getDoc,
  where,
} from "firebase/firestore";

/* 
Trips storage format
{
    id: string,
    userMail: string
    tripName: string,
    countries: String[],
    area: string,
    rating: number[]
    description: string,
    comments: String[],
}
*/

const collectionName = "trips";
const tripsReference = collection(db, collectionName);

export const getAllTrips = async () => {
  try {
    const data = await getDocs(tripsReference);
    const tripsArray = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("tripsArray:", tripsArray);
    return tripsArray;
  } catch (err) {
    console.error(err);
  }
};

export const createTrip = async (
  id,
  userMail,
  tripName,
  countries,
  area,
  rating,
  description,
  comments
) => {
  try {
    await addDoc(tripsReference, {
      id: id,
      userMail: userMail,
      tripName: tripName,
      countries: countries,
      description: description,
      rating: rating,
      area: area,
      comments: comments,
    });
  } catch (err) {
    console.error("Error adding trip: ", err);
  }
};

export const getTripsByUser = async (userMail) => {
  try {
    const q = query(tripsReference, where("userMail", "==", userMail));
    const querySnapshot = await getDocs(q);
    const tripsArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return tripsArray;
  } catch (err) {
    console.error(err);
  }
};

export const getTripRating = async (tripId) => {
  try {
    const tripReference = collection(db, tripsReference, tripId);
    const tripSnapshot = await getDoc(tripReference);
    if (tripSnapshot.exists()) {
      return tripSnapshot.data();
    } else {
      console.log("No such trip exists.");
    }
  } catch (err) {
    console.error(err);
  }
};

import db from "../firebase/config.js";
import firebase from "firebase/compat/app";
import 'firebase/compat/database'

const d = new Date();

const getDataStudent = async () => {
  const events = db.collection("student");
  const tempDoc = [];
  await events
  .orderBy("dateJoin", 'asc')
  .get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      tempDoc.push({ id: doc.id, ...doc.data() });
    });
  });
  return tempDoc.sort();
};

export const addDataStudent = async (data) => {
  await db.collection("student").doc().set({
    citizenId: data.citizenId,
    class: data.class,
    code: data.code,
    dateOfBirth: (data.dateOfBirth._d).toString(),
    email: data.email,
    ganeration: data.ganeration,
    gender: data.gender,
    hometouwn: data.hometouwn,
    specialized: data.specialized,
    username: data.username,
    phone: data.phone,
    status: data.status,
    dateJoin: d.toString(),
  });
};

export const updateDataStudent = async (data, id) => {
  await db.collection("student").doc(id).update({
    citizenId: data.citizenId,
    class: data.class,
    code: data.code,
    dateOfBirth: data.dateOfBirth._d,
    email: data.email,
    ganeration: data.ganeration,
    gender: data.gender,
    hometouwn: data.hometouwn,
    specialized: data.specialized,
    username: data.username,
    phone: data.phone,
    status: data.status,
    dateJoin: d.toString(),
  });
};

export const filterStudent = async (key, value) => {
  const tempDoc = [];
  await db
    .collection("student")
    .where(key, "==", value)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        tempDoc.push({ id: doc.id, ...doc.data() });
      });
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
  return tempDoc;
};


export const deleteDataStudent = async (id) => {
  await db.collection("student").doc(id).delete();
};

export default getDataStudent;

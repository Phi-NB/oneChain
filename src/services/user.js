import db from "../firebase/config.js";

const d = new Date();

const getDataUser = async () => {
  const events = db.collection("user");
  const tempDoc = [];
  await events.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      tempDoc.push({ id: doc.id, ...doc.data() });
    });
  });
  return tempDoc;
};

export const addDataUser = async (data) => {
  await db.collection("user").doc().set({
    code: data.code,
    email: data.email,
    password: data.password,
    dateJoin: d.toString(),
  });
};

export const updateDataUser = async (data, id) => {
  await db.collection("user").doc(id).set({
    code: data.code,
    email: data.email,
    username: data.username,
    gender: data.gender,
    dateOfBirth: (data.dateOfBirth._d).toString(),
    hometouwn: data.hometouwn,
    citizenId: data.citizenId,
    phone: data.phone,
    dateJoin: d.toString(),
  });
};

export default getDataUser;

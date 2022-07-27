import db from "../firebase/config.js";
import sha256 from "crypto-js/sha256";

const d = new Date();

const hasd = (mess, key) => {
  const ciphertext = sha256(key + mess).toString();
  return ciphertext;
};

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
  await db
    .collection("user")
    .doc()
    .set({
      code: data.code,
      email: data.email,
      password: hasd("phi", data.password),
      dateJoin: d.toString(),
    });
};

export const updateDataUser = async (data, id, password, image) => {
  if (!data.dateOfBirth) {
    data.dateOfBirth = "";
  }
  if (!data.gender) {
    data.gender = "";
  }
  if (!data.username) {
    data.username = "";
  }
  if (!data.hometouwn) {
    data.hometouwn = "";
  }
  if (!data.citizenId) {
    data.citizenId = "";
  }
  if (!data.phone) {
    data.phone = "";
  }
  if (!image) {
    image = "";
  }
  console.log(data, id, password, image);
  await db
    .collection("user")
    .doc(id)
    .set({
      code: data.code,
      email: data.email,
      username: data.username,
      gender: data.gender,
      dateOfBirth:
        typeof data.dateOfBirth === "string"
          ? data.dateOfBirth
          : data.dateOfBirth._d.toString(),
      hometouwn: data.hometouwn,
      citizenId: data.citizenId,
      phone: data.phone,
      password: password.length > 20 ? password : hasd("phi", password),
      image: image,
    });
};

export default getDataUser;

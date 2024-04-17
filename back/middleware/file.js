const {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} = require("firebase/storage");
const storage = require("../config/firebase");
const sanitze = require("sanitize-filename");

const uploadFile = async (file, folder) => {
  try {
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("Uploading file to Firebase Storage...");

    const dateTime = giveCurrentDateTime();

    file.originalname = sanitze(file.originalname);

    const storageRef = ref(
      storage,
      `${folder}/${file.originalname + " " + dateTime}`
    );

    const metadata = {
      contentType: file.mimetype,
    };
    console.log("uploading");
    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );

    const downloadURL = await getDownloadURL(snapshot.ref);

    console.log("File successfully uploaded.");
    return {
      message: "file uploaded to firebase storage",
      path: snapshot.ref.fullPath,
      name: file.originalname,
      type: file.mimetype,
      downloadURL: downloadURL,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    console.log("File successfully deleted from Firebase Storage.");
    return true;
  } catch (error) {
    console.error("Error deleting file from Firebase Storage:", error);
    throw error;
  }
};

const giveCurrentDateTime = () => {
  const today = new Date();
  const date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  const time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const dateTime = date + " " + time;
  return dateTime;
};

module.exports = {
  uploadFile,
  deleteFile,
};

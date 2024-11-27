const fs = require("fs");

//MODES:
//0 for read json
//1 for write write json
//2 for write txt
//3 for changing file name
//4 for reading txt file

//Note: data= "" here meaning data is only = "" if the data argument is undefined or not provided
module.exports = async (filename, mode, data = "") => {
  //for reading data from a json file
  if (mode === 0) {
    try {
      const data = fs.readFileSync(`${filename}`, "utf8");
      return await JSON.parse(data);
    } catch (err) {
      // Handle error (file doesn't exist or is invalid JSON)
      console.error("Error reading data:", err);
      return null;
    }
    //For writing data to a json file
  } else if (mode === 1) {
    try {
      fs.writeFileSync(`${filename}`, JSON.stringify(data, null, 1), "utf8");
    } catch (err) {
      // Handle error (file couldn't be written)
      console.error("Error writing data:", err);
    }
    //For writing data to a txt file
  } else if (mode === 2) {
    try {
      fs.writeFileSync(`${filename}`, data, "utf8");
    } catch (err) {
      // Handle error (file couldn't be written)
      console.error("Error writing data:", err);
    }
  } else if (mode === 3) {
    fs.rename(filename, data, (err) => {
      if (err) {
        console.error("Error renaming file:", err);
      } else {
        console.log("File renamed successfully");
      }
    });
  } else if (mode === 4) {
    try {
      const data = fs.readFileSync(filename, "utf8");
      return data;
    } catch (err) {
      console.error("Error reading file:", err);
    }
  } else if (mode === 5) {
    fs.unlink(filename, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
        return;
      }
      console.log("File deleted successfully");
    });
  }
};

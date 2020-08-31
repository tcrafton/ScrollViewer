const { promisify } = require("util");
const fs = require("fs");
const os = require("os");
const lineByLine = require("n-readlines");

const imageFolder = "\\\\nm-admin\\admin\\hr\\DigitalSignage";
const logFolder = "\\\\nm-admin\\admin\\HR\\DigitalSignage\\logs\\";
//const logFolder = "C:\\temp\\DigitalSignage\\logs\\";
//const imageFolder = "C:\\temp\\DigitalSignage\\";

module.exports = {
  loadSlides: function () {
    const slides = [];

    let filenammes = fs.readdirSync(imageFolder);

    let webSites = this.loadWebSites();

    let combinedFiles = [...webSites, ...filenammes];

    combinedFiles.forEach((file) => {
      if (file.split(".").pop().toLocaleLowerCase() === "jpg") {
        let currentFile = file.split(/[_.]/);
        if (currentFile.length === 4) {
          slides.push({
            type: "image",
            order: currentFile[0],
            name: file,
            duration: currentFile[2],
          });
        }
      } else if (file.split("_").length === 3) {
        let webFile = file.split("_");
        slides.push({
          type: "web",
          order: webFile[0],
          name: webFile[1],
          duration: webFile[2],
        });
      }
    });

    return slides.sort((a, b) => {
      return a.order - b.order;
    });
  },

  loadWebSites: function () {
    const liner = new lineByLine(`${imageFolder}/webSites.txt`);
    const websites = [];
    let line;

    while ((line = liner.next())) {
      websites.push(line.toString("ascii").replace(/[\n\r]+/g, ""));
    }

    return websites;
  },

  updateLogFile: function (message) {
    fs.writeFile(logFolder + os.hostname() + ".txt", os.hostname(), function (
      err
    ) {
      if (err) {
        console.log(err);
      }
    });
  },
};

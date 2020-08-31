const { app, BrowserWindow, Menu } = require("electron");
const util = require("./util");
const log = require("electron-log");
const moment = require("moment");
const { updateLogFile } = require("./util");

// Set env
process.env.NODE_ENV = "development";

const isDev = process.env.NODE_ENV !== "production" ? true : false;

let mainWindow;

//const imageFolder = "\\\\nm-admin\\admin\\hr\\DigitalSignage\\";
const imageFolder = "C:\\temp\\DigitalSignage\\";
let slides = util.loadSlides();
let index = 0;
let slideDuration = 0;

log.info("App starting up ", moment().format("YYYY-MM-DD hh:mm:ss"));
updateLogFile();

let cycleSlides = () => {
  if (slides[index].type === "image") {
    try {
      mainWindow.loadURL(`${imageFolder}\\${slides[index].name}`);
    } catch (e) {
      log.error(`Error loading image ${slides[index].name} `, e);
    }
  } else if (slides[index].type === "web") {
    try {
      mainWindow.loadURL(slides[index].name);
    } catch (e) {
      console.log(`Error loading web page ${slides[index].name} `, e);
      log.error(`Error loading web page ${slides[index].name} `, e);
      updateLogFile();
    }
  }
  slideDuration = parseInt(slides[index].duration, 10) * 1000;
  index++;

  if (index >= slides.length) {
    index = 0;

    // reload the slides
    slides = util.loadSlides();
    updateLogFile();
  }

  setTimeout(cycleSlides, slideDuration);
};

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "ScrollViewerJS",
    frame: false,
    resizable: false,
    backgroundColor: "white",
    fullscreen: true,
  });

  cycleSlides();
}

app.on("ready", () => {
  createMainWindow();

  mainWindow.on("ready", () => (mainWindow = null));
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

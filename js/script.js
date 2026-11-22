"use strict";
const title = document.getElementsByTagName("h1")[0];
const plusBts = document.querySelector(".screen-btn");
const screenControls = document.querySelector(".main-controls__views.element");
const percentItems = document.querySelectorAll(".other-items.percent");
const numberItems = document.querySelectorAll(".other-items.number");

const range = document.querySelector(".rollback input[type='range']");
const rangeValue = document.querySelector(".rollback .range-value");

const startBts = document.getElementsByClassName("handler_btn")[0];
const resetButton = document.getElementsByClassName("handler_btn")[1];

const totalPrice = document.getElementsByClassName("total-input")[0];
const totalScreens = document.getElementsByClassName("total-input")[1];
const totalServices = document.getElementsByClassName("total-input")[2];
const totalFullPrice = document.getElementsByClassName("total-input")[3];
const totalRollback = document.getElementsByClassName("total-input")[4];

let screens = document.querySelectorAll(".screen");

const appData = {
  title: "",
  screens: [],
  screenPrice: 0,
  adaptive: true,
  rollback: 19,
  ServicePricesPercent: 0,
  ServicePricesNumber: 0,
  fullPrice: 0,
  servicePercentPrice: 0,
  servicesPercent: {},
  servicesNumber: {},
  init: function () {
    appData.addTitle();
    startBts.addEventListener("click", appData.start);
    plusBts.addEventListener("click", appData.addScreenBlock);
    screenControls.addEventListener("input", appData.updateCalculateButton);
    screenControls.addEventListener("change", appData.updateCalculateButton);
    range.addEventListener("input", appData.updateRollback);
    appData.updateCalculateButton();
    appData.updateRollback();
  },

  addTitle: function () {
    document.title = title.textContent;
  },

  start: function () {
    if (!appData.validateScreens()) {
      return;
    }

    appData.addScreens();
    appData.addServices();

    appData.addPrices();

    // appData.logger();
    appData.showResult();
  },

  showResult: function () {
    totalPrice.value = appData.screenPrice;
    totalServices.value =
      appData.ServicePricesPercent + appData.ServicePricesNumber;
    totalFullPrice.value = appData.fullPrice;
    totalRollback.value = appData.servicePercentPrice;
  },

  validateScreens: function () {
    screens = document.querySelectorAll(".screen");

    return (
      screens.length > 0 &&
      Array.from(screens).every(function (screen) {
        const select = screen.querySelector("select");
        const input = screen.querySelector("input");
        const count = Number(input.value);

        return select.value !== "" && Number.isInteger(count) && count > 0;
      })
    );
  },

  updateCalculateButton: function () {
    startBts.disabled = !appData.validateScreens();
  },

  addScreens: function () {
    screens = document.querySelectorAll(".screen");
    appData.screens = [];
    screens.forEach(function (screen, index) {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");
      const selectName = select.options[select.selectedIndex].textContent;
      const count = +input.value;

      appData.screens.push({
        id: index,
        typeScreen: selectName,
        count: count,
        price: +select.value * count,
      });
    });
  },

  addServices: function () {
    appData.servicesPercent = {};
    appData.servicesNumber = {};
    percentItems.forEach(function (item) {
      const check = item.querySelector("input[type=checkbox]");
      const input = item.querySelector("input[type=text]");
      const label = item.querySelector("label");
      if (check.checked) {
        appData.servicesPercent[label.textContent] = +input.value;
      }
    });

    numberItems.forEach(function (item) {
      const check = item.querySelector("input[type=checkbox]");
      const input = item.querySelector("input[type=text]");
      const label = item.querySelector("label");
      if (check.checked) {
        appData.servicesNumber[label.textContent] = +input.value;
      }
    });
  },

  addScreenBlock: function () {
    const cloneScreen = screens[0].cloneNode(true);
    cloneScreen.querySelector("select").selectedIndex = 0;
    cloneScreen.querySelector("input").value = "";
    screens[screens.length - 1].after(cloneScreen);
    appData.updateCalculateButton();
  },

  addPrices: function () {
    appData.screenPrice = 0;
    appData.ServicePricesPercent = 0;
    appData.ServicePricesNumber = 0;
    let screenCount = 0;

    for (let screen of appData.screens) {
      appData.screenPrice += +screen.price;
      screenCount += screen.count;
    }
    totalScreens.value = screenCount;

    for (const key in appData.servicesNumber) {
      appData.ServicePricesNumber += appData.servicesNumber[key];
    }

    for (const key in appData.servicesPercent) {
      appData.ServicePricesPercent +=
        appData.screenPrice * (appData.servicesPercent[key] / 100);
    }

    appData.fullPrice =
      +appData.screenPrice +
      appData.ServicePricesPercent +
      appData.ServicePricesNumber;
    appData.servicePercentPrice =
      appData.fullPrice -
      Math.ceil(appData.fullPrice * (appData.rollback / 100));
  },

  updateRollback: function () {
    appData.rollback = +range.value;
    rangeValue.textContent = appData.rollback + "%";
  },

  logger: function () {
    console.log(appData.fullPrice);
    console.log(appData.servicePercentPrice);
    console.log(appData.screens);
    for (const property in appData) {
      console.log(property, appData[property]);
    }
  },
};

appData.init();

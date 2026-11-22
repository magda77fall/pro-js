"use strict";
const title = document.getElementsByTagName("h1")[0];
const plusBts = document.querySelector(".screen-btn");
const percentItems = document.querySelectorAll(".other-items.percent");
const numberItems = document.querySelectorAll(".other-items.number");

const range = document.querySelector(".rollback input[type='range']");
const rangeValue = document.querySelector(".rollback .range-value");

const startBts = document.getElementById("start");
const resetButton = document.getElementById("reset");
const cmsOpen = document.getElementById("cms-open");
const cmsVariants = document.querySelector(".hidden-cms-variants");
const cmsSelect = document.getElementById("cms-select");
const cmsOtherInput = document.getElementById("cms-other-input");
const cmsOtherWrapper = cmsOtherInput.parentElement;

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
  rollback: 0,
  ServicePricesPercent: 0,
  ServicePricesNumber: 0,
  fullPrice: 0,
  servicePercentPrice: 0,
  servicesPercent: {},
  servicesNumber: {},
  initialControls: [],
  init() {
    this.initialControls = Array.from(
      document.querySelectorAll(".main-controls input, .main-controls select"),
    ).map((control) => ({
      element: control,
      value: control.value,
      disabled: control.disabled,
      checked: control.checked,
    }));
    this.addTitle();
    startBts.addEventListener("click", () => this.start());
    resetButton.addEventListener("click", () => this.reset());
    plusBts.addEventListener("click", () => this.addScreenBlock());
    range.addEventListener("input", () => this.updateRollback());
    cmsOpen.addEventListener("change", () => this.toggleCms());
    cmsSelect.addEventListener("change", () => this.toggleCmsOther());
    this.updateRollback();
    this.toggleCms();
    this.toggleCmsOther();
  },

  addTitle() {
    document.title = title.textContent;
  },

  start() {
    if (!this.validateScreens()) {
      return;
    }

    this.addScreens();
    this.addServices();

    this.addPrices();

    this.showResult();
    document
      .querySelectorAll(
        ".main-controls input[type='text'], .main-controls select",
      )
      .forEach((input) => {
        input.disabled = true;
      });
    plusBts.disabled = true;
    startBts.style.display = "none";
    resetButton.style.display = "block";
  },

  toggleCms() {
    cmsVariants.style.display = cmsOpen.checked ? "flex" : "none";
    if (!cmsOpen.checked) {
      cmsSelect.value = "";
      cmsOtherInput.value = "";
      cmsOtherWrapper.style.display = "none";
    }
  },

  toggleCmsOther() {
    cmsOtherWrapper.style.display =
      cmsOpen.checked && cmsSelect.value === "other" ? "block" : "none";
  },

  showResult() {
    totalPrice.value = this.screenPrice;
    totalScreens.value = this.screens.reduce((total, screen) => {
      return total + screen.count;
    }, 0);
    totalServices.value = this.ServicePricesPercent + this.ServicePricesNumber;
    totalFullPrice.value = this.fullPrice;
    totalRollback.value = this.servicePercentPrice;
  },

  validateScreens() {
    screens = document.querySelectorAll(".screen");

    return Array.from(screens).every((screen) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");
      const count = Number(input.value);

      return select.value !== "" && Number.isInteger(count) && count > 0;
    });
  },

  addScreens() {
    screens = document.querySelectorAll(".screen");
    this.screens = [];
    screens.forEach((screen, index) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");
      const selectName = select.options[select.selectedIndex].textContent;
      const count = +input.value;

      this.screens.push({
        id: index,
        typeScreen: selectName,
        count: count,
        price: +select.value * count,
      });
    });
  },

  addServices() {
    this.servicesPercent = {};
    this.servicesNumber = {};
    percentItems.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const input = item.querySelector("input[type=text]");
      const label = item.querySelector("label");
      if (check.checked) {
        this.servicesPercent[label.textContent] = +input.value;
      }
    });

    numberItems.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const input = item.querySelector("input[type=text]");
      const label = item.querySelector("label");
      if (check.checked) {
        this.servicesNumber[label.textContent] = +input.value;
      }
    });
  },

  addScreenBlock() {
    screens = document.querySelectorAll(".screen");
    const cloneScreen = screens[0].cloneNode(true);
    cloneScreen.querySelector("select").value = "";
    cloneScreen.querySelector("input").value = "";
    screens[screens.length - 1].after(cloneScreen);
  },

  addPrices() {
    this.screenPrice = 0;
    this.ServicePricesPercent = 0;
    this.ServicePricesNumber = 0;

    for (const screen of this.screens) {
      this.screenPrice += +screen.price;
    }

    for (const key in this.servicesNumber) {
      this.ServicePricesNumber += this.servicesNumber[key];
    }

    for (const key in this.servicesPercent) {
      this.ServicePricesPercent +=
        this.screenPrice * (this.servicesPercent[key] / 100);
    }

    this.fullPrice =
      +this.screenPrice + this.ServicePricesPercent + this.ServicePricesNumber;
    this.servicePercentPrice =
      this.fullPrice - Math.ceil(this.fullPrice * (this.rollback / 100));
  },

  updateRollback() {
    this.rollback = +range.value;
    rangeValue.textContent = `${this.rollback}%`;
  },

  reset() {
    screens = document.querySelectorAll(".screen");
    screens.forEach((screen, index) => {
      if (index > 0) {
        screen.remove();
      }
    });

    this.initialControls.forEach((initialControl) => {
      initialControl.element.value = initialControl.value;
      initialControl.element.disabled = initialControl.disabled;
      initialControl.element.checked = initialControl.checked;
    });

    cmsVariants.style.display = "none";
    cmsOtherWrapper.style.display = "none";
    plusBts.disabled = false;
    this.screens = [];
    this.screenPrice = 0;
    this.ServicePricesPercent = 0;
    this.ServicePricesNumber = 0;
    this.fullPrice = 0;
    this.servicePercentPrice = 0;
    this.rollback = 0;
    this.servicesPercent = {};
    this.servicesNumber = {};
    range.value = 0;
    rangeValue.textContent = "0%";
    totalPrice.value = 0;
    totalScreens.value = 0;
    totalServices.value = 0;
    totalFullPrice.value = 0;
    totalRollback.value = 0;
    startBts.style.display = "block";
    resetButton.style.display = "none";
  },

  logger() {
    console.log(this.fullPrice);
    console.log(this.servicePercentPrice);
    console.log(this.screens);
    for (const property in this) {
      console.log(property, this[property]);
    }
  },
};

appData.init();

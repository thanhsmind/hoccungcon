// jsdom test-environment shims for browser APIs the app uses but jsdom lacks.
// Proven necessary while validating the smoke net (see docs/history/modularize-app).

// App calls window.scrollTo on lesson navigation (src/App.jsx).
window.scrollTo = () => {};

// NumberLine measures itself with a ResizeObserver (src/App.jsx).
globalThis.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Guard any responsive matchMedia lookups.
if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    media: "",
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  });
}

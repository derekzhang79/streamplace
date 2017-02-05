
/* eslint-disable no-console */
/* global nw */

const env = {
  URL: null,
  SELECTOR: null,
  POLL_TIMEOUT: "60000",
};

const windowOptions = {
  "title": "Streamplace Compositor",
  "width": 1920,
  "height": 1080,
  "min_width": 1920,
  "min_height": 1080,
  "resizable": true,
  "frame": true
};

let quit = false;
Object.keys(env).forEach((key) => {
  if (process.env[key]) {
    env[key] = process.env[key];
  }
  if (!env[key]) {
    quit = true;
    console.error(`Missing required environment variable: ${key}`);
  }
});
if (quit) {
  process.exit(1);
}

const pollForElement = function(document, selector) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      clearInterval(interval);
      reject(`Couldn't find document.querySelector("${selector}") in ${env.POLL_TIMEOUT}ms!`);
    }, parseInt(env.POLL_TIMEOUT));
    const poll = () => {
      const elem = document.querySelector(selector);
      if (elem) {
        clearTimeout(timeout);
        clearInterval(interval);
        resolve(elem);
      }
    };
    const interval = setInterval(poll, 10);
    poll();
  });
};

nw.Window.open(process.env.URL, windowOptions, function(new_win) {
  // And listen to new window's focus event
  const document = new_win.window.document;
  const worker = new Worker("worker.js");
  new_win.on("close", function() {
    process.exit(0);
  });
  new_win.on("loaded", function() {
    console.log(`Window loaded, polling for document.querySelector("${env.SELECTOR}")`);
    const start = Date.now();
    pollForElement(document, env.SELECTOR)
    .then((elem) => {
      console.log(`Found ${elem} in ${Date.now() - start}ms`);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
  });
});

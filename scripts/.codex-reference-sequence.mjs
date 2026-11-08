import { spawn } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

const edge = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = 9342;
const profile = await mkdtemp(path.join(tmpdir(), "reference-sequence-"));
const output = path.resolve(".next/local-intro-sequence");
await mkdir(output, { recursive: true });

const browser = spawn(edge, [
  "--headless=new",
  "--disable-gpu",
  "--disable-crash-reporter",
  "--hide-scrollbars",
  `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`,
  "about:blank",
], { stdio: "ignore" });

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function target() {
  for (let index = 0; index < 60; index += 1) {
    try {
      const pages = await fetch(`http://127.0.0.1:${port}/json/list`).then((response) => response.json());
      const page = pages.find((item) => item.type === "page");
      if (page) return page;
    } catch {}
    await delay(100);
  }
  throw new Error("CDP target unavailable");
}

const page = await target();
const socket = new WebSocket(page.webSocketDebuggerUrl);
const pending = new Map();
let id = 0;

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  const callback = pending.get(message.id);
  if (!callback) return;
  pending.delete(message.id);
  if (message.error) callback.reject(new Error(message.error.message));
  else callback.resolve(message.result);
});

await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

function command(method, params = {}) {
  id += 1;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

async function snapshot(label) {
  let screenshot;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    try {
      screenshot = await command("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: false,
        fromSurface: true,
      });
      break;
    } catch {
      await delay(40);
    }
  }
  if (!screenshot) throw new Error(`Screenshot unavailable for ${label}`);
  await writeFile(path.join(output, `${label}.png`), Buffer.from(screenshot.data, "base64"));

  const state = await command("Runtime.evaluate", {
    expression: `(() => {
      const candidates = [...document.querySelectorAll('body *')]
        .filter((element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return (style.position === 'fixed' || style.position === 'absolute') && rect.width > innerWidth * 0.75 && rect.height > innerHeight * 0.75;
        })
        .map((element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return {
            tag: element.tagName,
            className: String(element.className).slice(0, 220),
            text: element.textContent?.trim().slice(0, 120),
            opacity: style.opacity,
            visibility: style.visibility,
            transform: style.transform,
            filter: style.filter,
            maskPosition: style.maskPosition,
            maskSize: style.maskSize,
            transitionDuration: style.transitionDuration,
            background: style.backgroundColor,
            zIndex: style.zIndex,
            rect: [Math.round(rect.left), Math.round(rect.top), Math.round(rect.width), Math.round(rect.height)],
          };
        });
      return {
        readyState: document.readyState,
        bodyText: document.body?.innerText.slice(0, 160),
        bodyClass: document.body?.className,
        htmlClass: document.documentElement.className,
        reveals: [...document.querySelectorAll('.intro-reveal')].map((element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return {
            className: String(element.className).slice(0, 220),
            text: element.textContent?.trim().replace(/\\s+/g, ' ').slice(0, 100),
            rect: [Math.round(rect.left), Math.round(rect.top), Math.round(rect.width), Math.round(rect.height)],
            filter: style.filter,
            maskPosition: style.maskPosition,
            transitionDuration: style.transitionDuration,
            transitionTimingFunction: style.transitionTimingFunction,
          };
        }),
        candidates,
      };
    })()`,
    returnByValue: true,
  });
  return { label, ...state.result.value };
}

try {
  await command("Page.enable");
  await command("Runtime.enable");
  await command("Network.enable");
  await command("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: 1440,
    screenHeight: 1000,
  });

  const started = Date.now();
  await command("Page.navigate", { url: "http://127.0.0.1:3000/" });
  const schedule = [0, 80, 180, 320, 500, 750, 1000, 1400, 1900, 2600, 3600];
  const reports = [];
  for (const point of schedule) {
    const remaining = started + point - Date.now();
    if (remaining > 0) await delay(remaining);
    reports.push(await snapshot(`t-${String(point).padStart(4, "0")}`));
  }
  process.stdout.write(`${JSON.stringify(reports, null, 2)}\n`);
} finally {
  socket.close();
  browser.kill();
  if (browser.exitCode === null) await new Promise((resolve) => browser.once("exit", resolve));
  await delay(250);
  await rm(profile, { recursive: true, force: true, maxRetries: 8, retryDelay: 125 }).catch(() => {});
}

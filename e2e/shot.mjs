import { chromium, devices } from "@playwright/test";
const [,, hashes="c01", vp="1440x900", wait="2600"] = process.argv;
const browser = await chromium.launch();
const isMobile = vp === "mobile";
const ctx = await browser.newContext(isMobile ? { ...devices["iPhone 14"] } : { viewport: { width: +vp.split("x")[0], height: +vp.split("x")[1] } });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(`${m.type()}: ${m.text()}`); });
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
for (const h of hashes.split(",")) {
  await page.goto(`http://localhost:3100/${h.startsWith("painel") ? h : "#" + h}`); await page.reload();
  await page.waitForTimeout(+wait);
  await page.screenshot({ path: `e2e/shots/${h.replace("/", "_")}-${isMobile ? "mobile" : vp}.png` });
}
console.log(errors.length ? errors.join("\n") : "no console errors");
await browser.close();

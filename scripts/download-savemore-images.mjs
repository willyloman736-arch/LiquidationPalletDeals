// Downloads Save More product images through the wsrv.nl proxy (origin TLS is
// broken, proxy fetches server-side) and converts to WebP. Prunes failures.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import https from "node:https";

const OUT = "public/images/savemore";
mkdirSync(OUT, { recursive: true });
const items = JSON.parse(readFileSync("import/mapped.json", "utf8"));

const weserv = (src) =>
  "https://wsrv.nl/?url=" + encodeURIComponent(src.replace(/^https?:\/\//, "")) + "&output=webp&w=1400&q=82";

function fetchBuf(u) {
  return new Promise((res, rej) => {
    const req = https.get(u, (r) => {
      if (r.statusCode !== 200) { r.resume(); return rej(new Error("HTTP " + r.statusCode)); }
      const ct = r.headers["content-type"] || "";
      const chunks = [];
      r.on("data", (c) => chunks.push(c));
      r.on("end", () => {
        const b = Buffer.concat(chunks);
        if (!/image/.test(ct) || b.length < 500) return rej(new Error("bad " + ct + " " + b.length));
        res(b);
      });
    });
    req.on("error", rej);
    req.setTimeout(45000, () => req.destroy(new Error("timeout")));
  });
}

const tasks = [];
items.forEach((it) => it._source.origImages.forEach((src, j) =>
  tasks.push({ handle: it.handle, j, src, dest: `${OUT}/${it.handle}-${j + 1}.webp` })));

let done = 0, ok = 0, fail = 0;
const failedByHandle = {};
async function worker() {
  while (tasks.length) {
    const t = tasks.pop();
    let success = false;
    if (existsSync(t.dest)) success = true;
    for (let a = 0; a < 2 && !success; a++) {
      try { writeFileSync(t.dest, await fetchBuf(weserv(t.src))); success = true; }
      catch (e) { if (a === 1) (failedByHandle[t.handle] = failedByHandle[t.handle] || []).push(t.j); }
    }
    done++; success ? ok++ : fail++;
    if (done % 25 === 0) console.log(`${done}/${done + tasks.length} (ok ${ok}, fail ${fail})`);
  }
}
const total = tasks.length;
await Promise.all(Array.from({ length: 6 }, worker));
console.log(`Downloaded ${ok}/${total}, failed ${fail}`);

items.forEach((it) => {
  const failed = new Set(failedByHandle[it.handle] || []);
  it.images = it.images.filter((_, j) => !failed.has(j));
});
writeFileSync("import/mapped.json", JSON.stringify(items, null, 2));
const noImg = items.filter((it) => it.images.length === 0);
console.log("Products with NO images:", noImg.length, noImg.map((p) => p.handle).join(", "));

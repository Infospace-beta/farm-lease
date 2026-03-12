import { readFileSync, writeFileSync } from "fs";

const path =
  "c:/Users/Quinter/Desktop/Farmlease/farm-lease/frontend/src/app/(main)/lessee/browse/page.tsx";
let c = readFileSync(path, "utf8");

// Find the start of the leftover stale content (after the empty ALL_LISTINGS line)
const emptyDecl =
  "const ALL_LISTINGS: Listing[] = []; // populated from API at runtime";
const si = c.indexOf(emptyDecl);
if (si === -1) {
  console.error("could not find empty decl");
  process.exit(1);
}

const afterDecl = c.slice(si + emptyDecl.length);

// The leftover starts with:  "\n  {\n    name: \"Highland..."
// It ends at the last item:  "status: null,\n  },\n];"
const arrayEndPattern = "status: null,\n  },\n];";
const endIdx = afterDecl.indexOf(arrayEndPattern);
if (endIdx === -1) {
  console.error("could not find end");
  process.exit(1);
}

// Cut everything between [empty declaration end] and [end of stale array]
const prolog = c.slice(0, si + emptyDecl.length);
const epilog = afterDecl.slice(endIdx + arrayEndPattern.length);

c = prolog + epilog;

console.log("done", c.split("\n").length, "lines");
writeFileSync(path, c, "utf8");

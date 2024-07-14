#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import process from "node:process";
import { parseArgs } from "node:util";
import { exportToPDF } from "./index.mjs";
import pkg from "./package.json" with { type: "json" };

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    //verbose: { type: "boolean", short: "v" },
    help: { type: "boolean", short: "h" },
  },
  allowPositionals: true,
});

function help() {
  return [`${pkg.name} - ${pkg.version}`, ``, `Usage: ${pkg.name} <configuration.json>`].join("\n");
}

if (values.help) {
  console.log(help());
  process.exit(0);
}

if (!positionals?.length) {
  console.error('please provide a JSON configuration')
  console.log(help());
  process.exit(1);
}

for (const configuration of positionals) {
  const data = await readFile(configuration, {encoding: 'utf-8'})
  const file = `${configuration}.pdf`
  await exportToPDF(JSON.parse(data), file)
  console.log(`Exported ${configuration} to ${file}`)
}



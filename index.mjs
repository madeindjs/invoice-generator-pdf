import dayjs from "dayjs";
import { validate } from "jsonschema";
import { createWriteStream } from "node:fs";
import PdfMake from "pdfmake";
import pkg from "./package.json" with { type: "json" };
import jsonSchema from "./schema.json" with { type: "json" };

/**
 *
 * @param {import("./model").InvoiceData} data
 * @param {string} path
 */
export function exportToPDF(data, path) {
  const dataErrors = validate(data, jsonSchema);
  if (!dataErrors.valid) throw Error(`Data is not valid: ${dataErrors.toString()}`);

  const printer = new PdfMake({
    Times: {
      normal: 'Times-Roman',
      bold: 'Times-Bold',
      italics: 'Times-Italic',
      bolditalics: 'Times-BoldItalic'
    },
  });

  const separator = { text: " ", separator: true };

  const totalHours = data.items.reduce((acc, item) => acc + item.hours, 0);
  const totalMoney = totalHours * data.pricePerHour;

  const dueDate = dayjs(data.issueDate).add(1, "month").toDate();

  const marginSeparator = 10;

  const pdfDoc = printer.createPdfKitDocument({
    info: {
      author: `${data.me.name} <${data.me.email}>`,
      creationDate: new Date(),
      title: `${data.id}`,
      subject: `Invoice for ${data.recipient.name}: ${data.id}`,
      producer: `${pkg.name} v${pkg.version} <${pkg.repository.url}>`,
      keywords: `Invoice, ${data.recipient.name}, ${data.id}`,
    },
    content: [
      // My personal informations
      [
        data.me.name,
        data.me.address,
        { text: data.me.phone, link: `tel:${data.me.phone}` },
        { text: data.me.email, link: `mailto:${data.me.email}` },
        { text: data.me.website, link: data.me.website },
      ],
      // billed informations
      [
        { text: "Billed to", alignment: "right", italics: true },
        { text: data.recipient.name, alignment: "right" },
        { text: data.recipient.address, alignment: "right", marginBottom: marginSeparator },
      ],
      separator,
      { text: `Invoice n° ${data.id}`, headlineLevel: 1, style: "header" },
      `Invoice issue date: ${dateFormater.format(data.issueDate)}`,
      `Date of service: from ${dateFormater.format(data.fromDate)} to ${dateFormater.format(data.toDate)}`,
      `Payment deadline: ${dateFormater.format(dueDate)}`,
      // billed items
      {
        style: "table",
        table: {
          widths: ["*", 100, 100],
          body: [
            [
              { text: "Item", style: "tableHeader" },
              { text: "Quantity *", style: "tableHeader" },
              { text: "Total **", style: "tableHeader" },
            ],
            ...data.items.map((item) => [
              item.name,
              { text: `${hoursFormater.format(item.hours)} hours` },
              { text: moneyFormater.format(item.hours * data.pricePerHour) },
            ]),
            [
              { text: "Total", alignment: "right" },
              { text: `${hoursFormater.format(totalHours)} hours` },
              { text: moneyFormater.format(totalMoney) },
            ],
          ],
        },
      },
      {
        text: `* The unit price is ${moneyFormater.format(data.pricePerHour)} per hour`,
        style: "note",
      },
      {
        text: "** VAT not applicable according to article 259-1 of the French Tax General Code (CGI)",
        style: "note",
        marginBottom: marginSeparator,
      },
      separator,
      "Terms of payment : Payment on receipt of invoice.",
      "Discount for early payment: none.",
      "Cash payment on receipt of invoice.",
      "Method of payment : By bank transfer to the following address",
      { text: data.bankInformations, alignment: "center", marginTop: marginSeparator },
    ],
    defaultStyle: {
      lineHeight: 1.2,
      font: 'Times'
    },
    styles: {
      header: {
        fontSize: 12,
        bold: true,
        marginBottom: marginSeparator,
      },

      table: {
        marginTop: marginSeparator,
        marginBottom: marginSeparator,
      },

      tableHeader: {
        bold: true,
      },
      note: {
        italics: true,
        alignment: "right",
      },
    },
  });

  return new Promise((res, rej) => {
    const stream = pdfDoc.pipe(createWriteStream(path));
    stream.on("finish", res);
    stream.on("error", rej);
    pdfDoc.end();
  });
}

const hoursFormater = Intl.NumberFormat("en-US", {
  style: "decimal",
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const moneyFormater = Intl.NumberFormat("en-US", {
  currency: "EUR",
  style: "currency",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
});

const dateFormater = {
  format(date) {
    return new Date(date).toISOString().split("T").shift() ?? "Unknown date";
  },
};

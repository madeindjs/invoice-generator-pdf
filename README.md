# Invoice Generator PDF

[![npm version](https://badge.fury.io/js/invoice-generator-pdf.svg)](https://badge.fury.io/js/invoice-generator-pdf)

Generate PDF invoice using [PDFMake](https://www.npmjs.com/package/pdfmake) from JSON definition.

You need to defined as a JSON file like [this example](./example.json)

```json
{
  "id": "INVOICE-0001",
  "me": {
    "name": "Jean L'astuce",
    "address": "1 rue des Lilas, 69001, Lyon",
    "phone": "+336123456",
    "email": "me@example.com",
    "website": "https://example.com"
  },
  "recipient": { "name": "ACME", "address": "1 avenue des Champs Elysée, 75001, Paris" },
  "fromDate": "2024-06-10",
  "toDate": "2024-07-07",
  "issueDate": "2024-07-11T08:18:45.748Z",
  "items": [
    { "name": "Software development - 2024 W25", "hours": 9.5 },
    { "name": "Software development - 2024 W26", "hours": 8 },
    { "name": "Software development - 2024 W27", "hours": 7.6 }
  ],
  "pricePerHour": 50,
  "bankInformations": "BIC: ABC1234 | IBAN: FR12 1234 1234 1234 1234 1234 123"
}
```

... and run the script

```sh
invoice-generator-pdf example.json
# or for local testing
npm run cli example.json
```

It will generate a PDF like [the following example](./example.json.pdf).

You can check the complete JSON schema [here](./schema.json).

DISCLAIMER: this tool is mainly for my own purpose.

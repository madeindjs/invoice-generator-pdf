export interface InvoiceData {
  id: string;
  me: Me;
  recipient: Recipient;
  fromDate: string;
  toDate: string;
  issueDate: string;
  items: Item[];
  pricePerHour: number;
  bankInformations: string;
}
interface Item {
  name: string;
  hours: number;
}
interface Recipient {
  name: string;
  address: string;
}
interface Me {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
}

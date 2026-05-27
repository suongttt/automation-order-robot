import * as XLSX from 'xlsx';

export type RobotOrder = {
  orderNo: string;
  head: string;
  body: string;
  legs: string;
  address: string;
};

type OrderRow = {
  'Order No': string | number;
  Head: string | number;
  Body: string | number;
  Legs: string | number;
  Address: string;
};

export function readOrdersFromExcel(path = './data/order.xlsx'): RobotOrder[] {
  const workbook = XLSX.readFile(path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json<OrderRow>(sheet, { defval: '' });

  return rows.map((row) => ({
    orderNo: String(row['Order No']),
    head: String(row.Head),
    body: String(row.Body),
    legs: String(row.Legs),
    address: String(row.Address),
  }));
}

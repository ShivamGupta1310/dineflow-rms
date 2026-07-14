import {
  BillSummary,
  BillSummaryFlatItem,
  BillSummaryRestaurantDetails,
} from "@appTypes";
import { formatDate } from "@utils";
import { Common_Values, Date_Format } from "@utils/constants";

interface BuildBillSummaryPdfHtmlParams {
  billNumber?: string | null;
  tableId?: number | string | null;
  customerName?: string | null;
  customerMobile?: string | null;
  sessionStartedAt?: string | null;
  totalGuest?: number | string | null;
  cgstPercentage?: number | string | null;
  sgstPercentage?: number | string | null;
  discountAmount?: number | string | null;
  paymentMethod?: string | null;
  items: BillSummaryFlatItem[];
  summary: BillSummary;
  restaurant_details?: BillSummaryRestaurantDetails | null;
}

const escapeHtml = (value: string | number | null | undefined): string =>
  String(value ?? Common_Values.EMPTY_PLACEHOLDER)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatCurrencyValue = (value: number | string | null | undefined) =>
  `₹${Number(value ?? 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const renderItemRows = (items: BillSummaryFlatItem[]) =>
  items.length
    ? items
        .map((item) => {
          const itemTotal = (item.unit_price ?? 0) * (item.quantity ?? 0);

          return `
        <tr>
          <td>${escapeHtml(item.item_name)}</td>
          <td align="right">${formatCurrencyValue(item.unit_price)}</td>
          <td align="right">${escapeHtml(item.quantity)}</td>
          <td align="right">${formatCurrencyValue(itemTotal)}</td>
        </tr>
      `;
        })
        .join("")
    : `
      <tr>
        <td colspan="4" align="center">${Common_Values.EMPTY_PLACEHOLDER}</td>
      </tr>
    `;

export const generateHtml = ({
  billNumber,
  tableId,
  customerName,
  customerMobile,
  sessionStartedAt,
  totalGuest,
  cgstPercentage,
  sgstPercentage,
  discountAmount,
  paymentMethod,
  items,
  summary,
  restaurant_details,
}: BuildBillSummaryPdfHtmlParams) => {
  const safeGstNumber = escapeHtml(restaurant_details?.gstin);
  const safeFssaiNumber = escapeHtml(restaurant_details?.fssai);
  const sessionDate = formatDate(sessionStartedAt ?? "", Date_Format.DD_MM_YY);
  const sessionTime = formatDate(
    sessionStartedAt ?? "",
    Date_Format.TIME_12_HOUR,
  );
  const safeBillNumber = escapeHtml(billNumber);
  const safeTableId = escapeHtml(tableId);
  const safeCustomerName = escapeHtml(customerName);
  const safeCustomerMobile = escapeHtml(customerMobile);
  const safeTotalGuest = escapeHtml(totalGuest);
  const safePaymentMethod = escapeHtml(paymentMethod);
  const safeCgstPercentage = Number(cgstPercentage ?? 0);
  const safeSgstPercentage = Number(sgstPercentage ?? 0);
  const safeDiscountAmount = Number(discountAmount ?? 0);

  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            color: #151B1E;
          }
          .center {
            text-align: center;
          }
          .meta {
            width: 100%;
            margin-top: 16px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th {
            padding-bottom: 8px;
            border-bottom: 2px dashed #bdbdbd;
          }
          td {
            padding: 8px 0;
          }
          hr {
            border: none;
            border-top: 2px dashed #bdbdbd;
          }
          .restaurant-name {
            font-size: 24px;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 6px;
            letter-spacing: 0.5px;
          }
          .restaurant-address {
            font-size: 13px;
            color: #475569;
            line-height: 1.4;
            max-width: 85%;
            margin: 0 auto 6px auto;
          }
          .restaurant-contact {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 8px;
          }
          .restaurant-reg {
            font-size: 12px;
            color: #334155;
            line-height: 1.5;
            margin-bottom: 4px;
          }
          .dashed-divider {
            display: flex;
            align-items: center;
            text-align: center;
            width: 100%;
            color: #151B1E;
            font-size: 14px;
            margin: 20px 0;
          }
          .dashed-divider::before,
          .dashed-divider::after {
            content: "";
            flex: 1;
            border-bottom: 2px dashed #bdbdbd;
          }
          .dashed-divider::before {
            margin-right: 10px;
          }
          .dashed-divider::after {
            margin-left: 10px;
          }
          .summary {
            width: 100%;
            margin-top: 10px;
          }
          .summary td {
            padding: 6px 0;
          }
          .summary-label {
            font-weight: bold;
          }
          .summary-total {
            font-size: 16px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="center">
          <div class="restaurant-name">${escapeHtml(
            restaurant_details?.restaurant_name,
          )}</div>
          <div class="restaurant-address">${escapeHtml(
            restaurant_details?.full_address,
          )}</div>
          <div class="restaurant-contact">
            ${
              restaurant_details?.phone
                ? `<span><b>Phone:</b> ${escapeHtml(
                    restaurant_details.phone,
                  )}</span>`
                : ""
            }
            ${
              restaurant_details?.phone && restaurant_details?.email
                ? `<span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>`
                : ""
            }
            ${
              restaurant_details?.email
                ? `<span><b>Email:</b> ${escapeHtml(
                    restaurant_details.email,
                  )}</span>`
                : ""
            }
          </div>
          <div class="restaurant-reg">
            ${
              restaurant_details?.gstin
                ? `<div><b>GSTIN:</b> ${safeGstNumber}</div>`
                : ""
            }
            ${
              restaurant_details?.fssai
                ? `<div><b>FSSAI No:</b> ${safeFssaiNumber}</div>`
                : ""
            }
          </div>

          <div class="dashed-divider">
            <p>BILL SUMMARY</p>
          </div>
        </div>

        <table class="meta">
          <tr>
            <td><b>Bill No:</b> ${safeBillNumber}</td>
            <td align="right"><b>Table:</b> ${safeTableId}</td>
          </tr>
          <tr>
            <td><b>Name:</b> ${safeCustomerName}</td>
            <td align="right"><b>Mobile:</b> ${safeCustomerMobile}</td>
          </tr>
          <tr>
            <td><b>Guests:</b> ${safeTotalGuest}</td>
            <td align="right">
              <b>Date:</b> ${sessionDate} &nbsp;&nbsp; <b>Time:</b> ${sessionTime}
            </td>
          </tr>
        </table>

        <hr />

        <table>
          <tr>
            <th align="left">Item</th>
            <th align="right">Price</th>
            <th align="right">Qty</th>
            <th align="right">Total</th>
          </tr>
          ${renderItemRows(items)}
        </table>

        <hr />

        <table class="summary">
          <tr>
            <td class="summary-label">Sub Total</td>
            <td align="right">${formatCurrencyValue(summary.subtotal)}</td>
          </tr>
          <tr>
            <td class="summary-label">CGST (${safeCgstPercentage}%)</td>
            <td align="right">${formatCurrencyValue(summary.cgstAmount)}</td>
          </tr>
          <tr>
            <td class="summary-label">SGST (${safeSgstPercentage}%)</td>
            <td align="right">${formatCurrencyValue(summary.sgstAmount)}</td>
          </tr>
          ${
            safeDiscountAmount > 0
              ? `
                <tr>
                  <td class="summary-label">Discount</td>
                  <td align="right">${formatCurrencyValue(
                    safeDiscountAmount,
                  )}</td>
                </tr>
              `
              : ""
          }
        </table>

        <hr />

        <table class="summary">
          <tr>
            <td class="summary-label">Payment Mode</td>
            <td align="right">${
              safePaymentMethod || Common_Values.EMPTY_PLACEHOLDER
            }</td>
          </tr>
          <tr>
            <td class="summary-total">Total</td>
            <td align="right" class="summary-total">${formatCurrencyValue(
              summary.grandTotal,
            )}</td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

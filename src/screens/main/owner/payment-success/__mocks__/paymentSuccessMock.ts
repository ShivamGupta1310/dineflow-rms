export const mockPaymentDetails = {
  billNumber: "BILL-101",
  subTotal: 500,
  cgstAmount: 45,
  sgstAmount: 45,
  cgstPercentage: 9,
  sgstPercentage: 9,
  discount: 0,
  grandTotal: 590,
  paidAt: "2026-06-25T13:43:30+05:30",
  tableId: 7,
  customerName: "Ava",
  customerMobile: "9999999999",
  sessionStartedAt: "2026-06-17T10:00:00.000Z",
  totalGuest: 4,
  items: [],
  restaurant_details: {
    restaurant_name: "Under The Neem Trees",
    full_address: "Opp. Mahila Municipal Garden, Rajpath Rangoli Rd, Bodakdev, Ahmedabad, Gujarat, India, 380059",
    gstin: "GST123",
    fssai: "FSSAI456",
    email: "undertheneemtrees@gmail.com",
    phone: "9876543210",
  },
};

export const defaultMockResultDetails = {
  billNumber: "BILL-1245",
  subTotal: 1046,
  cgstAmount: 94,
  sgstAmount: 94,
  discount: 0,
  grandTotal: 1234,
  paidAt: "2026-06-25T13:43:30+05:30",
};

export const generateHTMLMock = {
  billNumber: "BILL-101",
  tableId: 7,
  paymentMethod: "CASH",
  summary: {
    subtotal: 500,
    cgstAmount: 45,
    sgstAmount: 45,
    taxAmount: 90,
    grandTotal: 590,
  },
  restaurant_details: {
    restaurant_name: "Under The Neem Trees",
    full_address: "Opp. Mahila Municipal Garden, Rajpath Rangoli Rd, Bodakdev, Ahmedabad, Gujarat, India, 380059",
    gstin: "GST123",
    fssai: "FSSAI456",
    email: "undertheneemtrees@gmail.com",
    phone: "9876543210",
  },
};

export const userSelectorMock = {
  auth: {
    user: {
      gst_number: "GST123",
      fssai_license_number: "FSSAI456",
    },
  },
};

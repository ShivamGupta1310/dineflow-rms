export const mockState = {
  auth: {
    ownerId: 42,
    sessionId: "session-123",
    user: {
      first_name: "Priya",
      avatar: "https://example.com/avatar.png",
      owner_id: 42,
    },
  },
  ownerDashboard: {
    data: {
      start_date: "2026-06-17",
      end_date: "2026-06-17",
      sales: {
        amount: 123456,
        change_percentage: 12,
        trend: "UP",
      },
      orders: {
        count: 54,
        change_percentage: 8,
        trend: "UP",
      },
      reservations: {
        count: 18,
        change_percentage: 3,
        trend: "DOWN",
      },
      tables: {
        available: 7,
        occupied: 5,
        total: 12,
      },
      active_staff: 9,
      currency: "INR",
    },
    loading: false,
    error: null,
  },
  ownerTables: {
    tables: [
      {
        table_id: 11,
        table_number: "A1",
        capacity: 4,
        status: "occupied",
        occupied_at: "2026-06-17T11:30:00.000Z",
        total_order_amount: 2400,
        created_at: "2026-06-17T10:00:00.000Z",
      },
      {
        table_id: 12,
        table_number: "5",
        capacity: 2,
        status: "available",
        occupied_at: null,
        total_order_amount: 0,
        created_at: "2026-06-17T10:05:00.000Z",
      },
    ],
    loading: false,
    error: null,
  },
};

export const staffList = [
  {
    staff_id: 19,
    first_name: "Ravi",
    last_name: "Patel",
    phone_number: "9000000002",
    employee_code: "EMP002",
    role: "Captain",
    shift_type: "Evening",
    is_active: true,
    created_at: "2026-05-26T10:06:33.513507+00:00",
    avatar: "https://i.pravatar.cc/250?u=ravipatel@pravatar.com",
  },
  {
    staff_id: 20,
    first_name: "Suresh",
    last_name: "Mehta",
    phone_number: "9000000003",
    employee_code: "EMP003",
    role: "Captain",
    shift_type: "Morning",
    is_active: true,
    created_at: "2026-05-26T10:06:33.513507+00:00",
    avatar: "https://i.pravatar.cc/250?u=sureshmehta@pravatar.com",
  },
];

export const paddedStaffList = [...staffList, null];

export const authState = {
  ownerId: 1,
  user: {
    owner_id: 1,
  },
  waiterList: staffList,
  waiterListLoading: false,
  waiterListError: null,
};

export const waiterListPayload = {
  passcode: 78563214,
  role: "Captain",
};

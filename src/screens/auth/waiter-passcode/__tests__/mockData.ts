export const selectedWaiter = {
  staff_id: 19,
  first_name: "Ravi",
  last_name: "Patel",
  role: "Captain",
  avatar: "https://i.pravatar.cc/250?u=ravipatel@pravatar.com",
};

export const waiterPasscodeState = {
  ownerId: 2,
  waiterUser: null,
  selectedWaiter,
  loading: false,
};

export const waiterPasscodeHookReturn = {
  selectedWaiter,
  ownerId: 2,
  waiterUser: null,
  waiterName: "Ravi Patel",
  passcode: "",
  setPasscode: jest.fn(),
  isPasscodeValid: false,
  isRTL: false,
  loading: false,
};

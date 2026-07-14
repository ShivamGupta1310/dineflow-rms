import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { usePaymentSuccess } from "../usePaymentSuccess";
import { showToast } from "@utils/toastHelper";
import { generateHTMLMock, mockPaymentDetails, userSelectorMock } from "../__mocks__/paymentSuccessMock";

const mockT = jest.fn((key: string) => key);
const mockReset = jest.fn();
const mockDispatch = jest.fn();

jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: () => mockDispatch,
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: mockT,
  }),
  initReactI18next: {
    type: "3rdParty",
    init: jest.fn(),
  },
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: jest.fn(),
}));

jest.mock("@utils/generateAndSharePdf", () => ({
  generateHtml: jest.fn(() => "<html>payment-success</html>"),
  generateAndSharePdf: jest.fn().mockResolvedValue("file://invoice.pdf"),
}));

jest.mock("@utils", () => ({
  ...jest.requireActual("@utils"),
  formatDate: jest.fn(() => "25/06/26 at 1:43 PM"),
}));

const mockedUseNavigation = useNavigation as jest.Mock;
const mockedUseRoute = useRoute as jest.Mock;
const mockedUseSelector = useSelector as unknown as jest.Mock;
const mockedShowToast = showToast as jest.MockedFunction<typeof showToast>;
const mockedGenerateHtml = jest.requireMock(
  "@utils/generateAndSharePdf",
).generateHtml as jest.Mock;
const mockedGenerateAndSharePdf = jest.requireMock("@utils/generateAndSharePdf")
  .generateAndSharePdf as jest.Mock;

describe("usePaymentSuccess", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseNavigation.mockReturnValue({
      reset: mockReset,
    });
    mockedUseRoute.mockReturnValue({
      params: {
        paymentDetails: mockPaymentDetails,
      },
    });
    mockedUseSelector.mockImplementation((selector) =>
      selector(userSelectorMock),
    );
  });

  it("derives details and formats dates correctly", () => {
    const { result } = renderHook(() => usePaymentSuccess());

    expect(result.current.paymentDetails).toEqual(mockPaymentDetails);
    expect(result.current.formattedPaidAt).toBe("25/06/26 at 1:43 PM");
  });

  it("handles back button and resets the navigation stack to main tabs Tables", () => {
    const { result } = renderHook(() => usePaymentSuccess());

    act(() => {
      result.current.handleBack();
    });

    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [
        {
          name: "MainTabs",
          params: {
            screen: "Home",
          },
        },
      ],
    });
  });

  it("handles print trigger and shows coming soon toast", () => {
    const { result } = renderHook(() => usePaymentSuccess());

    act(() => {
      result.current.handlePrint();
    });

    expect(mockedShowToast).toHaveBeenCalledWith("info", "common.comingSoon");
  });

  it("handles share trigger and generates/shares PDF successfully", async () => {
    const { result } = renderHook(() => usePaymentSuccess());

    await act(async () => {
      await result.current.handleShare();
    });

    expect(mockedGenerateHtml).toHaveBeenCalledWith(
      expect.objectContaining(generateHTMLMock),
    );
    expect(mockedGenerateAndSharePdf).toHaveBeenCalledWith({
      html: "<html>payment-success</html>",
      fileName: "DineFlow-BILL-101",
    });
  });

  it("returns fallback placeholder if paidAt is missing", () => {
    mockedUseRoute.mockReturnValueOnce({
      params: {
        paymentDetails: {
          ...mockPaymentDetails,
          paidAt: undefined,
        },
      },
    });

    const { result } = renderHook(() => usePaymentSuccess());
    expect(result.current.formattedPaidAt).toBe("--");
  });

  it("handleShare returns early if paymentDetails is missing", async () => {
    mockedUseRoute.mockReturnValueOnce({
      params: { paymentDetails: undefined },
    });

    const { result } = renderHook(() => usePaymentSuccess());
    await act(async () => {
      await result.current.handleShare();
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "owner.billSummary.billSummary",
      "owner.billSummary.unableToLoadBillSummary",
    );
    expect(mockedGenerateHtml).not.toHaveBeenCalled();
  });

  it("handleShare returns early if shareLoading is already true", async () => {
    const { result } = renderHook(() => usePaymentSuccess());

    mockedGenerateAndSharePdf.mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    );

    let promise1: Promise<void>;
    act(() => {
      promise1 = result.current.handleShare();
    });

    await waitFor(() => expect(result.current.shareLoading).toBe(true));

    let promise2: Promise<void>;
    act(() => {
      promise2 = result.current.handleShare();
    });

    await act(async () => {
      await promise1;
      await promise2;
    });

    expect(mockedGenerateHtml).toHaveBeenCalledTimes(1);
  });

  it("handleShare shows error toast on non-Error exceptions during share", async () => {
    mockedGenerateAndSharePdf.mockRejectedValueOnce("String pdf generation error");

    const { result } = renderHook(() => usePaymentSuccess());

    await act(async () => {
      await result.current.handleShare();
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "owner.billSummary.billSummary",
      "common.unknownError",
    );
  });
});

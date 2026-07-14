import { act, renderHook, waitFor } from "@testing-library/react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { showToast } from "@utils/toastHelper";

import { useBillSummary } from "../useBillSummary";
import {
  billPayMock,
  generateHtmlMock,
  mockData2,
} from "../__mockData__/billSummaryMock";

const mockT = jest.fn((key: string) => key);
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
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

jest.mock("@services/api/apiClient", () => ({
  apiPost: jest.fn(),
}));

jest.mock("@utils/toastHelper", () => ({
  showToast: jest.fn(),
}));

jest.mock("@utils/generateAndSharePdf", () => ({
  generateHtml: jest.fn(() => "<html>bill-summary</html>"),
  generateAndSharePdf: jest.fn().mockResolvedValue("file://bill-summary.pdf"),
}));

const mockedUseNavigation = useNavigation as jest.Mock;
const mockedUseRoute = useRoute as jest.Mock;
const mockedUseSelector = useSelector as unknown as jest.Mock;
const mockedShowToast = showToast as jest.MockedFunction<typeof showToast>;
const mockedGenerateHtml = jest.requireMock("@utils/generateAndSharePdf")
  .generateHtml as jest.Mock;
const mockedGenerateAndSharePdf = jest.requireMock("@utils/generateAndSharePdf")
  .generateAndSharePdf as jest.Mock;

describe("useBillSummary", () => {
  let mockStoreState: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedUseNavigation.mockReturnValue({
      goBack: mockGoBack,
      navigate: mockNavigate,
    });
    mockedUseRoute.mockReturnValue({
      params: {
        tableId: 1,
      },
    });

    mockStoreState = {
      auth: {
        ownerId: 1,
        user: {
          owner_id: 1,
        },
      },
      ownerBillSummary: {
        loading: false,
        error: null,
        success: false,
      },
    };

    mockedUseSelector.mockImplementation((selector) =>
      selector(mockStoreState),
    );

    mockDispatch.mockResolvedValue({
      type: "ownerBillSummary/fetchBillSummary/fulfilled",
      payload: mockData2.hook.response,
    });
  });

  it("loads bill summary data and derives table and tax details", async () => {
    const { result } = renderHook(() => useBillSummary());

    await waitFor(() => expect(result.current.response).toBeTruthy());

    expect(mockDispatch).toHaveBeenCalled();
    expect(result.current.error).toBeNull();
    expect(result.current.tableId).toBe(7);
    expect(result.current.tableSessionId).toBe(91);
    expect(result.current.billDetails?.bill_number).toBe("BILL-101");
    expect(result.current.orderItems).toHaveLength(1);
    expect(result.current.orderItems[0]).toMatchObject({
      order_id: 11,
      order_number: "ORD-11",
      item_name: "Paneer Tikka",
    });
    expect(result.current.billSummary).toEqual({
      subtotal: 500,
      cgstAmount: 45,
      sgstAmount: 45,
      taxAmount: 90,
      grandTotal: 590,
    });
  });

  it("shows an error toast when loading the bill summary fails", async () => {
    mockStoreState.ownerBillSummary.error = "Request failed";
    mockDispatch.mockResolvedValueOnce({
      type: "ownerBillSummary/fetchBillSummary/rejected",
      payload: "Request failed",
    });

    const { result } = renderHook(() => useBillSummary());

    await waitFor(() => expect(result.current.loading).toBe(false));
    await waitFor(() => expect(result.current.error).toBe("Request failed"));
    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "owner.billSummary.billSummary",
      "Request failed",
    );
  });

  it("handles the bill actions and marks the bill as paid after confirmation", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "ownerBillSummary/fetchBillSummary/fulfilled",
      payload: mockData2.hook.zeroTaxResponse,
    });
    mockDispatch.mockResolvedValueOnce({
      type: "ownerBillSummary/markBillPaid/fulfilled",
      payload: billPayMock,
    });

    const { result } = renderHook(() => useBillSummary());

    await waitFor(() => expect(result.current.response).toBeTruthy());
    await waitFor(() =>
      expect(result.current.billDetails?.bill_number).toBe("BILL-101"),
    );

    await act(async () => {
      result.current.handleBack();
      result.current.handlePrint();
      await result.current.handleShare();
      result.current.handleAddDiscount();
      await result.current.handleMarkAsPaid();
    });

    expect(mockGoBack).toHaveBeenCalledTimes(1);
    expect(mockedShowToast).toHaveBeenNthCalledWith(
      1,
      "info",
      "common.comingSoon",
    );
    expect(mockedShowToast).toHaveBeenNthCalledWith(
      2,
      "info",
      "common.comingSoon",
    );
    expect(mockedGenerateHtml).toHaveBeenCalledWith(
      expect.objectContaining(generateHtmlMock),
    );
    expect(mockedGenerateAndSharePdf).toHaveBeenCalledWith({
      html: "<html>bill-summary</html>",
      fileName: "DineFlow-BILL-101",
    });
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("PaymentSuccessScreen", {
      paymentDetails: expect.objectContaining({
        billNumber: "BILL-101",
        grandTotal: 0,
        paidAt: "2026-06-25T13:43:30+05:30",
      }),
    });
  });

  it("does not fetch bill summary if tableId is missing", async () => {
    mockedUseRoute.mockReturnValueOnce({
      params: { tableId: undefined },
    });
    renderHook(() => useBillSummary());
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("sets error when fetchBillSummary rejects", async () => {
    mockStoreState.ownerBillSummary.error = "unknownError";
    mockDispatch.mockResolvedValueOnce({
      type: "ownerBillSummary/fetchBillSummary/rejected",
      payload: "unknownError",
    });
    const { result } = renderHook(() => useBillSummary());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe("unknownError");
  });

  it("handleShare returns early if response or billSummary is missing", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "ownerBillSummary/fetchBillSummary/fulfilled",
      payload: null as any,
    });

    const { result } = renderHook(() => useBillSummary());
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
    const { result } = renderHook(() => useBillSummary());
    await waitFor(() => expect(result.current.response).toBeTruthy());

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

  it("handleShare shows error toast on unknown error during share", async () => {
    mockedGenerateAndSharePdf.mockRejectedValueOnce("String error");

    const { result } = renderHook(() => useBillSummary());
    await waitFor(() => expect(result.current.response).toBeTruthy());

    await act(async () => {
      await result.current.handleShare();
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "owner.billSummary.billSummary",
      "common.unknownError",
    );
  });

  it("handleMarkAsPaid returns early if billDetails.bill_id is missing", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "ownerBillSummary/fetchBillSummary/fulfilled",
      payload: {
        ...mockData2.hook.response,
        bill_details: {
          ...mockData2.hook.response.bill_details,
          bill_id: undefined,
        },
      } as any,
    });

    const { result } = renderHook(() => useBillSummary());
    await waitFor(() => expect(result.current.response).toBeTruthy());

    mockDispatch.mockClear();

    await act(async () => {
      await result.current.handleMarkAsPaid();
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "owner.billSummary.billSummary",
      "common.unknownError",
    );
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it("handleMarkAsPaid handles rejected action from markBillPaid", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "ownerBillSummary/fetchBillSummary/fulfilled",
      payload: mockData2.hook.response,
    });
    mockDispatch.mockResolvedValueOnce({
      type: "ownerBillSummary/markBillPaid/rejected",
      payload: "API error payload",
    });

    const { result } = renderHook(() => useBillSummary());
    await waitFor(() => expect(result.current.response).toBeTruthy());

    await act(async () => {
      await result.current.handleMarkAsPaid();
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "owner.billSummary.billSummary",
      "API error payload",
    );
  });

  it("handleMarkAsPaid handles rejected action without payload", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "ownerBillSummary/fetchBillSummary/fulfilled",
      payload: mockData2.hook.response,
    });
    mockDispatch.mockResolvedValueOnce({
      type: "ownerBillSummary/markBillPaid/rejected",
    });

    const { result } = renderHook(() => useBillSummary());
    await waitFor(() => expect(result.current.response).toBeTruthy());

    await act(async () => {
      await result.current.handleMarkAsPaid();
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "owner.billSummary.billSummary",
      "common.unknownError",
    );
  });

  it("handleMarkAsPaid handles thrown exception", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "ownerBillSummary/fetchBillSummary/fulfilled",
      payload: mockData2.hook.response,
    });
    mockDispatch.mockRejectedValueOnce(new Error("Thrown dispatch error"));

    const { result } = renderHook(() => useBillSummary());
    await waitFor(() => expect(result.current.response).toBeTruthy());

    await act(async () => {
      await result.current.handleMarkAsPaid();
    });

    expect(mockedShowToast).toHaveBeenCalledWith(
      "error",
      "owner.billSummary.billSummary",
      "Thrown dispatch error",
    );
  });

  it("handleMarkAsPaid falls back to current date if paid_at is missing", async () => {
    mockDispatch.mockResolvedValueOnce({
      type: "ownerBillSummary/fetchBillSummary/fulfilled",
      payload: mockData2.hook.response,
    });
    mockDispatch.mockResolvedValueOnce({
      type: "ownerBillSummary/markBillPaid/fulfilled",
      payload: {
        success: true,
        bill_id: 101,
        paid_at: null,
      },
    });

    const { result } = renderHook(() => useBillSummary());
    await waitFor(() => expect(result.current.response).toBeTruthy());

    await act(async () => {
      await result.current.handleMarkAsPaid();
    });

    expect(mockNavigate).toHaveBeenCalledWith("PaymentSuccessScreen", {
      paymentDetails: expect.objectContaining({
        paidAt: expect.any(String),
      }),
    });
  });
});

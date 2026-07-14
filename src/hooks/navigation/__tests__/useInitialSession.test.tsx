import { renderHook } from "@testing-library/react-native";

import { useInitialSession } from "../useInitialSession";

describe("useInitialSession", () => {
  it("starts as ready", () => {
    const { result } = renderHook(() => useInitialSession());

    expect(result.current.isReady).toBe(true);
  });
});

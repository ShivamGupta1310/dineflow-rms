import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

import AppLayout from "../index";

describe("AppLayout", () => {
  const mockLogo = <Text testID="logo">Logo</Text>;

  it("renders title", () => {
    const { getByText } = render(
      <AppLayout title="DineFlow" logo={mockLogo} />,
    );

    expect(getByText("DineFlow")).toBeTruthy();
  });

  it("renders subtitle when provided", () => {
    const { getByText } = render(
      <AppLayout
        title="DineFlow"
        subtitle="Restaurant Management Made Simple"
        logo={mockLogo}
      />,
    );

    expect(getByText("Restaurant Management Made Simple")).toBeTruthy();
  });

  it("does not render subtitle when not provided", () => {
    const { queryByText } = render(
      <AppLayout title="DineFlow" logo={mockLogo} />,
    );

    expect(queryByText("Restaurant Management Made Simple")).toBeNull();
  });

  it("renders logo", () => {
    const { getByTestId } = render(
      <AppLayout title="DineFlow" logo={mockLogo} />,
    );

    expect(getByTestId("logo")).toBeTruthy();
  });

  it("renders children", () => {
    const { getByText } = render(
      <AppLayout title="DineFlow" logo={mockLogo}>
        <Text>Login Form</Text>
      </AppLayout>,
    );

    expect(getByText("Login Form")).toBeTruthy();
  });
});

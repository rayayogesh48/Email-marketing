"use client";

import React from "react";
import { AccountDetailsSheet } from "./account-details-sheet";
import { ActivityDetailsSheet } from "./activity-details-sheet";

export function CustomerDetailDrawer() {
  return (
    <>
      <AccountDetailsSheet />
      <ActivityDetailsSheet />
    </>
  );
}

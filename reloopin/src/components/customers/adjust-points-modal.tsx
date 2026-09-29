"use client";

import React from "react";
import { RewardPointsDialog } from "./reward-points-dialog";
import { DeductPointsDialog } from "./deduct-points-dialog";

export function AdjustPointsModal() {
  return (
    <>
      <RewardPointsDialog />
      <DeductPointsDialog />
    </>
  );
}

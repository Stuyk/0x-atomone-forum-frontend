/// <reference types="vite/client" />
import type { Window as KeplrWindow, Keplr } from "@keplr-wallet/types";

declare global {
    interface Window extends KeplrWindow {
      leap: Keplr;
      cosmostation: unknown;
    }
  }
import type { Token } from "./../types/common.d";
import { writable } from "svelte/store";
import browser from "./browserExtension";

import { savedTokens } from "../store";
import { INITIAL_TOKENS } from "../constants/common";

export const setTokenInLocalStorage = (tokens: Array<Token>) => {
  browser.storage.local.set({ vyagutaDevAuthToken: tokens }, function () {
    savedTokens.set(tokens);
  });
};

export const saveToken = (token: Token) => {
  browser.storage.local.get("vyagutaDevAuthToken", (result: any) => {
    const currentValue: Array<Token> = result?.vyagutaDevAuthToken ?? [];

    setTokenInLocalStorage([
      ...currentValue,
      {
        username: token.username,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        isActive: true,
        id: token.id,
      },
    ]);
  });
};

export const saveTokens = (tokens: Array<Token>) => {
  browser.storage.local.get("vyagutaDevAuthToken", (result: any) => {
    const currentValue: Array<Token> = result?.vyagutaDevAuthToken ?? [];

    setTokenInLocalStorage([
      ...currentValue,
      ...tokens
    ]);
  });
};

export const getTokens = () => {
  browser.storage.local.get("vyagutaDevAuthToken", (result: any) => {
    const currentValue: Array<Token> = result?.vyagutaDevAuthToken ?? [];

    savedTokens.set(currentValue);
  });
};

export const deleteAllSavedTokens = () => {
  browser.storage.local.clear(() => {
    const error = chrome.runtime.lastError;

    if (error) {
      console.error(error);

      return;
    }

    savedTokens.set(INITIAL_TOKENS);
  });
};

export const editToken = (id: number, token: string, username: string) => {
  browser.storage.local.get("vyagutaDevAuthToken", (result: any) => {
    const currentValue: Array<Token> = result?.vyagutaDevAuthToken ?? [];

    const newValue = currentValue.map((cv) =>
      cv.id === id
        ? {
            ...cv,
            refreshToken: token,
            username: username,
            accessToken: token,
            isActive: true,
          }
        : { ...cv }
    );

    setTokenInLocalStorage(newValue);
  });
};

export const deleteToken = (id: number) => {
  browser.storage.local.get("vyagutaDevAuthToken", (result: any) => {
    const currentValue: Array<Token> = result?.vyagutaDevAuthToken ?? [];

    const newValue = currentValue.filter((cv) => cv.id !== id);

    setTokenInLocalStorage(newValue);
  });
};

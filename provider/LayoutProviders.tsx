"use client";

import {
  getDefaultConfig,
  RainbowKitProvider,
  createAuthenticationAdapter,
  RainbowKitAuthenticationProvider,
  AuthenticationStatus,
  midnightTheme,
  lightTheme,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, useDisconnect } from "wagmi";
import { optimism, arbitrum, zkSync, scroll, sepolia } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { SiweMessage } from "siwe";
import { useState, useEffect } from "react";
import { GlobalProvider } from "@/context/global";
import { SWRConfig } from "swr";

import { CustomProvider } from "rsuite";

import { EventDrawerProvider } from "@/context/eventDrawer";

export const queryClient = new QueryClient();

export const chainsConf = [
  {
    ...optimism,
    hasIcon: true,
    iconBackground: "#ff5a57",
    iconUrl: "/images/chainIcons/optimism.svg",
  },
  {
    ...arbitrum,
    hasIcon: true,
    iconBackground: "#96bedc",
    iconUrl: "/images/chainIcons/arbitrum.svg",
  },
  {
    ...zkSync,
    hasIcon: true,
    iconBackground: "#F9F7EC",
    iconUrl: "/images/chainIcons/zkSync.svg",
  },
  {
    ...scroll,
    hasIcon: true,
    iconBackground: "#edcca2",
    iconUrl: "/images/chainIcons/scroll.svg",
  },
  {
    ...sepolia,
    hasIcon: true,
    iconBackground: "#484c50",
    iconUrl: "/images/chainIcons/ethereum.svg",
  },
];

/* New RainbowKit API */
export const wagmiConfig = getDefaultConfig({
  appName: "bluestone",
  projectId: `${process.env.NEXT_PUBLIC_WALLET_PROJECTID}`,
  ssr: true,
  // @ts-ignore
  chains: chainsConf,
});

const AUTHENTICATION_STATUS = "unauthenticated";

export function LayoutProviders({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] =
    useState<AuthenticationStatus>("unauthenticated");

  const [globalLogin, setGlobalLogin] = useState(false);

  useEffect(() => {
    fetch("/baseAPI/users/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${
          localStorage.getItem("userToken") &&
          JSON.parse(localStorage.getItem("userToken") || "")?.access?.token
        }`,
      },
    }).then((res) => {
      if (res.status === 200) return setAuthState("authenticated");
      localStorage.removeItem("userToken");
      setAuthState("unauthenticated");
    });
  }, []);

  const authenticationAdapter = createAuthenticationAdapter({
    getNonce: async () => {
      const response = await fetch("/baseAPI/siwe/nonce");
      return await response.text();
    },
    createMessage: ({ nonce, address, chainId }) => {
      return new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
      });
    },
    getMessageBody: ({ message }) => {
      return message.prepareMessage();
    },
    verify: async ({ message, signature }) => {
      setAuthState("loading");
      const verifyResRaw = await fetch("/baseAPI/siwe/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, signature }),
      });

      const verifyRes = await verifyResRaw.json();

      console.log("verifyRes", verifyRes);

      localStorage.setItem("userToken", JSON.stringify(verifyRes?.tokens));

      setAuthState(
        Boolean(verifyResRaw.ok) ? "authenticated" : "unauthenticated"
      );
      setGlobalLogin(true);
      return Boolean(verifyResRaw.ok);
    },
    signOut: async () => {
      setAuthState("unauthenticated");
      setGlobalLogin(false);
      localStorage.removeItem("userToken");
      await fetch("/api/logout");
    },
  });

  return (
    <GlobalProvider logined={globalLogin} setLogined={setGlobalLogin}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitAuthenticationProvider
            adapter={authenticationAdapter}
            status={authState}
          >
            <RainbowKitProvider
              // avatar={CustomAvatar}
              theme={{
                lightMode: lightTheme(),
                darkMode: darkTheme({
                  // overlayBlur: "small",
                  // accentColor: "#7b3fe4",
                  // accentColorForeground: "white",
                }),
              }}
              showRecentTransactions
              modalSize="compact"
            >
              <SWRConfig
                value={{
                  refreshInterval: 3000,
                  fetcher: (resource, init) =>
                    fetch(resource, init).then((res) => res.json()),
                }}
              >
                <CustomProvider theme="dark">
                  <EventDrawerProvider> {children}</EventDrawerProvider>
                </CustomProvider>
              </SWRConfig>
            </RainbowKitProvider>
          </RainbowKitAuthenticationProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </GlobalProvider>
  );
}

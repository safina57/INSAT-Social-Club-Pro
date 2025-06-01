"use client";
import StoreProvider from "@/state/redux";
import { apolloClient } from "@/lib/apollo";
import { ApolloProvider } from "@apollo/client";
import { NotificationsProvider } from "@/context/NotificationsContext";
import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <ApolloProvider client={apolloClient}>
        <NotificationsProvider>
          {children}
        </NotificationsProvider>
      </ApolloProvider>
    </StoreProvider>
  );
};

export default Providers;

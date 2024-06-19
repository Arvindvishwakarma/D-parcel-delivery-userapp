/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './src/navigation/AuthStack';
import { AuthProvider } from './src/context/AuthContext';
import FlashMessage from "react-native-flash-message";

import { ApolloClient, ApolloLink, InMemoryCache, split, ApolloProvider } from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities';
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from '@apollo/client/link/ws';

const httpLink = new HttpLink({
  uri: "https://speeasyy-back-dev-teal.vercel.app/graphql",
});

const wsLink = new WebSocketLink({
  uri: "wss://speeasyy-back-dev-teal.vercel.app/graphql",
  options: {
    reconnect: true
  }
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.from([splitLink]),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <NavigationContainer>
          <AuthStack />
          <FlashMessage position="bottom" />
        </NavigationContainer>
      </AuthProvider>
    </ApolloProvider>
  )
}


export default App;

//https://speeasyy-new.herokuapp.com/graphql
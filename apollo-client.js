import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://beneditinos.stepzen.net/api/steely-whale/__graphql',
    headers: {
        Authorization: `Apikey ${process.env.NEXT_PUBLIC_API_KEY}`,
    },
    cache: new InMemoryCache(),
});

export default client;

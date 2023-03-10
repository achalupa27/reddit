import { Box, Heading } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { EditDeletePostButtons } from '../../components/EditDeletePostButtons';
import { Layout } from '../../components/Layout';
import { createUrqlClient } from '../../utils/createUrqlClient';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';

const Post = ({}) => {
    const [{ data, error, fetching }] = useGetPostFromUrl();

    if (fetching) {
        return (
            <Layout>
                <div>Loading...</div>
            </Layout>
        );
    }

    if (error) {
        return <div>{error.message}</div>;
    }

    if (!data?.post) {
        return (
            <Layout>
                <Box>Could not find post.</Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Heading>{data.post.title}</Heading>
            <EditDeletePostButtons id={data.post.id} creatorId={data.post.creator.id} />
            {data.post.text}
        </Layout>
    );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);

import axios from "axios";
import { useQuery } from "react-query";
import { Button, Text } from "@chakra-ui/react";

export default function NotionIntegrations(props) {
  const { userId } = props;

  // ===========================================================================
  // Queries
  // ===========================================================================
  const { isLoading, data, isError, error } = useQuery(
    ["notion-tokens", userId],
    async () => {
      const response = await axios.get(`/api/notion-auth?userId=${userId}`);

      return response.data.payload;
    }
  );

  // =============================================================================
  // Render
  // =============================================================================
  if (isLoading) {
    return <div>Loading information....</div>;
  }

  if (isError) {
    return <div>Error retrieving integration information</div>;
  }

  console.log({ data });
  return (
    <>
      <style jsx>{``}</style>
      {data.map((obj, index) => (
        <ShowNotionIntegrations data={obj} key={obj.id} />
      ))}

      {data.length > 0}
      <a
        href={`https://api.notion.com/v1/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_NOTION_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}/user/notion-callback&response_type=code`}
      >
        {data.length > 0 ? (
          <Button>Connect Another Notion Account</Button>
        ) : (
          <Button>Connect to Notion</Button>
        )}
      </a>
    </>
  );
}

const ShowNotionIntegrations = ({ data }) => {
  return (
    <>
      <style jsx>{``}</style>
      <div>
        <Text fontSize="xl">{data.workspaceName}</Text>
      </div>
    </>
  );
};

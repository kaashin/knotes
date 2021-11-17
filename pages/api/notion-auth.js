import clog from "clog";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// =============================================================================
// Method Routing
// =============================================================================
export default async function (req, res) {
  switch (req.method) {
    case "GET":
      getHandler(req, res);
      break;
    case "POST":
      postHandler(req, res);
      break;
    // case 'PUT':
    //   putHandler(req, res);
    //   break;
    // case 'PATCH':
    //   patchHandler(req, res);
    //   break;
    default:
      res.status(400).json({ err: "Method type not accepted" });
      break;
  }
}

// =============================================================================
// GET Routes
// =============================================================================
async function getHandler(req, res) {
  const { userId } = req.query;

  try {
    const result = await prisma.notion_tokens.findMany({
      where: {
        user: {
          id: userId,
        },
      },
    });
    res.status(200).send({
      success: true,
      payload: result,
    });
  } catch (error) {
    console.error(error);
    res.status(400).send({
      message: "Error with completing integration",
    });
  }
}

// =============================================================================
// POST Routes
// =============================================================================
// Authenticate code to get user token
async function postHandler(req, res) {
  const { payload: data } = req.body; //destructure the reqeuest body
  const { code, state, userId } = data;

  // Do something with the data.
  clog.info("Received access code, requesting for user auth token");
  // POST to notion
  const authBuffer = Buffer.from(
    `${process.env.NEXT_PUBLIC_NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`,
    "utf-8"
  );
  const auth = authBuffer.toString("base64");

  try {
    const response = await axios.post(
      `https://api.notion.com/v1/oauth/token`,
      {
        grant_type: "authorization_code",
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/user/notion-callback`,
      },
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    // Store the data into
    const dbResult = await prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        notionTokens: {
          create: {
            accessToken: response.data.access_token,
            workspaceName: response.data.workspace_name,
            tokenType: response.data.token_type,
            botId: response.data.bot_id,
          },
        },
      },
    });

    console.log({ dbResult });

    res.status("200").json({
      success: true,
      payload: response.data,
    });
  } catch (error) {
    clog.error(error);
    res.status(400).send({
      message: "Error with completing integration",
    });
  }
}

async function putHandler(req, res) {
  const { payload: data } = req.body; //destructure the reqeuest body

  // Do something with the data.

  res.status("200").json({
    success: true,
    payload: data,
  });
}

async function patchHandler(req, res) {
  const { payload: data } = req.body; //destructure the reqeuest body

  // Do something with the data.

  res.status("200").json({
    success: true,
    payload: data,
  });
}

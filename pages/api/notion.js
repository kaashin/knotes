import axios from "axios";
import clog from "clog";
import startOfToday from "date-fns/startOfToday";
import endOfToday from "date-fns/endOfToday";
import format from "date-fns/format";
import formatISO from "date-fns/formatISO";

const { Client } = require("@notionhq/client");

const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_TOKEN });

const notionConfig = {
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTION_TOKEN}`,
    "Notion-Version": "2021-05-13",
  },
};

const databaseId = "eae70b5fad3446c88ab4b8975d84d766";

// =============================================================================
// Method Routing
// =============================================================================
export default async function (req, res) {
  console.log(req.params);
  switch (req.method) {
    case "GET":
      const { action } = req.query;
      switch (action) {
        case "getToday":
          getTodayHandler(req, res);
          break;
        default:
          getHandler(req, res);
          break;
      }

      break;
    case "POST":
      postHandler(req, res);
      break;
    case "PUT":
      putHandler(req, res);
      break;
    default:
      res.status(400).json({ err: "Method type not accepted" });
      break;
  }
}

// =============================================================================
// GET Routes
// =============================================================================
async function getHandler(req, res) {
  const { dbId } = req.query; //destructure query params
  const data = {};

  const response = await notion.databases.query({
    database_id: dbId,
  });

  clog.info(response);

  res.status("200").json({
    success: true,
    payload: data,
  });
}

async function getTodayHandler(req, res) {
  const { dbId } = req.query;
  // 1. Check to see if there is already a page for today
  const todayStart = startOfToday();
  const todayEnd = endOfToday();
  const today = format(todayStart, "yyyy-MM-dd");

  console.log("looking in this db", dbId);

  const response = await notion.databases.query({
    database_id: dbId,
    filter: {
      and: [
        {
          property: "Date",
          date: {
            on_or_after: todayStart,
          },
        },
      ],
    },
  });

  clog.debug("response", response);
  const pageExists = response.results.length > 0;
  // 2. If there is, return the pageId of today
  let pageId = null;
  if (pageExists) {
    pageId = response.results[0].id;
    res.status(200).json({
      success: true,
      payload: {
        pageId,
      },
    });
    return;
  }

  // 3. If there is not, create a new page
  const newPageResponse = await notion.pages.create({
    parent: {
      database_id: dbId,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: `${today}-Logs`,
            },
          },
        ],
      },
      Date: {
        date: {
          start: today,
        },
      },
    },
    children: [
      {
        object: "block",
        type: "heading_1",
        heading_1: {
          text: [
            {
              type: "text",
              text: {
                content: `Logs for ${today}`,
              },
            },
          ],
        },
      },
    ],
  });

  clog.debug("New page response", newPageResponse);
  // 4. Return the new page Id
  pageId = newPageResponse.id;

  clog.debug("NEW PAGE ID: ", pageId);

  res.status(200).json({
    success: true,
    payload: {
      pageId,
    },
  });
  return;
}

// =============================================================================
// POST Routes
// =============================================================================
async function postHandler(req, res) {
  const { payload: data } = req.body; //destructure the reqeuest body

  // Do something with the data.
  const response = await notion.pages.create({
    parent: {
      database_id: databaseId,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: "This is a new page",
            },
          },
        ],
      },
    },
  });

  clog.info("response", response);

  res.status("200").json({
    success: true,
    payload: data,
  });
}

async function putHandler(req, res) {
  const { payload: data } = req.body; //destructure the reqeuest body

  // Do something with the data.

  res.status("200").json({
    success: true,
    payload: data,
  });
}

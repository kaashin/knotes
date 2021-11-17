import axios from "axios";
import clog from "clog";
import { Client } from "@notionhq/client";
import marked from "marked";
import format from "date-fns/format";

const notion = new Client({ auth: process.env.NEXT_PUBLIC_NOTION_TOKEN });
const notionConfig = {
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTION_TOKEN}`,
    "Notion-Version": "2021-05-13",
  },
};

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
    case "PUT":
      putHandler(req, res);
      break;
    case "PATCH":
      patchHandler(req, res);
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
  const { param } = req.query; //destructure query params
  const data = {};

  const pageId = "0966bb9c9fe64ca38a4823c9b1c2d605";

  const response = await notion.pages.retrieve({
    page_id: pageId,
  });

  clog.debug(response);
  clog.debug(response.children);

  res.status("200").json({
    success: true,
    payload: data,
  });
}

// =============================================================================
// POST Routes
// =============================================================================
async function postHandler(req, res) {
  const { payload: data } = req.body; //destructure the reqeuest body

  const response = await notion.pages.create({
    parent: {
      // type: "page_id",
      // database_id: "eae70b5fad3446c88ab4b8975d84d766",
      page_id: "81200c8b-efdc-4898-a4e9-2ce9e315417c",
    },
    properties: {
      title: [{ text: { content: "Tuscan Kale" } }],
    },
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          text: [
            {
              type: "text",
              text: {
                content: "Lacinato kale",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          text: [
            {
              type: "text",
              text: {
                content:
                  "Lacinato kale is a variety of kale with a long tradition in Italian cuisine, especially that of Tuscany. It is also known as Tuscan kale, Italian kale, dinosaur kale, kale, flat back kale, palm tree kale, or black Tuscan palm.",
                link: {
                  url: "https://en.wikipedia.org/wiki/Lacinato_kale",
                },
              },
            },
          ],
        },
      },
    ],
  });

  clog.debug(response);
  clog.debug(response.children);

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

// =============================================================================
// PATCH routes
// =============================================================================
async function patchHandler(req, res) {
  const { payload: data } = req.body; //destructure the reqeuest body

  clog.info(data);
  // Do something with the data.
  const { note, pageId } = data;

  // const pageId = "81200c8b-efdc-4898-a4e9-2ce9e315417c";

  const formattedNote = parseHtmlString(note);

  const children = parseHtmlToBlocks(note);

  console.log(children);

  const response = await notion.blocks.children.append({
    block_id: pageId,
    children,
    // children: [
    //   {
    //     object: "block",
    //     type: "paragraph",
    //     paragraph: {
    //       text: [
    //         {
    //           type: "text",
    //           text: {
    //             content: note,
    //           },
    //         },
    //       ],
    //     },
    //   },
    // ],
  });

  clog.debug(response);

  res.status("200").json({
    success: true,
    payload: data,
  });
}

function parseHtmlString(str) {
  let strArr = str.split("<div><br></div>");
  strArr = strArr.map((val) => {
    return val.replace(/(<([^>]+)>)/gi, "");
  });
  return strArr.join("\r\n");
}

function parseHtmlToBlocks(str) {
  let strArr = str.split("<div><br></div>");
  strArr = strArr.flatMap((val) => {
    return val.split("</div><div>");
  });
  strArr = strArr.map((val) => {
    const noHtml = removeHtml(val);
    const markedHtml = marked(noHtml);
    if (markedHtml.match(/<\s*h1[^>]*>/g)?.length > 0) {
      return {
        object: "block",
        type: "heading_1",
        heading_1: {
          text: [
            {
              type: "text",
              text: {
                content: removeHtml(markedHtml),
              },
            },
          ],
        },
      };
    }
    if (markedHtml.match(/<\s*h2[^>]*>/g)?.length > 0) {
      return {
        object: "block",
        type: "heading_2",
        heading_2: {
          text: [
            {
              type: "text",
              text: {
                content: removeHtml(markedHtml),
              },
            },
          ],
        },
      };
    }
    if (markedHtml.match(/<\s*h3[^>]*>/g)?.length > 0) {
      return {
        object: "block",
        type: "heading_3",
        heading_3: {
          text: [
            {
              type: "text",
              text: {
                content: removeHtml(markedHtml),
              },
            },
          ],
        },
      };
    }
    if (markedHtml.match(/<\s*ul[^>]*>/g)?.length > 0) {
      return {
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          text: [
            {
              type: "text",
              text: {
                content: removeHtml(markedHtml),
              },
            },
          ],
        },
      };
    }
    if (markedHtml.match(/<\s*ol[^>]*>/g)?.length > 0) {
      return {
        object: "block",
        type: "numbered_list_item",
        numbered_list_item: {
          text: [
            {
              type: "text",
              text: {
                content: removeHtml(markedHtml),
              },
            },
          ],
        },
      };
    }
    if (markedHtml.match(/<\s*p[^>]*>(.*\[?)\[\]/g)?.length > 0) {
      return {
        object: "block",
        type: "to_do",
        to_do: {
          text: [
            {
              type: "text",
              text: {
                content: removeHtml(markedHtml).replace("[]", ""),
              },
            },
          ],
        },
      };
    }

    return {
      object: "block",
      type: "paragraph",
      paragraph: {
        text: [
          {
            type: "text",
            text: {
              content: removeHtml(markedHtml),
            },
          },
        ],
      },
    };
  });

  return strArr;
}

function removeHtml(str) {
  return str.replace(/(<([^>]+)>)/gi, "").trim();
}

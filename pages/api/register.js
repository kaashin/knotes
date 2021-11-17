import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import clog from "clog";
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
  const { param } = req.query; //destructure query params
  const data = {};

  res.status("200").json({
    success: true,
    payload: data,
  });
}

// =============================================================================
// POST Routes
// =============================================================================
async function postHandler(req, res) {
  const { payload } = req.body; //destructure the reqeuest body
  const { email, role, firstName, lastName, password } = payload;
  const saltRounds = 10;
  const encryptedPassword = await bcrypt.hash(password, saltRounds);

  let user = {
    email,
    password: encryptedPassword,
    role,
    firstName,
    lastName,
  };

  // Add user to the database
  try {
    const result = await prisma.users.create({
      data: user,
    });
    clog.info("result", result);

    res.status(200).json({
      success: true,
      payload: result.id,
    });
  } catch (error) {
    clog.error(error);
    let message = "Error with registration. Please contact administrator.";
    if (error.meta?.target.some((val) => val === "email")) {
      message = "This email is already registered.";
    }

    res.status(400).send({
      message,
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

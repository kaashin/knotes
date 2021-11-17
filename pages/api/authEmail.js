import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// =============================================================================
// Method Routing
// =============================================================================
export default async function (req, res) {
  switch (req.method) {
    // case "GET":
    //   getHandler(req, res);
    //   break;
    case "POST":
      postHandler(req, res);
      break;
    // case "PUT":
    //   putHandler(req, res);
    //   break;
    default:
      res.status(400).json({ err: "Method type not accepted" });
      break;
  }
}
// =============================================================================
// POST Routes
// =============================================================================
async function postHandler(req, res) {
  const { email, password } = req.body; //destructure the reqeuest body

  // Get the user
  const result = await prisma.users.findFirst({
    where: {
      email,
    },
  });

  if (result) {
    const compare = await bcrypt.compare(password, result.password);
    if (compare) {
      res.status(200).json({
        user: {
          id: result.id,
          email: result.email,
          role: result.role,
          firstName: result.firstName,
          lastName: result.lastName,
        },
      });
    } else {
      res.status(204).send({
        message: "Email and passwords do not match",
      });
    }
  } else {
    res.status(206).send({
      message: "Email does not exist",
    });
  }
}

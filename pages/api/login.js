import { magicAdmin } from "../../lib/magic.js";
import jwt from "jsonwebtoken";
import { isNewUser, createNewUser } from "@/lib/db/hasura.js";
import { setTokenCookie } from "@/lib/cookies.js";

export default async function login(req, res) {
  if (req.method === "POST") {
    try {
      const auth = req.headers.authorization;
      const didtoken = auth ? auth.substr(7) : "";
      const metadata = await magicAdmin.users.getMetadataByToken(didtoken);
      console.log({ metadata });
      //create jwt token
      const token = jwt.sign(
        {
          ...metadata,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          "https://hasura.io/jwt/claims": {
            "x-hasura-default-role": "user",
            "x-hasura-allowed-roles": ["user", "admin"],
            "x-hasura-user-id": `${metadata.issuer}`,
          },
        },
        process.env.JWT_SECRET
      );

      //CHECK IF USER EXISTS
      const isNewUserQuery = await isNewUser(token, metadata.issuer);
      isNewUserQuery && (await createNewUser(token, metadata));
      const cookie = setTokenCookie(token, res);
      res.send({ done: true });
      //invoke magic
    } catch (error) {
      console.error("something went wrong", error);
      res.status(500).send({ error });
    }
  } else {
    res.send({ done: false, msg: "error" });
  }
}

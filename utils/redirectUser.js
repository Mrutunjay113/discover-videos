import { verifyToken } from "@/lib/utils";
import cookie from "cookie";

const userRedirectUser = async (context) => {
  const token = context.req ? context.req.cookies?.token : null;

  const userId = await verifyToken(token);

  return {
    userId,
    token,
  };
};

export default userRedirectUser;

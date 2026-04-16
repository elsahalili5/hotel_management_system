import { Response } from "express";
import { refreshAccessToken } from "./refreshToken.service.ts";
import { TypedRequestBody } from "@lib/types.ts";
import { RefreshTokenInput } from "./refreshToken.types.ts";

export const RefreshTokenController = {
  refreshToken: async (
    req: TypedRequestBody<RefreshTokenInput>,
    res: Response,
  ) => {
    try {
      const result = await refreshAccessToken(req.body.refreshToken);

      return res.status(200).json({
        message: "Token refreshed",
        data: result,
      });
    } catch (error: any) {
      console.error(error);

      if (error.status) {
        return res.status(error.status).json({ error: error.message });
      }

      return res.status(500).json({
        error: "Token refresh failed",
      });
    }
  },
};

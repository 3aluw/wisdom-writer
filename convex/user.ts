import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: { username: v.string(), preferences : v.array(v.string()) },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", { username : args.username, preferences : args.preferences });
   
   return userId
  },
});

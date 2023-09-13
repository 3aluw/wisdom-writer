import { mutation,query } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: { username: v.string(), preferences : v.array(v.string()) },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("users", { username : args.username, preferences : args.preferences });  
   return userId
  },
});
export const getUserById = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), args.userId)).unique()
    
    return user;
  },
});

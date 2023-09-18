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

//results
//push a new result
export const insertResult = mutation({
  args:{userId:v.string(), WPM: v.number(), accuracy: v.number()},
  handler: async (ctx, args) => {
    const newResult = await ctx.db.insert("results", { WPM : args.WPM, accuracy : args.accuracy, userId: args.userId });  
    return newResult
  }
})

//Retrieve results history of the user
export const getUserHistory = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const resultHistory = await ctx.db.query("results").filter((q) => q.eq(q.field("userId"), args.userId)).order("desc").take(5)
 return resultHistory
  }})


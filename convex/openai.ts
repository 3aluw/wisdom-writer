import OpenAI from 'openai';
import { action } from "./_generated/server";
import { v } from "convex/values";

const openai = new OpenAI();

export const generateText = action({
    args:{
        theme : v.string()
    }, 
    handler : async(ctx, args)=>{
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: `generate a random short text (50<words>100) about ${args.theme}. feel free to add any quotes and talk in any related subject` }],
            model: 'gpt-3.5-turbo',
          })
          return completion
    }
})

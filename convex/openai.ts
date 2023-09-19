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
            messages: [{ role: 'user', content: `generate a short text about ${args.theme}. feel free to add quotes, talk in a related subject, but the text has to be in less than 80 words` }],
            model: 'gpt-3.5-turbo',
          })
          return completion 
    }
})

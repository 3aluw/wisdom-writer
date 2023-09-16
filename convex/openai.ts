import OpenAI from 'openai';
import { action } from "./_generated/server";
import { v } from "convex/values";

const openai = new OpenAI();

export const generateText = action({
    args:{
        message : v.string()
    }, 
    handler : async(ctx, args)=>{
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: 'Say this is a test' }],
            model: 'gpt-3.5-turbo',
          })
    }
})

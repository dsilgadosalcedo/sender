import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    code: v.string(),
    language: v.string(),
    title: v.optional(v.string()),
    author: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const snippetId = await ctx.db.insert("snippets", {
      code: args.code,
      language: args.language,
      title: args.title,
      author: args.author,
      createdAt: Date.now(),
    });
    return snippetId;
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    const snippets = await ctx.db
      .query("snippets")
      .withIndex("by_created")
      .order("desc")
      .take(100);
    return snippets;
  },
});

export const getByLanguage = query({
  args: { language: v.string() },
  handler: async (ctx, args) => {
    const snippets = await ctx.db
      .query("snippets")
      .withIndex("by_language", (q) => q.eq("language", args.language))
      .order("desc")
      .take(100);
    return snippets;
  },
});

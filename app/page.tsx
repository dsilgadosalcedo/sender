"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Copy, ChevronDown, ChevronRight } from "lucide-react";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "c",
  "rust",
  "go",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "html",
  "css",
  "sql",
  "bash",
  "other",
];

export default function Home() {
  const snippets = useQuery(api.snippets.list);
  const createSnippet = useMutation(api.snippets.create);

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setIsSubmitting(true);
    try {
      await createSnippet({
        code: code.trim(),
        language,
        title: title.trim() || undefined,
        author: author.trim() || undefined,
      });
      setCode("");
      setTitle("");
      setAuthor("");
      setLanguage("javascript");
    } catch (error) {
      console.error("Error creating snippet:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // You could add a toast notification here if you have one
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const getSnippetDisplayName = (snippet: {
    title?: string;
    language: string;
    author?: string;
  }) => {
    if (snippet.title) return snippet.title;
    return `${snippet.language} snippet${snippet.author ? ` by ${snippet.author}` : ""}`;
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Code Snippets
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Share your code snippets with the community
          </p>
        </header>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            Post a New Snippet
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Title (optional)
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Give your snippet a title..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="language"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {LANGUAGES.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.charAt(0).toUpperCase() + lang.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="author"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Author (optional)
                </label>
                <input
                  id="author"
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your name..."
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
              >
                Code *
              </label>
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={10}
                required
                className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Paste your code here..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !code.trim()}
              className="w-full md:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white font-medium rounded-md transition-colors"
            >
              {isSubmitting ? "Posting..." : "Post Snippet"}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50">
            Recent Snippets
          </h2>

          {snippets === undefined ? (
            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
              Loading snippets...
            </div>
          ) : snippets.length === 0 ? (
            <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
              No snippets yet. Be the first to post one!
            </div>
          ) : (
            <div className="space-y-2">
              {snippets.map((snippet) => (
                <Collapsible key={snippet._id} className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between px-4 py-3 gap-4">
                    <CollapsibleTrigger className="flex-1 flex items-center gap-2 text-left hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-md px-2 py-1 -mx-2 transition-colors group">
                      <ChevronRight className="size-4 text-zinc-400 group-data-[state=open]:rotate-90 transition-transform shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-medium text-black dark:text-zinc-50">
                            {getSnippetDisplayName(snippet)}
                          </h3>
                          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs">
                            {snippet.language}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {snippet.author && <span>by {snippet.author}</span>}
                          <span>{formatDate(snippet.createdAt)}</span>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(snippet.code);
                      }}
                      className="shrink-0"
                      title="Copy code"
                    >
                      <Copy className="size-4" />
                    </Button>
                  </div>
                  <CollapsibleContent className="px-4 pb-4">
                    <pre className="bg-zinc-100 dark:bg-zinc-800 rounded-md p-4 overflow-x-auto">
                      <code className="text-sm text-black dark:text-zinc-50 font-mono">
                        {snippet.code}
                      </code>
                    </pre>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Image from "next/image";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: (props) => <h1 className="text-2xl font-bold mb-4" {...props} />,
        h2: (props) => <h2 className="text-xl font-bold mb-3" {...props} />,
        h3: (props) => <h3 className="text-lg font-bold mb-2" {...props} />,
        p: (props) => <p className="mb-4 leading-relaxed" {...props} />,
        ul: (props) => <ul className="list-disc pl-6 mb-4" {...props} />,
        ol: (props) => <ol className="list-decimal pl-6 mb-4" {...props} />,
        li: (props) => <li className="mb-1" {...props} />,
        code: ({
          inline,
          ...props
        }: { inline?: boolean } & React.HTMLProps<HTMLElement>) =>
          inline ? (
            <code
              className="px-1 py-0.5 bg-muted-foreground/20 rounded text-sm"
              {...props}
            />
          ) : (
            <code
              className="block bg-muted-foreground/20 p-4 rounded-lg text-sm overflow-auto"
              {...props}
            />
          ),
        // Additional markdown elements
        blockquote: (props) => (
          <blockquote
            className="border-l-4 border-primary pl-4 italic my-4"
            {...props}
          />
        ),
        a: (props) => (
          <a
            className="text-primary hover:underline cursor-pointer text-blue-600"
            target="_blank"
            rel="noopener noreferrer"
            {...props}
          />
        ),
        table: (props) => (
          <div className="overflow-x-auto my-4">
            <table className="min-w-full divide-y divide-border" {...props} />
          </div>
        ),
        th: (props) => (
          <th
            className="px-4 py-2 bg-muted font-semibold text-left"
            {...props}
          />
        ),
        td: (props) => <td className="px-4 py-2 border-t" {...props} />,
        hr: (props) => <hr className="my-4 border-border" {...props} />,
        img: ({ src, alt, width, height, ...props }) => {
          const w = width ? parseInt(width.toString()) : 800;
          const h = height ? parseInt(height.toString()) : 400;
          return (
            <Image
              className="max-w-full h-auto rounded-lg my-4"
              alt={alt || ""}
              src={src || ""}
              width={w}
              height={h}
              style={{ width: "100%", height: "auto" }}
              {...props}
            />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

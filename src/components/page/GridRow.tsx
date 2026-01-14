import { Plus } from "lucide-react";
import { useState } from "react";
import Comment from "./Comment";

// Grid Row Component
const GridRow = ({
  lineNumber,
  content,
  comment,
  hasComment,
  isHighlighted,
  onAddComment,
  onInput,
  onEdit,
  onDelete,
  scrollOffset,
  onCommentExpand,
}: {
  lineNumber: number;
  content: string;
  comment: {
    id: number;
    lineNumber: number;
    text: string;
  };
  hasComment: boolean;
  isHighlighted: boolean;
  onAddComment: (lineNumber: number) => void;
  onInput: (index: number, newContent: string) => void;
  onEdit: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
  scrollOffset: number;
  onCommentExpand: (expanded: boolean) => void;
}) => {
  const [rowIsHighlighted, setRowIsHighlighted] = useState(false);

  const rowHighlight = rowIsHighlighted
    ? "bg-yellow-100 [.dark_&]:bg-yellow-900/40"
    : "";

  return (
    <>
      {/* Line Number Column */}
      <div
        className={`text-right pr-3 py-1 ${rowHighlight} text-gray-500 [.dark_&]:text-gray-400 text-sm select-none border-r border-gray-200 [.dark_&]:border-gray-700 bg-gray-50 [.dark_&]:bg-gray-900`}
      >
        {lineNumber}
      </div>

      {/* Code Column */}
      <div
        className={`group hover:bg-gray-100 [.dark_&]:hover:bg-gray-800 relative border-r ${rowHighlight} border-gray-200 [.dark_&]:border-gray-700 bg-gray-50 [.dark_&]:bg-gray-900 overflow-hidden`}
      >
        <div
          className="flex items-center min-h-[24px] code-line-content"
          style={{ transform: `translateX(-${scrollOffset}px)` }}
        >
          <div
            contentEditable
            suppressContentEditableWarning
            onInput={(e) =>
              onInput(lineNumber - 1, e.currentTarget.textContent)
            }
            className="flex-1 px-3 py-1 text-sm font-mono whitespace-pre text-gray-900 [.dark_&]:text-gray-100 outline-none"
          >
            {content}
          </div>
          {!hasComment && (
            <button
              onClick={() => onAddComment(lineNumber)}
              className="opacity-0 group-hover:opacity-100 px-2 mr-2 rounded bg-blue-500 hover:bg-blue-600 text-white transition-opacity flex-shrink-0"
            >
              <Plus size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Comment Column */}
      <div
        className={`relative bg-gray-50 [.dark_&]:bg-gray-900 min-h-[24px] ${rowHighlight}`}
      >
        <div className="absolute left-0 top-1/2 w-full h-px bg-gray-300 [.dark_&]:bg-gray-600"></div>
        {comment ? (
          <Comment
            comment={comment}
            onEdit={onEdit}
            onDelete={onDelete}
            onExpandChange={setRowIsHighlighted}
          />
        ) : (
          <button
            onClick={() => onAddComment(lineNumber)}
            className="relative z-10 ml-3 my-1 p-1 rounded bg-gray-200 [.dark_&]:bg-gray-700 hover:bg-gray-300 [.dark_&]:hover:bg-gray-600 text-gray-700 [.dark_&]:text-gray-300"
          >
            <Plus size={14} />
          </button>
        )}
      </div>
    </>
  );
};

export default GridRow;

import { Check, X, Edit2, Trash2, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ThemeSwitcher } from "../common/theme";

const Comment = ({
  comment,
  onEdit,
  onDelete,
}: {
  comment: {
    id: number;
    lineNumber: number;
    text: string;
  };
  onEdit: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const isExpanded = isHovered || isClicked;

  const handleSave = () => {
    onEdit(comment.id, editText);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(comment.text);
    setIsEditing(false);
  };

  return (
    <div
      className="relative px-3 py-1 w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        height: isExpanded || isEditing ? "auto" : "24px",
        overflow: "visible",
      }}
    >
      <div
        className="cursor-pointer w-full"
        onClick={() => setIsClicked(!isClicked)}
      >
        {isEditing ? (
          <div className="space-y-2 w-full">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full p-2 border border-gray-300 [.dark_&]:border-gray-600 rounded bg-white [.dark_&]:bg-gray-800 text-gray-900 [.dark_&]:text-gray-100 resize-none"
              rows={3}
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
                className="p-1 rounded bg-green-500 hover:bg-green-600 text-white"
              >
                <Check size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCancel();
                }}
                className="p-1 rounded bg-red-500 hover:bg-red-600 text-white"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full pr-16">
            <p
              className="text-sm text-gray-700 [.dark_&]:text-gray-300 break-words overflow-wrap-anywhere"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: isExpanded ? "unset" : 1,
                WebkitBoxOrient: "vertical",
                overflow: isExpanded ? "visible" : "hidden",
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}
            >
              {comment.text}
            </p>
          </div>
        )}
      </div>

      {!isEditing && (isHovered || isClicked) && (
        <div className="absolute top-1 right-2 flex gap-1 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="p-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(comment.id);
            }}
            className="p-1 rounded bg-red-500 hover:bg-red-600 text-white"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

// Grid Row Component
const GridRow = ({
  lineNumber,
  content,
  comment,
  hasComment,
  onAddComment,
  onInput,
  onEdit,
  onDelete,
  scrollOffset,
}: {
  lineNumber: number;
  content: string;
  comment: {
    id: number;
    lineNumber: number;
    text: string;
  };
  hasComment: boolean;
  onAddComment: (lineNumber: number) => void;
  onInput: (index: number, newContent: string) => void;
  onEdit: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
  scrollOffset: number;
}) => {
  return (
    <>
      {/* Line Number Column */}
      <div className="text-right pr-3 py-1 text-gray-500 [.dark_&]:text-gray-400 text-sm select-none border-r border-gray-200 [.dark_&]:border-gray-700 bg-gray-50 [.dark_&]:bg-gray-900">
        {lineNumber}
      </div>

      {/* Code Column */}
      <div className="group hover:bg-gray-100 [.dark_&]:hover:bg-gray-800 relative border-r border-gray-200 [.dark_&]:border-gray-700 bg-gray-50 [.dark_&]:bg-gray-900 overflow-hidden">
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
      <div className="relative bg-gray-50 [.dark_&]:bg-gray-900 min-h-[24px]">
        <div className="absolute left-0 top-1/2 w-full h-px bg-gray-300 [.dark_&]:bg-gray-600"></div>
        {comment ? (
          <Comment comment={comment} onEdit={onEdit} onDelete={onDelete} />
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

// Main Layout Component
const Layout = () => {
  const [lines, setLines] = useState<string[]>([]);
  const [comments, setComments] = useState<{
    [key: string]: {
      id: number;
      lineNumber: number;
      text: string;
    };
  }>({});
  const [codeWidth, setCodeWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [horizontalScroll, setHorizontalScroll] = useState(0);
  const [maxScrollWidth, setMaxScrollWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);
  const [isScrollDragging, setIsScrollDragging] = useState(false);

  useEffect(() => {
    fetch("/code/code.txt")
      .then((res) => res.text())
      .then((text) => {
        const splitLines = text.split(/\r?\n/);
        setLines(splitLines);
      })
      .catch((err) => {
        console.error("Failed to load file...", err);
      });
  }, []);

  useEffect(() => {
    // Calculate max scroll width based on content
    if (gridRef.current) {
      const codeColumn = gridRef.current.querySelectorAll(".code-line-content");
      let maxWidth = 0;
      codeColumn.forEach((el) => {
        const contentWidth = el.scrollWidth;
        maxWidth = Math.max(maxWidth, contentWidth);
      });
      const columnWidth =
        gridRef.current.querySelector(".code-line-content")?.parentElement
          ?.offsetWidth || 0;
      setMaxScrollWidth(Math.max(0, maxWidth - columnWidth));
    }
  }, [lines, codeWidth]);

  const handleLineEdit = (index: number, newContent: string) => {
    setLines((prev) => {
      const updated = [...prev];
      updated[index] = newContent;
      return updated;
    });
  };

  const handleAddComment = (lineNumber: number) => {
    const newComment = {
      id: Date.now(),
      lineNumber,
      text: "New comment...",
    };
    setComments((prev) => ({
      ...prev,
      [lineNumber]: newComment,
    }));
  };

  const handleEditComment = (id: number, newText: string) => {
    setComments((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        if (updated[key].id === id) {
          updated[key] = { ...updated[key], text: newText };
        }
      });
      return updated;
    });
  };

  const handleDeleteComment = (id: number) => {
    setComments((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((key) => {
        if (updated[key].id === id) {
          delete updated[key];
        }
      });
      return updated;
    });
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const lineNumberWidth = 48; // w-12 = 48px
    const availableWidth = rect.width - lineNumberWidth;
    const clickX = e.clientX - rect.left - lineNumberWidth;
    const newCodeWidth = (clickX / availableWidth) * 100;

    if (newCodeWidth >= 18 && newCodeWidth <= 80) {
      setCodeWidth(newCodeWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleScrollThumbDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrollDragging(true);
    e.stopPropagation();
  };

  const handleScrollThumbMove = (e: MouseEvent) => {
    if (!isScrollDragging || !scrollThumbRef.current || !containerRef.current)
      return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollBarWidth = rect.width * (codeWidth / 100);
    const thumbWidth = 100; // Fixed thumb width
    const availableScrollArea = scrollBarWidth - thumbWidth;
    const clickX = e.clientX - rect.left - 48; // Subtract line number width
    const scrollPercentage = Math.max(
      0,
      Math.min(1, clickX / availableScrollArea)
    );

    setHorizontalScroll(scrollPercentage * maxScrollWidth);
  };

  const handleScrollThumbUp = () => {
    setIsScrollDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging]);

  useEffect(() => {
    if (isScrollDragging) {
      document.addEventListener("mousemove", handleScrollThumbMove);
      document.addEventListener("mouseup", handleScrollThumbUp);
      return () => {
        document.removeEventListener("mousemove", handleScrollThumbMove);
        document.removeEventListener("mouseup", handleScrollThumbUp);
      };
    }
  }, [isScrollDragging, maxScrollWidth]);

  return (
    <div className="flex flex-col w-full h-screen bg-white [.dark_&]:bg-gray-900">
      <div className="absolute top-5 right-5 z-10">
        <ThemeSwitcher />
      </div>

      <div
        className="flex-1 pt-16 overflow-auto relative pb-8"
        ref={containerRef}
      >
        <div
          ref={gridRef}
          className="grid"
          style={{
            gridTemplateColumns: `48px ${codeWidth}% calc(${
              100 - codeWidth
            }% - 48px)`,
          }}
        >
          {lines.map((line, index) => {
            const lineNumber = index + 1;
            const comment = comments[lineNumber];
            return (
              <GridRow
                key={lineNumber}
                lineNumber={lineNumber}
                content={line}
                comment={comment}
                hasComment={!!comment}
                onAddComment={handleAddComment}
                onInput={handleLineEdit}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                scrollOffset={horizontalScroll}
              />
            );
          })}
        </div>

        {/* Custom Horizontal Scrollbar */}
        {maxScrollWidth > 0 && (
          <div
            className="fixed bottom-0 h-3 bg-gray-200 [.dark_&]:bg-gray-700 z-30"
            style={{
              left: "48px",
              width: `calc(${codeWidth}% - 1px)`,
            }}
          >
            <div
              ref={scrollThumbRef}
              className="h-full bg-gray-400 [.dark_&]:bg-gray-500 hover:bg-gray-500 [.dark_&]:hover:bg-gray-400 cursor-grab active:cursor-grabbing rounded"
              style={{
                width: "100px",
                transform: `translateX(${
                  (horizontalScroll / maxScrollWidth) *
                  (containerRef.current
                    ? containerRef.current.offsetWidth * (codeWidth / 100) - 100
                    : 0)
                }px)`,
              }}
              onMouseDown={handleScrollThumbDown}
            />
          </div>
        )}

        {/* Resizer */}
        <div
          className="fixed top-0 bottom-0 w-1 bg-gray-300 [.dark_&]:bg-gray-600 hover:bg-blue-500 [.dark_&]:hover:bg-blue-500 cursor-col-resize transition-colors z-20"
          style={{ left: `calc(48px + ${codeWidth}%)` }}
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
};

export default Layout;

import { CodeXml } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { ThemeSwitcher } from "../common/theme";
import ButtonToggle from "../common/button-toggle";
import GridRow from "./GridRow";

const baseUrl = "/code-rev-format/";

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
  const [activeCommentLine, setActiveCommentLine] = useState<number | null>(
    null
  );
  const [codeWidth, setCodeWidth] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [horizontalScroll, setHorizontalScroll] = useState(0);
  const [maxScrollWidth, setMaxScrollWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);
  const [isScrollDragging, setIsScrollDragging] = useState(false);

  async function getLinesFromFile() {
    fetch(`${baseUrl}/code/code.txt`)
      .then((res) => res.text())
      .then((text) => {
        const splitLines = text.split(/\r?\n/);
        setLines(splitLines);
      })
      .catch((err) => {
        console.error("Failed to load file...", err);
      });
  }

  useEffect(() => {
    getLinesFromFile();
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
      text: "...",
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
      <div className="absolute top-2 right-2 z-10">
        <ThemeSwitcher />
      </div>

      <div className="absolute top-2 left-2 z-10">
        <ButtonToggle onToggle={getLinesFromFile}>
          <CodeXml />
        </ButtonToggle>
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
                isHighlighted={activeCommentLine === lineNumber}
                onAddComment={handleAddComment}
                onInput={handleLineEdit}
                onEdit={handleEditComment}
                onDelete={handleDeleteComment}
                scrollOffset={horizontalScroll}
                onCommentExpand={(expanded) =>
                  setActiveCommentLine(expanded ? lineNumber : null)
                }
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
          className="absolute top-0 bottom-0 w-1 bg-gray-300 [.dark_&]:bg-gray-600 hover:bg-blue-500 [.dark_&]:hover:bg-blue-500 cursor-col-resize transition-colors z-20"
          style={{ left: `calc(48px + ${codeWidth}%)` }}
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
};

export default Layout;

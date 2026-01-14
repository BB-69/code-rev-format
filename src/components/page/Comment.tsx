import { Check, X, Edit2, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";

const Comment = ({
  comment,
  onEdit,
  onDelete,
  onExpandChange,
}: {
  comment: {
    id: number;
    lineNumber: number;
    text: string;
  };
  onEdit: (id: number, newText: string) => void;
  onDelete: (id: number) => void;
  onExpandChange: (expanded: boolean) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  const isExpanded = isHovered || isClicked;

  useEffect(() => {
    onExpandChange(isExpanded || isEditing);
  }, [isExpanded, isEditing]);

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

export default Comment;

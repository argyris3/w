"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import axios from "axios";
import {
  ArrowRight,
  Circle,
  Diamond,
  Eraser,
  Hand,
  Image,
  Minus,
  MousePointer2,
  Pencil,
  Square,
  Type,
  type LucideIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "../ui/toast";
import "./whiteboard.css";
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import FloatingProperties from "./FloatingProperties";
import { ApiError } from "next/dist/server/api-utils";
import { el } from "date-fns/locale";

const tools = [
  {
    name: "selection",
    icon: MousePointer2,
    color: "text-slate-700",
  },
  {
    name: "hand",
    icon: Hand,
    color: "text-mist-500",
  },
  {
    name: "rectangle",
    icon: Square,
    color: "text-sky-200",
  },
  {
    name: "diamond",
    icon: Diamond,
    color: "text-emerald-200",
  },
  {
    name: "ellipse",
    icon: Circle,
    color: "text-amber-200",
  },
  {
    name: "arrow",
    icon: ArrowRight,
    color: "text-violet-200",
  },
  {
    name: "line",
    icon: Minus,
    color: "text-pink-200",
  },
  {
    name: "freedraw",
    icon: Pencil,
    color: "text-orange-200",
  },
  {
    name: "text",
    icon: Type,
    color: "text-indigo-200",
  },
  {
    name: "image",
    icon: Image,
    color: "text-green-200",
  },
  {
    name: "eraser",
    icon: Eraser,
    color: "text-rose-200",
  },
];

function Whiteboard() {
  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);
  const [activeTool, setActiveTool] = useState("selection");

  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [canvasState, setCanvasState] = useState<any>(null);
  const saveTimeRef = useRef<any>(null);

  const { projectId } = useParams();

  const handleCanvasChange = (
    elements: readonly any[],
    appState: any,
    files: any,
  ) => {
    const selectedIds = Object.keys(appState.selectedElementsIds || {});

    if (selectedIds?.length === 1) {
      const element = elements.find((element) => element.id === selectedIds[0]);

      setSelectedElement(element);
    } else {
      selectedElement(null);
    }

    if (saveTimeRef?.current) {
      clearTimeout(saveTimeRef.current);
    }
    saveTimeRef.current = setTimeout(() => {
      SaveCanvasChanges(elements, appState, files);
      toast.add({
        title: "Changes Save..",
        type: "success",
      });
    }, 10000);
  };

  const SaveCanvasChanges = async (
    elements: readonly any[],
    appState: any,
    files: any,
  ) => {
    const result = await axios.post("/api/whiteboard", {
      elements: elements,
      appState: appState,
      files: files,
      projectId: projectId,
    });
  };

  const changeTool = (tool: any) => {
    if (!excalidrawAPI) return;

    setActiveTool(tool);
    excalidrawAPI.setActiveTool({
      type: tool,
    });
  };

  const getFloatingPosition = () => {
    if (!selectedElement || !canvasState) {
      return { left: 0, top: 0 };
    }
    const zoom = canvasState.zoom?.value ?? 1;

    const scrollX = canvasState.scrollX ?? 0;

    const scrollY = canvasState.scrollY ?? 0;

    const centerX = selectedElement.x + selectedElement.width / 2;

    const screenX = (centerX + scrollX) * zoom;

    const screenY = (selectedElement.y + scrollY) * zoom;

    return {
      left: screenX,
      top: screenY - 60,
    };
  };
  const handlePropertyChange = (property: string, value: any) => {
    if (!excalidrawAPI || !selectedElement) return;

    const element = excalidrawAPI.getSceneElements();
    const updatedElement = element.map((element) => {
      if (!element.id != selectedElement.id) {
        return element;
      }
      return {
        ...element,
        [property]: value,
        version: element.version + 1,
        updated: Date.now(),
      };
    });

    excalidrawAPI.updateScene({
      elements: updatedElement,
    });
  };

  const handleDeleteElement = () => {
    if (!excalidrawAPI || !selectedElement) return;

    const elements = excalidrawAPI.getSceneElements();
    const updatedElements = elements.map((element) => {
      if (element.id === selectedElement.id) {
        return {
          ...element,
          isDeleted: true,
          version: element.version + 1,
          updated: Date.now(),
        };
      }
      return element;
    });
    excalidrawAPI.updateScene({
      elements: updatedElements,
    });
    setSelectedElement(null);
  };

  const handleOnDuplicate = () => {
    if (!excalidrawAPI || !selectedElement) return;
    const elements = excalidrawAPI.getSceneElements();
    const duplicateElement = {
      ...selectedElement,
      id: crypto.randomUUID(),
      x: selectedElement.x + 20,
      y: selectedElement.y + 20,
      seed: Math.floor(Math.random() * 1000000),
      version: 1,
      updated: Date.now(),
      isDeleted: false,
    };
    excalidrawAPI.updateScene({
      elements: [...elements, duplicateElement],
    });
  };

  const handleBringFrontBack = (type: string) => {
    if (!excalidrawAPI || !selectedElement) return;
    const elements = excalidrawAPI.getSceneElements();

    const selected = elements.find(
      (element) => element.id === selectedElement.id,
    );

    if (!selected) return;
    const remainingElements = elements.filter(
      (element) => element.id !== selectedElement.id,
    );

    if (type == "front") {
      excalidrawAPI.updateScene({
        elements: [...remainingElements, selected],
      });
    } else {
      excalidrawAPI.updateScene({
        elements: [selected, ...remainingElements],
      });
    }
  };

  const floatingPosition = getFloatingPosition();

  return (
    <div style={{ height: "90vh" }}>
      <Excalidraw
        //@ts-ignore
        excalidrawAPI={(api) => setEcalidrawAPI(api)}
        onChange={handleCanvasChange}
      />
      <div className="absolute left-4 top-1/2 z-50 -translate-y-1/2 flex flex-col gap-1 rounded-2xl bg-slate-300 p-1.5 shadow-xl ">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <button
              className={`flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-primary/10 hover:cursor-pointer ${activeTool === tool.name ? "bg-primary/10" : null}`}
              onClick={() => changeTool(tool.name)}
            >
              <Icon size="19" className={tool.color} />
            </button>
          );
        })}
      </div>
      <FloatingProperties
        selectedElement={selectedElement}
        position={floatingPosition}
        onPropertyChange={(propertyName, value) =>
          handlePropertyChange(propertyName, value)
        }
        onDelete={() => handleDeleteElement()}
        onDuplicate={() => handleOnDuplicate()}
        onBringToFront={() => handleBringFrontBack("front")}
        onSendToBack={() => handleBringFrontBack("back")}
      />
    </div>
  );
}

export default Whiteboard;

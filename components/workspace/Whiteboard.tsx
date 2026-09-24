"use client";

import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState, useRef } from "react";
import { toast } from "../ui/toast";

function Whiteboard() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const saveTimeRef = useRef<any>(null);

  const { projectId } = useParams();

  const handleCanvasChange = (
    elements: readonly any[],
    appState: any,
    files: any,
  ) => {
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
  return (
    <div style={{ height: "90vh" }}>
      <Excalidraw
        //@ts-ignore
        excalidrawAPI={(api) => setEcalidrawAPI(api)}
        onChange={handleCanvasChange}
      />
    </div>
  );
}

export default Whiteboard;

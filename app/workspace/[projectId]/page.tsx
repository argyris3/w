"use client";
import SmartDoc from "@/components/workspace/SmartDoc";
import Whiteboard from "@/components/workspace/Whiteboard";
import WorkspaceHeader from "@/components/workspace/WorkspaceHeader";
import { useState } from "react";

const Workspace = () => {
  const [activeTab, setActiveTab] = useState("whiteboard");
  return (
    <div>
      <WorkspaceHeader selectedTab={(value: string) => setActiveTab(value)} />

      {activeTab === "whiteboard" ? <Whiteboard /> : <SmartDoc />}
    </div>
  );
};

export default Workspace;

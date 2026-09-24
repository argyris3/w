import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import axios from "axios";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function CreateNewBoardDialog() {
  const [workspaceName, setWorkspaceName] = useState("");
  const [loading, setLoading] = useState(false);
  const [dialog, setDialog] = useState(false);

  const route = useRouter();

  const handleCreateBoard = async () => {
    if (workspaceName.trim() === "" || workspaceName?.length > 30) {
      toast.add({
        type: "error",
        title: "οοοχι",
        description: "Πολλα λες,κοψε..",
      });

      return;
    }
    setLoading(true);
    const projectId = crypto.randomUUID();
    const result = await axios.post("/api/projects", {
      projectName: workspaceName,
      projectId: projectId,
    });

    console.log(result?.data);

    toast.add({
      type: "success",
      title: "New Workspace Created...",
    });
    setLoading(false);
    setDialog(false);
    route.push("/workspace/" + projectId);
  };

  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <DialogTrigger>
        <Button>
          <Plus />
          Create να γινει χαμος
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Workspace...</DialogTitle>
        </DialogHeader>
        <div>
          <label className="text-gray-500">Enter ονομα</label>
          <Input
            placeholder="Ονομα..."
            className="mt-1"
            onChange={(e) => setWorkspaceName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose>
            <Button variant="outline"> Αστο τελικα..</Button>
          </DialogClose>
          <Button
            disabled={workspaceName?.length === 0 || loading}
            onClick={handleCreateBoard}
          >
            {loading && <Loader2 className="animate-spin" />}
            Create...
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateNewBoardDialog;

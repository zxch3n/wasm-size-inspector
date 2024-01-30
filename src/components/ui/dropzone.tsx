import { WasmFile } from "@/types";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

export function Dropzone({ onRead }: { onRead?: (file: WasmFile) => void }) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        if (!file.name.endsWith(".wasm")) {
          toast.error("File must be a wasm file");
          return;
        }

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = (e) => {
          console.error(e);
          toast.error("File reading has failed");
        };
        reader.onload = () => {
          // Do whatever you want with the file contents
          const binaryStr = reader.result;
          if (!binaryStr) {
            toast.error("File reading has failed");
            return;
          }
          if (typeof binaryStr === "string") {
            toast.error(
              "File reading has failed (getting string instead of binary)",
            );
            return;
          }

          const data = new Uint8Array(binaryStr);
          onRead?.({
            name: file.name,
            binary: data,
            lastModified: file.lastModified,
            importedTime: Date.now(),
          });
        };
        reader.readAsArrayBuffer(file);
      });
    },
    [onRead],
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className="flex h-[130px] w-[400px] cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-400 bg-gray-500/[0.1] text-gray-500 hover:bg-gray-500/[0.2] dark:text-gray-500"
    >
      <input {...getInputProps()} />
      <p>Drop your WASM file here!</p>
    </div>
  );
}

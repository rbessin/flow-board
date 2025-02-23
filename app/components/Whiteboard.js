import { Tldraw } from "@tldraw/tldraw";
import 'tldraw/tldraw.css';

export default function Whiteboard() {
  return (
    <div className="w-1/2 h-[575px] bg-white shadow-md rounded p-2">
      <Tldraw />
    </div>
  );
}

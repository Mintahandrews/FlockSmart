import { useState, useRef } from 'react';
import { Stage, Layer, Line, Text } from 'react-konva';
import { Download, Eraser, PencilLine, Trash2 } from 'lucide-react';

interface SimpleWhiteboardProps {
  width: number;
  height: number;
  onSave?: (dataUrl: string) => void;
}

type LineElement = {
  tool: string;
  points: number[];
  color: string;
  strokeWidth: number;
};

const SimpleWhiteboard = ({ width, height, onSave }: SimpleWhiteboardProps) => {
  const [lines, setLines] = useState<LineElement[]>([]);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);

  const handleMouseDown = (e: any) => {
    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    if (!pos) return;
    
    setLines([...lines, { tool, points: [pos.x, pos.y], color, strokeWidth }]);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    if (!point) return;
    
    const lastLine = lines[lines.length - 1];
    if (!lastLine) return;
    
    lastLine.points = lastLine.points.concat([point.x, point.y]);
    
    setLines([...lines.slice(0, -1), lastLine]);
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleClear = () => {
    setLines([]);
  };

  const handleExport = () => {
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL();
      if (onSave) {
        onSave(dataURL);
      } else {
        const link = document.createElement('a');
        link.download = 'whiteboard.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="bg-gray-100 p-2 rounded-t-lg border border-gray-300 flex items-center space-x-3">
        <button
          onClick={() => setTool('pen')}
          className={`p-2 rounded ${tool === 'pen' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-200'}`}
          title="Pen"
        >
          <PencilLine size={20} />
        </button>
        <button
          onClick={() => setTool('eraser')}
          className={`p-2 rounded ${tool === 'eraser' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-200'}`}
          title="Eraser"
        >
          <Eraser size={20} />
        </button>
        
        <div className="h-6 border-l border-gray-300 mx-1"></div>
        
        <div className="flex items-center">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8 rounded cursor-pointer"
            title="Color"
          />
        </div>
        
        <div className="flex items-center">
          <label className="text-sm text-gray-700 mr-1">Size:</label>
          <input
            type="range"
            min="1"
            max="20"
            value={strokeWidth}
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
            className="w-24"
          />
        </div>
        
        <div className="flex-1"></div>
        
        <button
          onClick={handleClear}
          className="p-2 rounded text-gray-700 hover:bg-gray-200"
          title="Clear"
        >
          <Trash2 size={20} />
        </button>
        <button
          onClick={handleExport}
          className="p-2 rounded text-gray-700 hover:bg-gray-200"
          title="Save"
        >
          <Download size={20} />
        </button>
      </div>
      
      <div className="border-x border-b border-gray-300 rounded-b-lg bg-white">
        <Stage
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          ref={stageRef}
          style={{ touchAction: 'none' }}
        >
          <Layer>
            <Text 
              text="Draw here..." 
              x={width/2 - 40} 
              y={height/2} 
              fontSize={16}
              fill="#cccccc"
              opacity={lines.length === 0 ? 0.7 : 0}
            />
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.tool === 'eraser' ? '#ffffff' : line.color}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.tool === 'eraser' ? 'destination-out' : 'source-over'
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default SimpleWhiteboard;

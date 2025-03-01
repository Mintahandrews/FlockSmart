import { useState, useRef } from 'react';
import { Stage, Layer, Line, Text, Rect, Circle } from 'react-konva';
import { ChevronLeft, ChevronRight, Download, Eraser, PencilLine, Square, Trash2, Type, Video } from 'lucide-react';
import toast from 'react-hot-toast';

interface EnhancedWhiteboardProps {
  width: number;
  height: number;
  onSave?: (dataUrl: string) => void;
  allowRecording?: boolean;
}

type DrawElement = {
  tool: string;
  points?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  radius?: number;
  text?: string;
  fontSize?: number;
  color: string;
  strokeWidth: number;
  id: string;
};

const EnhancedWhiteboard = ({ 
  width, 
  height, 
  onSave,
  allowRecording = false
}: EnhancedWhiteboardProps) => {
  const [elements, setElements] = useState<DrawElement[]>([]);
  const [tool, setTool] = useState('pen');
  const [color, setColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [history, setHistory] = useState<DrawElement[][]>([[]]);
  const [historyStep, setHistoryStep] = useState(0);
  const [textValue, setTextValue] = useState('');
  const [isTextEditing, setIsTextEditing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const isDrawing = useRef(false);
  const stageRef = useRef<any>(null);

  const handleMouseDown = (e: any) => {
    if (isTextEditing) return;

    isDrawing.current = true;
    const pos = e.target.getStage().getPointerPosition();
    
    const newElement: DrawElement = {
      id: Date.now().toString(),
      tool,
      color,
      strokeWidth,
    };
    
    switch (tool) {
      case 'pen':
      case 'eraser':
        newElement.points = [pos.x, pos.y];
        setElements([...elements, newElement]);
        break;
      case 'rectangle':
        newElement.x = pos.x;
        newElement.y = pos.y;
        newElement.width = 0;
        newElement.height = 0;
        setElements([...elements, newElement]);
        break;
      case 'circle':
        newElement.x = pos.x;
        newElement.y = pos.y;
        newElement.radius = 0;
        setElements([...elements, newElement]);
        break;
      case 'text':
        setIsTextEditing(true);
        newElement.x = pos.x;
        newElement.y = pos.y;
        newElement.text = '';
        newElement.fontSize = strokeWidth * 5;
        setElements([...elements, newElement]);
        setSelectedId(newElement.id);
        break;
    }
    
    // Save state to history
    if (!isDrawing.current) {
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push([...elements]);
      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);
    }
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current) return;
    
    const stage = e.target.getStage();
    const point = stage.getPointerPosition();
    
    const lastIndex = elements.length - 1;
    const lastElement = elements[lastIndex];
    
    if (lastElement) {
      const newElements = [...elements];
      
      switch (lastElement.tool) {
        case 'pen':
        case 'eraser':
          newElements[lastIndex] = {
            ...lastElement,
            points: [...(lastElement.points || []), point.x, point.y]
          };
          break;
        case 'rectangle':
          newElements[lastIndex] = {
            ...lastElement,
            width: point.x - (lastElement.x || 0),
            height: point.y - (lastElement.y || 0)
          };
          break;
        case 'circle':
          const dx = point.x - (lastElement.x || 0);
          const dy = point.y - (lastElement.y || 0);
          const radius = Math.sqrt(dx * dx + dy * dy);
          newElements[lastIndex] = {
            ...lastElement,
            radius
          };
          break;
      }
      
      setElements(newElements);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
    
    // Save state to history
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push([...elements]);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleTextChange = (e: any) => {
    const newText = e.target.value;
    setTextValue(newText);
    
    if (selectedId) {
      const newElements = elements.map(el => 
        el.id === selectedId 
          ? { ...el, text: newText } 
          : el
      );
      setElements(newElements);
    }
  };

  const handleTextComplete = () => {
    setIsTextEditing(false);
    setSelectedId(null);
    setTextValue('');
    
    // Save state to history after text edit
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push([...elements]);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleClear = () => {
    setElements([]);
    // Add to history
    const newHistory = [...history, []];
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (historyStep > 0) {
      setHistoryStep(historyStep - 1);
      setElements(history[historyStep - 1]);
    }
  };

  const handleRedo = () => {
    if (historyStep < history.length - 1) {
      setHistoryStep(historyStep + 1);
      setElements(history[historyStep + 1]);
    }
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

  // Start recording
  const startRecording = () => {
    setIsRecording(true);
    // Simplified recording logic for MVP
    setTimeout(() => {
      toast.info('Recording feature is simulated in this demo');
    }, 1000);
  };

  // Stop recording
  const stopRecording = () => {
    setIsRecording(false);
    setTimeout(() => {
      toast.success('Recording saved successfully');
    }, 500);
  };

  return (
    <div className="flex flex-col">
      <div className="bg-gray-100 p-2 rounded-t-lg border border-gray-300 flex items-center space-x-2">
        <button
          onClick={() => setTool('pen')}
          className={`p-2 rounded ${tool === 'pen' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-200'}`}
          title="Pen"
        >
          <PencilLine size={18} />
        </button>
        <button
          onClick={() => setTool('eraser')}
          className={`p-2 rounded ${tool === 'eraser' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-200'}`}
          title="Eraser"
        >
          <Eraser size={18} />
        </button>
        <button
          onClick={() => setTool('rectangle')}
          className={`p-2 rounded ${tool === 'rectangle' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-200'}`}
          title="Rectangle"
        >
          <Square size={18} />
        </button>
        <button
          onClick={() => setTool('circle')}
          className={`p-2 rounded ${tool === 'circle' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-200'}`}
          title="Circle"
        >
          <div className="w-[18px] h-[18px] rounded-full border-2 border-current" />
        </button>
        <button
          onClick={() => setTool('text')}
          className={`p-2 rounded ${tool === 'text' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-200'}`}
          title="Text"
        >
          <Type size={18} />
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
        
        <div className="h-6 border-l border-gray-300 mx-1"></div>
        
        <button
          onClick={handleUndo}
          disabled={historyStep === 0}
          className={`p-2 rounded ${
            historyStep === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
          }`}
          title="Undo"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          onClick={handleRedo}
          disabled={historyStep === history.length - 1}
          className={`p-2 rounded ${
            historyStep === history.length - 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'
          }`}
          title="Redo"
        >
          <ChevronRight size={18} />
        </button>
        
        <div className="flex-1"></div>
        
        {allowRecording && (
          <>
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="p-2 rounded text-red-600 hover:bg-red-50"
                title="Record Session"
              >
                <Video size={18} />
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="p-2 rounded bg-red-100 text-red-600 animate-pulse"
                title="Stop Recording"
              >
                <div className="w-[18px] h-[18px] rounded-full bg-current" />
              </button>
            )}
          </>
        )}
        
        <button
          onClick={handleClear}
          className="p-2 rounded text-gray-700 hover:bg-gray-200"
          title="Clear"
        >
          <Trash2 size={18} />
        </button>
        <button
          onClick={handleExport}
          className="p-2 rounded text-gray-700 hover:bg-gray-200"
          title="Save"
        >
          <Download size={18} />
        </button>
      </div>
      
      <div className="border-x border-b border-gray-300 rounded-b-lg bg-white relative">
        {isTextEditing && selectedId && (
          <div
            style={{
              position: 'absolute',
              zIndex: 1,
              top: elements.find(el => el.id === selectedId)?.y as number || 0,
              left: elements.find(el => el.id === selectedId)?.x as number || 0,
            }}
          >
            <textarea
              value={textValue}
              onChange={handleTextChange}
              onBlur={handleTextComplete}
              autoFocus
              className="border-2 border-indigo-300 p-1 min-w-[100px] min-h-[50px]"
              style={{
                fontSize: `${(elements.find(el => el.id === selectedId)?.fontSize || 15)}px`,
                color: elements.find(el => el.id === selectedId)?.color || '#000',
              }}
            />
          </div>
        )}
        
        <Stage
          width={width}
          height={height}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
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
              opacity={elements.length === 0 ? 0.7 : 0}
            />
            
            {elements.map((element) => {
              if (element.tool === 'pen' || element.tool === 'eraser') {
                return (
                  <Line
                    key={element.id}
                    points={element.points}
                    stroke={element.tool === 'eraser' ? '#ffffff' : element.color}
                    strokeWidth={element.strokeWidth}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    globalCompositeOperation={
                      element.tool === 'eraser' ? 'destination-out' : 'source-over'
                    }
                  />
                );
              } else if (element.tool === 'rectangle') {
                return (
                  <Rect
                    key={element.id}
                    x={element.x}
                    y={element.y}
                    width={element.width}
                    height={element.height}
                    stroke={element.color}
                    strokeWidth={element.strokeWidth}
                    fillEnabled={false}
                  />
                );
              } else if (element.tool === 'circle') {
                return (
                  <Circle
                    key={element.id}
                    x={element.x}
                    y={element.y}
                    radius={element.radius}
                    stroke={element.color}
                    strokeWidth={element.strokeWidth}
                    fillEnabled={false}
                  />
                );
              } else if (element.tool === 'text') {
                return (
                  <Text
                    key={element.id}
                    x={element.x}
                    y={element.y}
                    text={element.text}
                    fontSize={element.fontSize}
                    fill={element.color}
                  />
                );
              }
              return null;
            })}
          </Layer>
        </Stage>
      </div>
      
      {isRecording && (
        <div className="mt-2 text-center text-sm text-red-600 animate-pulse">
          Recording in progress...
        </div>
      )}
    </div>
  );
};

export default EnhancedWhiteboard;

import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from 'react';

export interface DrawData {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color: string;
}

interface CanvasProps {
  onDraw: (data: DrawData) => void;
  width?: number;
  height?: number;
}

export interface CanvasHandle {
  drawRemote: (data: DrawData) => void;
}

const Canvas = forwardRef<CanvasHandle, CanvasProps>(({ onDraw, width = 800, height = 600 }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [prevPos, setPrevPos] = useState<{ x: number; y: number } | null>(null);

  useImperativeHandle(ref, () => ({
    drawRemote: (data: DrawData) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      drawLine(ctx, data);
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = width;
      canvas.height = height;
    }
  }, [width, height]);

  const drawLine = (ctx: CanvasRenderingContext2D, data: DrawData) => {
    ctx.beginPath();
    ctx.moveTo(data.x0, data.y0);
    ctx.lineTo(data.x1, data.y1);
    ctx.strokeStyle = data.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  };

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent scrolling on touch devices
    if ('touches' in e) {
        // e.preventDefault(); // React synthetic events might complain, handled in style usually or passive: false
    }
    setIsDrawing(true);
    setPrevPos(getPos(e));
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !prevPos) return;

    const currentPos = getPos(e);
    const data: DrawData = {
      x0: prevPos.x,
      y0: prevPos.y,
      x1: currentPos.x,
      y1: currentPos.y,
      color,
    };

    // Draw locally
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
        drawLine(ctx, data);
    }

    // Emit
    onDraw(data);

    setPrevPos(currentPos);
  };

  const handleEnd = () => {
    setIsDrawing(false);
    setPrevPos(null);
  };

  const clearCanvas = () => {
      const canvas = canvasRef.current;
      if(canvas) {
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
  };

  const saveImage = () => {
      const canvas = canvasRef.current;
      if(canvas) {
          const link = document.createElement('a');
          link.download = 'canvas.png';
          link.href = canvas.toDataURL();
          link.click();
      }
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex gap-4 mb-2">
        <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
        />
        <button onClick={clearCanvas} className="bg-red-500 text-white px-2 rounded">Clear</button>
        <button onClick={saveImage} className="bg-blue-500 text-white px-2 rounded">Save Image</button>
      </div>
      <div className="border bg-white shadow-lg overflow-hidden touch-none">
        <canvas
            ref={canvasRef}
            className="cursor-crosshair block"
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
            style={{ width: `${width}px`, height: `${height}px` }}
        />
      </div>
    </div>
  );
});

export default Canvas;

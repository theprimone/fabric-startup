import './index.less';

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

const TOOLBAR_HEIGHT = 36;
const CANVAS_WIDTH = document.documentElement.clientWidth / 2 - 40;
const CANVAS_HEIGHT = Math.max(document.documentElement.clientHeight - 200, 600);

export default function Welcome() {
  const [svgHtml, setSvgHtml] = useState<string>();
  const canvasRef = useRef<fabric.Canvas>();

  useEffect(() => {
    const canvas = new fabric.Canvas('canvas', {
      isDrawingMode: true,
    });

    canvasRef.current = canvas;

    fabric.Object.prototype.transparentCorners = false;

    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = 2;
    }

    return () => {
      canvas.dispose();
    };
  }, []);

  const handleToSvg = () => {
    const svg = canvasRef.current?.toSVG({
      suppressPreamble: true,
    });

    setSvgHtml(svg);

    setTimeout(() => {
      const svgDom = document.querySelector('#svg-container > svg') as SVGSVGElement;
      const paths = svgDom.querySelectorAll('path');
      paths.forEach((item) => {
        const currentStroke = item.style.stroke;
        item.addEventListener('mouseenter', () => {
          item.style.stroke = 'red';
        });
        item.addEventListener('mouseleave', () => {
          item.style.stroke = currentStroke;
        });
      });
      console.log(paths);
    });
  };

  const handleSvgCrop = () => {
    const svgDom = document.querySelector('#svg-container > svg') as SVGSVGElement;

    // https://developer.mozilla.org/zh-CN/docs/Web/API/SVGGraphicsElement/getBBox
    const bboxGroup = svgDom.getBBox();

    svgDom.setAttribute(
      'viewBox',
      `${bboxGroup.x} ${bboxGroup.y} ${bboxGroup.width} ${bboxGroup.height}`,
    );
    svgDom.setAttribute('width', `${bboxGroup.width}`);
    svgDom.setAttribute('height', `${bboxGroup.height}`);

    // path hover: https://codepen.io/miguelra/pen/NAjNYA
  };

  return (
    <div className='container'>
      <div>
        <div className='toolbar' style={{ height: TOOLBAR_HEIGHT, justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              canvasRef.current?.clear();
              setSvgHtml(undefined);
            }}
          >
            clear
          </button>
          <button onClick={handleToSvg}>to svg</button>
        </div>
        <div style={{ display: 'inline-block', border: '2px solid #aaa' }}>
          <canvas id='canvas' width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
        </div>
      </div>

      {svgHtml && (
        <div style={{ marginLeft: 8 }}>
          <div className='toolbar' style={{ height: TOOLBAR_HEIGHT }}>
            <button onClick={handleSvgCrop}>crop</button>
          </div>
          <div
            id='svg-container'
            style={{ display: 'inline-block', border: '2px solid #aaa' }}
            dangerouslySetInnerHTML={{
              __html: svgHtml,
            }}
          />
        </div>
      )}
    </div>
  );
}

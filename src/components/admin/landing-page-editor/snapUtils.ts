import type { LandingPageElement, Breakpoint } from '../../../types.js';

export interface SnapGuide {
  type: 'vertical' | 'horizontal';
  position: number; // pixel coordinate
}

export interface SnapResult {
  x: number;
  y: number;
  guides: SnapGuide[];
}

const SNAP_THRESHOLD = 6; // px threshold to trigger snap

export function calculateSnapping(
  draggingElementId: string,
  proposedX: number,
  proposedY: number,
  width: number,
  height: number,
  allElements: LandingPageElement[],
  breakpoint: Breakpoint,
  canvasWidth: number,
  canvasHeight: number,
  snapEnabled: boolean
): SnapResult {
  if (!snapEnabled) {
    return { x: proposedX, y: proposedY, guides: [] };
  }

  let finalX = proposedX;
  let finalY = proposedY;
  const guides: SnapGuide[] = [];

  // Canvas horizontal landmarks
  const canvasCenterX = Math.round(canvasWidth / 2);
  const canvasRight = canvasWidth;

  // Dragging element landmarks
  const elemCenterX = proposedX + width / 2;
  const elemRight = proposedX + width;

  // Dragging element vertical landmarks
  const elemCenterY = proposedY + height / 2;
  const elemBottom = proposedY + height;

  // 1. Snap to Canvas Center X
  if (Math.abs(elemCenterX - canvasCenterX) <= SNAP_THRESHOLD) {
    finalX = canvasCenterX - width / 2;
    guides.push({ type: 'vertical', position: canvasCenterX });
  } else if (Math.abs(proposedX) <= SNAP_THRESHOLD) {
    // Snap to left edge
    finalX = 0;
    guides.push({ type: 'vertical', position: 0 });
  } else if (Math.abs(elemRight - canvasRight) <= SNAP_THRESHOLD) {
    // Snap to right edge
    finalX = canvasRight - width;
    guides.push({ type: 'vertical', position: canvasRight });
  }

  // 2. Snap to other visible elements
  for (const other of allElements) {
    if (other.id === draggingElementId) continue;
    const props = other[breakpoint];
    if (!props || !props.visible) continue;

    const otherLeft = props.x;
    const otherRight = props.x + props.width;
    const otherCenterX = props.x + props.width / 2;

    const otherTop = props.y;
    const otherBottom = props.y + props.height;
    const otherCenterY = props.y + props.height / 2;

    // Horizontal snapping (X coordinates)
    if (Math.abs(proposedX - otherLeft) <= SNAP_THRESHOLD) {
      finalX = otherLeft;
      guides.push({ type: 'vertical', position: otherLeft });
    } else if (Math.abs(elemRight - otherRight) <= SNAP_THRESHOLD) {
      finalX = otherRight - width;
      guides.push({ type: 'vertical', position: otherRight });
    } else if (Math.abs(elemCenterX - otherCenterX) <= SNAP_THRESHOLD) {
      finalX = otherCenterX - width / 2;
      guides.push({ type: 'vertical', position: otherCenterX });
    }

    // Vertical snapping (Y coordinates)
    if (Math.abs(proposedY - otherTop) <= SNAP_THRESHOLD) {
      finalY = otherTop;
      guides.push({ type: 'horizontal', position: otherTop });
    } else if (Math.abs(elemBottom - otherBottom) <= SNAP_THRESHOLD) {
      finalY = otherBottom - height;
      guides.push({ type: 'horizontal', position: otherBottom });
    } else if (Math.abs(elemCenterY - otherCenterY) <= SNAP_THRESHOLD) {
      finalY = otherCenterY - height / 2;
      guides.push({ type: 'horizontal', position: otherCenterY });
    }
  }

  // Snap to Canvas Center Y if near
  const canvasCenterY = Math.round(canvasHeight / 2);
  if (Math.abs(elemCenterY - canvasCenterY) <= SNAP_THRESHOLD) {
    finalY = canvasCenterY - height / 2;
    guides.push({ type: 'horizontal', position: canvasCenterY });
  }

  return { x: Math.round(finalX), y: Math.round(finalY), guides };
}

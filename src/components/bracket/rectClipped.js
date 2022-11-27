import React from 'react';
import { v4 } from 'uuid';

// copied from https://github.com/moodysalem/react-tournament-bracket/blob/master/src/components/Clipped.tsx
function RectClipped(props) {
  const { id, x, y, width, height, children } = props;

  return (
    <Clipped id={id} path={<rect x={x} y={y} width={width} height={height}/>}>
      {children}
    </Clipped>
  );
}

// copied from https://github.com/moodysalem/react-tournament-bracket/blob/master/src/components/Clipped.tsx
function Clipped(props) {

  const { path, children } = props;
  const id = v4();

  return (
    <g>
      <defs>
        <clipPath id={id}>
          {path}
        </clipPath>
      </defs>

      <g clipPath={`url(#${id})`}>
        {children}
      </g>
    </g>
  );
}

export default RectClipped;
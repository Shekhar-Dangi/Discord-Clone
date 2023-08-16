export default function SvgIcon({
  height,
  width,
  fillRule,
  d1,
  transform,
  d2,
  viewBox,
  gFill,
  gFillRule,
  pFill,
  pFillRule,
}) {
  return (
    <svg
      fillRule={fillRule}
      role="img"
      width={width}
      height={height}
      viewBox={viewBox}
    >
      <g fill={gFill} fillRule={gFillRule}>
        <path
          transform={transform}
          fill={pFill}
          fillRule={pFillRule}
          d={d1}
        ></path>
        <path d={d2}></path>
      </g>
    </svg>
  );
}



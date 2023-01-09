import type { FC } from "react";

interface Props {
  className: string;
}

const HeroSVG: FC<Props> = ({ className }) => {
  return (
    <svg className={className} width="100%" height="100%" viewBox="0 0 800 800">
      <rect fill="#FFFFFF" width="800" height="800" />
      <g fillOpacity="1">
        <circle fill="#FFFFFF" cx="400" cy="400" r="600" />
        <circle fill="#f9d2da" cx="400" cy="400" r="500" />
        <circle fill="#f3a5b6" cx="400" cy="400" r="400" />
        <circle fill="#ed7791" cx="400" cy="400" r="300" />
        <circle fill="#e74a6d" cx="400" cy="400" r="200" />
        <circle fill="#E11D48" cx="400" cy="400" r="100" />
      </g>
    </svg>
  );
};

export default HeroSVG;

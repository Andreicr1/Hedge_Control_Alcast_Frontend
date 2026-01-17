import svgPaths from "./svg-v7j6vgd6cz";

function VerticalGrip() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="vertical-grip">
      <div className="absolute inset-[0_0_-0.06%_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16.01">
          <g id="vertical-grip">
            <path clipRule="evenodd" d={svgPaths.p2194b1f2} fill="var(--fill-0, #0064D9)" fillRule="evenodd" id="Icon" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function IconButton() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[6px] items-center justify-center px-[8px] py-[5px] relative rounded-[8px]" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <VerticalGrip />
    </div>
  );
}

export default function BaseFlexibleColumnArrow() {
  return (
    <div className="relative size-full" data-name=".base/Flexible Column Arrow">
      <div className="absolute flex inset-0 items-center justify-center">
        <div className="flex-none h-[895px] rotate-[180deg] w-[16px]">
          <div className="bg-[#efefef] size-full" data-name="Gradient" />
        </div>
      </div>
      <div className="absolute bg-gradient-to-b from-[#d9d9d9] h-[64px] left-[calc(50%-0.5px)] to-[rgba(255,255,255,0)] top-[calc(50%+48.5px)] translate-x-[-50%] translate-y-[-50%] w-px" data-name="Rectangle" />
      <div className="absolute flex h-[64px] items-center justify-center left-[calc(50%-0.5px)] top-[calc(50%-47.5px)] translate-x-[-50%] translate-y-[-50%] w-px">
        <div className="flex-none scale-y-[-100%]">
          <div className="bg-gradient-to-b from-[#d9d9d9] h-[64px] to-[rgba(255,255,255,0)] w-px" data-name="Rectangle" />
        </div>
      </div>
      <div className="absolute flex items-center justify-center left-1/2 min-h-[26px] top-[calc(50%+0.5px)] translate-x-[-50%] translate-y-[-50%]">
        <div className="flex-none rotate-[180deg]">
          <IconButton />
        </div>
      </div>
    </div>
  );
}
import svgPaths from "./svg-usjkinc271";

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_4_2253)" id="Icon">
          <path d={svgPaths.p1b28d080} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_4_2253">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function NavigationItem() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Navigation Item">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[6px] py-0 relative size-full">
          <Icon />
          <div className="basis-0 flex flex-col font-['72:Semibold_Duplex',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">
            <p className="leading-[normal] overflow-ellipsis overflow-hidden">Nav Item</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_4_2197)" id="Icon">
          <g id="Icon_2">
            <path d={svgPaths.pc4cc600} fill="var(--fill-0, #131E29)" />
            <path d={svgPaths.p22964600} fill="var(--fill-0, #131E29)" />
            <path d={svgPaths.p13b31670} fill="var(--fill-0, #131E29)" />
            <path d={svgPaths.p1c940300} fill="var(--fill-0, #131E29)" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_4_2197">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function NavigationItem1() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Navigation Item">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[6px] py-0 relative size-full">
          <Icon1 />
          <div className="basis-0 flex flex-col font-['72:Semibold_Duplex',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">
            <p className="leading-[normal] overflow-ellipsis overflow-hidden">Nav Item</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_4_2244)" id="Icon">
          <g id="Icon_2">
            <path d={svgPaths.p23c89d00} fill="var(--fill-0, #131E29)" />
            <path d={svgPaths.p2129ad80} fill="var(--fill-0, #131E29)" />
            <path d={svgPaths.p202b38f0} fill="var(--fill-0, #131E29)" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_4_2244">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function NavigationItem2() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Navigation Item">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[6px] py-0 relative size-full">
          <Icon2 />
          <div className="basis-0 flex flex-col font-['72:Semibold_Duplex',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">
            <p className="leading-[normal] overflow-ellipsis overflow-hidden">Nav Item</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextContainer() {
  return (
    <div className="basis-0 content-stretch flex grow h-[44px] items-center min-h-px min-w-px relative shrink-0" data-name="Text Container">
      <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#556b82] text-[14px] text-nowrap">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">Navigation Group</p>
      </div>
    </div>
  );
}

function NavigationIndicator() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Navigation Indicator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Navigation Indicator">
          <path d={svgPaths.p1663edb0} fill="var(--fill-0, #131E29)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function NavigationIndicatorContainer() {
  return (
    <div className="content-stretch flex h-full items-center justify-center px-[12px] py-[8px] relative shrink-0 w-[36px]" data-name="Navigation Indicator Container">
      <NavigationIndicator />
    </div>
  );
}

function NavigationItem3() {
  return (
    <div className="bg-white relative rounded-[8px] shrink-0 w-full" data-name="Navigation Item">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center pb-0 pl-[16px] pr-[6px] pt-[10px] relative w-full">
          <TextContainer />
          <div className="flex flex-row items-center self-stretch">
            <NavigationIndicatorContainer />
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_4_2236)" id="Icon">
          <path d={svgPaths.p193c3f00} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_4_2236">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function NavigationIndicator1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Navigation Indicator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Navigation Indicator">
          <path d={svgPaths.p628ea00} fill="var(--fill-0, #131E29)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function NavigationIndicatorContainer1() {
  return (
    <div className="content-stretch flex h-full items-center justify-center px-[12px] py-[8px] relative shrink-0 w-[36px]" data-name="Navigation Indicator Container">
      <NavigationIndicator1 />
    </div>
  );
}

function TwoClickArea() {
  return (
    <div className="content-stretch flex h-full items-center relative shrink-0" data-name="Two Click-Area">
      <NavigationIndicatorContainer1 />
    </div>
  );
}

function NavigationItem4() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Navigation Item">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[6px] py-0 relative size-full">
          <Icon3 />
          <div className="basis-0 flex flex-col font-['72:Semibold_Duplex',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">
            <p className="leading-[normal] overflow-ellipsis overflow-hidden">Nav Item</p>
          </div>
          <TwoClickArea />
        </div>
      </div>
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path clipRule="evenodd" d={svgPaths.p11d97480} fill="var(--fill-0, #131E29)" fillRule="evenodd" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function NavigationIndicator2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Navigation Indicator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Navigation Indicator">
          <path d={svgPaths.p628ea00} fill="var(--fill-0, #131E29)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function NavigationIndicatorContainer2() {
  return (
    <div className="content-stretch flex h-full items-center justify-center px-[12px] py-[8px] relative shrink-0 w-[36px]" data-name="Navigation Indicator Container">
      <NavigationIndicator2 />
    </div>
  );
}

function TwoClickArea1() {
  return (
    <div className="content-stretch flex h-full items-center relative shrink-0" data-name="Two Click-Area">
      <NavigationIndicatorContainer2 />
    </div>
  );
}

function NavigationItem5() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Navigation Item">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[6px] py-0 relative size-full">
          <Icon4 />
          <div className="basis-0 flex flex-col font-['72:Semibold_Duplex',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">
            <p className="leading-[normal] overflow-ellipsis overflow-hidden">Nav Item</p>
          </div>
          <TwoClickArea1 />
        </div>
      </div>
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_4_2209)" id="Icon">
          <g id="Icon_2">
            <path clipRule="evenodd" d={svgPaths.p24d52180} fill="var(--fill-0, #131E29)" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p96faa70} fill="var(--fill-0, #131E29)" fillRule="evenodd" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_4_2209">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function NavigationItem6() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Navigation Item">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[6px] py-0 relative size-full">
          <Icon5 />
          <div className="basis-0 flex flex-col font-['72:Semibold_Duplex',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">
            <p className="leading-[normal] overflow-ellipsis overflow-hidden">Nav Item</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <g id="Icon_2">
            <path d={svgPaths.p398c9500} fill="var(--fill-0, #131E29)" />
            <path d={svgPaths.p12a35700} fill="var(--fill-0, #131E29)" />
            <path d={svgPaths.p307dd540} fill="var(--fill-0, #131E29)" />
            <path d={svgPaths.p3d710f80} fill="var(--fill-0, #131E29)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function NavigationIndicator3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Navigation Indicator">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Navigation Indicator">
          <path d={svgPaths.p1663edb0} fill="var(--fill-0, #131E29)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function NavigationIndicatorContainer3() {
  return (
    <div className="content-stretch flex h-full items-center justify-center px-[12px] py-[8px] relative shrink-0 w-[36px]" data-name="Navigation Indicator Container">
      <NavigationIndicator3 />
    </div>
  );
}

function TwoClickArea2() {
  return (
    <div className="content-stretch flex h-full items-center relative shrink-0" data-name="Two Click-Area">
      <NavigationIndicatorContainer3 />
    </div>
  );
}

function NavigationItem7() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Navigation Item">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[6px] py-0 relative size-full">
          <Icon6 />
          <div className="basis-0 flex flex-col font-['72:Semibold_Duplex',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">
            <p className="leading-[normal] overflow-ellipsis overflow-hidden">Nav Item</p>
          </div>
          <TwoClickArea2 />
        </div>
      </div>
    </div>
  );
}

function NavigationIndicator4() {
  return <div className="absolute bg-[#0064d9] bottom-0 left-0 top-0 w-[3px]" data-name="Navigation Indicator" />;
}

function NavigationItem8() {
  return (
    <div className="bg-[#ebf8ff] h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Navigation Item">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[4px] items-center pl-[40px] pr-0 py-0 relative size-full">
          <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">
            <p className="leading-[normal] overflow-ellipsis overflow-hidden">Nav Item</p>
          </div>
          <NavigationIndicator4 />
        </div>
      </div>
    </div>
  );
}

function NavigationItem9() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Navigation Item">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center pl-[40px] pr-0 py-0 relative size-full">
          <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">
            <p className="leading-[normal] overflow-ellipsis overflow-hidden">Nav Item</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2d94670} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function NavigationItem10() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Navigation Item">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[6px] py-0 relative size-full">
          <Icon7 />
          <div className="basis-0 flex flex-col font-['72:Semibold_Duplex',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">
            <p className="leading-[normal] overflow-ellipsis overflow-hidden">Nav Item</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentContainer() {
  return (
    <div className="basis-0 bg-white grow min-h-px min-w-px relative shrink-0 w-full" data-name="Content Container">
      <div className="overflow-x-clip overflow-y-auto size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start pb-0 pt-[8px] px-[8px] relative size-full">
          <NavigationItem />
          <NavigationItem1 />
          <NavigationItem2 />
          <NavigationItem3 />
          <NavigationItem4 />
          <NavigationItem5 />
          <NavigationItem6 />
          <NavigationItem7 />
          <NavigationItem8 />
          <NavigationItem9 />
          <NavigationItem10 />
        </div>
      </div>
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_4_2180)" id="Icon">
          <g id="Icon_2">
            <path clipRule="evenodd" d={svgPaths.p1afbe700} fill="var(--fill-0, #0064D9)" fillRule="evenodd" />
            <path d={svgPaths.p34e57700} fill="var(--fill-0, #0064D9)" />
            <path d={svgPaths.p75eac00} fill="var(--fill-0, #0064D9)" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_4_2180">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton() {
  return (
    <div className="content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <Icon8 />
    </div>
  );
}

function NavigationItem11() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Navigation Item">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[8px] py-[5px] relative size-full">
          <IconButton />
          <p className="font-['72:Semibold_Duplex',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] text-nowrap">Quick Create</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#bcc3ca] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_4_2247)" id="Icon">
          <path d={svgPaths.p159ae300} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_4_2247">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function NavigationItem12() {
  return (
    <div className="bg-white h-[32px] relative rounded-[8px] shrink-0 w-full" data-name="Navigation Item">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[16px] pr-[6px] py-0 relative size-full">
          <Icon9 />
          <div className="basis-0 flex flex-col font-['72:Semibold_Duplex',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">
            <p className="leading-[normal] overflow-ellipsis overflow-hidden">Nav Item</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Footer">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[4px] items-start pb-[8px] pt-[4px] px-[8px] relative w-full">
          <div className="h-0 relative shrink-0 w-full" data-name="Separator">
            <div className="absolute inset-[-1px_0_0_0]" style={{ "--stroke-0": "rgba(217, 217, 217, 1)" } as React.CSSProperties}>
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 240 1">
                <line id="Separator" stroke="var(--stroke-0, #D9D9D9)" x2="240" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
          <NavigationItem11 />
          <NavigationItem12 />
        </div>
      </div>
    </div>
  );
}

export default function SideNavigation() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start justify-between relative shadow-[0px_0px_2px_0px_rgba(34,53,72,0.2),0px_2px_4px_0px_rgba(34,53,72,0.2)] size-full" data-name="Side Navigation">
      <ContentContainer />
      <Footer />
    </div>
  );
}
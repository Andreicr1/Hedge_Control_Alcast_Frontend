import svgPaths from "./svg-fgw0vx83tp";
import imgSapLogo from "figma:asset/3e08f7a5932f9da5a3e3ae48c3f051b3899ace69.png";
import imgAvatar from "figma:asset/d292dd374339b730261f5e0c4639b0449008dfba.png";

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p56ff0} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function ShellIconButton() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[36px] p-[10px] relative rounded-[8px] shrink-0" data-name="Shell Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon />
    </div>
  );
}

function HamburgerButton() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Hamburger Button">
      <ShellIconButton />
    </div>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p1a901b80} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function ShellIconButton1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[36px] p-[10px] relative rounded-[8px] shrink-0" data-name="Shell Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon1 />
    </div>
  );
}

function BackButton() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Back Button">
      <ShellIconButton1 />
    </div>
  );
}

function Logo() {
  return (
    <div className="content-stretch flex flex-col h-[32px] items-start px-[4px] py-px relative shrink-0" data-name="Logo">
      <div className="h-[30px] max-h-[32px] relative shrink-0 w-[60px]" data-name="SAP_Logo">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <img alt="" className="absolute h-[98.81%] left-0 max-w-none top-[0.56%] w-full" src={imgSapLogo} />
        </div>
      </div>
    </div>
  );
}

function BrandingButton() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[4px] items-center justify-center pl-[4px] pr-[8px] py-[2px] relative rounded-[8px] shrink-0" data-name="Branding Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Logo />
      <p className="font-['72:Semibold_Duplex',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#003e87] text-[16px] text-nowrap">S/4HANA Cloud</p>
    </div>
  );
}

function ToolbarItems() {
  return (
    <div className="bg-[#d9d9d9] h-[32px] max-w-px min-w-px relative shrink-0 w-px" data-name="Toolbar Items">
      <div className="max-w-[inherit] min-w-[inherit] size-full" />
    </div>
  );
}

function ArrowDown() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Arrow Down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Arrow Down">
          <path d={svgPaths.p1663edb0} fill="var(--fill-0, #131E29)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function MenuButton() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[6px] items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Menu Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['72:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[16px] text-nowrap">Application Name</p>
      <ArrowDown />
    </div>
  );
}

function Slot() {
  return (
    <div className="h-[36px] overflow-clip relative shrink-0 w-[64px]" data-name="Slot">
      <p className="absolute font-['72:Bold',sans-serif] leading-[18px] left-1/2 not-italic text-[12px] text-center text-nowrap top-[calc(50%-9px)] translate-x-[-50%]">[swap slot]</p>
    </div>
  );
}

function ExtraLeftArea() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Extra Left Area">
      <ToolbarItems />
      <MenuButton />
      {[...Array(2).keys()].map((_, i) => (
        <Slot key={i} />
      ))}
    </div>
  );
}

function LeftArea() {
  return (
    <div className="content-stretch flex gap-[8px] h-[52px] items-center relative shrink-0" data-name="Left Area">
      <HamburgerButton />
      <BackButton />
      <BrandingButton />
      <ExtraLeftArea />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p376bb880} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function ShellButton() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[6px] items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[17px] shrink-0 w-[28px]" data-name="Shell Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[17px]" />
      <Icon2 />
    </div>
  );
}

function ShellSearch() {
  return (
    <div className="bg-[#eff1f2] content-stretch flex gap-[4px] h-[36px] items-center justify-end max-w-[576px] min-w-[288px] overflow-clip pl-[14px] pr-[4px] py-[4px] relative rounded-[18px] shrink-0 w-[400px]" data-name="Shell Search">
      <div className="basis-0 flex flex-col font-['72:Italic',sans-serif] grow h-[16px] italic justify-center leading-[0] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#556b82] text-[14px] text-nowrap">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">Search</p>
      </div>
      <ShellButton />
      <div className="absolute bottom-0 h-0 left-0 right-0" data-name="Underline">
        <div className="absolute inset-[-1px_0_0_0]" style={{ "--stroke-0": "rgba(85, 107, 129, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 400 1">
            <line id="Underline" stroke="var(--stroke-0, #556B81)" x2="400" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_0px_0px_1px_rgba(85,107,129,0.25)]" />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p2f6100} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function ShellIconButton2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[36px] p-[10px] relative rounded-[8px] shrink-0" data-name="Shell Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon3 />
    </div>
  );
}

function NotificationButton() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Notification Button">
      <ShellIconButton2 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_45392)" id="Icon">
          <path d={svgPaths.p29415600} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_45392">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function ShellIconButton3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[36px] p-[10px] relative rounded-[8px] shrink-0" data-name="Shell Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon4 />
    </div>
  );
}

function HelpButton() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Help Button">
      <ShellIconButton3 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pe8dd800} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function ShellIconButton4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[36px] p-[10px] relative rounded-[8px] shrink-0" data-name="Shell Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon5 />
    </div>
  );
}

function OverflowButton() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Overflow Button">
      <ShellIconButton4 />
    </div>
  );
}

function Avatar() {
  return (
    <div className="content-stretch flex gap-[10px] items-start max-h-[32px] max-w-[32px] relative rounded-[100px] shrink-0" data-name="Avatar">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[100px] size-full" src={imgAvatar} />
    </div>
  );
}

function RightArea() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0" data-name="Right Area">
      <ShellSearch />
      <NotificationButton />
      <HelpButton />
      <OverflowButton />
      <Avatar />
    </div>
  );
}

function ShellBar() {
  return (
    <div className="bg-white max-w-[1919px] min-w-[1440px] relative shrink-0 w-[1919px]" data-name="Shell Bar">
      <div className="content-stretch flex items-center justify-between max-w-[inherit] min-w-[inherit] overflow-clip pl-[14px] pr-[16px] py-0 relative rounded-[inherit] w-full">
        <LeftArea />
        <RightArea />
      </div>
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

export default function ShellBar1() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Shell Bar">
      <ShellBar />
    </div>
  );
}
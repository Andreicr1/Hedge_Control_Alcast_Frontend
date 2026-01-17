import svgPaths from "./svg-40oz8n411r";
import imgSapLogo from "figma:asset/3e08f7a5932f9da5a3e3ae48c3f051b3899ace69.png";
import imgAvatar from "figma:asset/d292dd374339b730261f5e0c4639b0449008dfba.png";
import imgRectangle from "figma:asset/5a4b98475fbe840ebcf412774b50dc10c2275a93.png";

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
      <p className="font-['72:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[16px] text-nowrap">Sales Order Analysis</p>
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

function ShellIconButton2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[36px] p-[10px] relative rounded-[8px] shrink-0" data-name="Shell Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon2 />
    </div>
  );
}

function ShellButton() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Shell Button">
      <ShellIconButton2 />
    </div>
  );
}

function ShellSearch() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Shell Search">
      <ShellButton />
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

function ShellIconButton3() {
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
      <ShellIconButton3 />
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

function ShellIconButton4() {
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
      <ShellIconButton4 />
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

function ShellIconButton5() {
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
      <ShellIconButton5 />
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
    <div className="bg-white max-w-[1023px] min-w-[600px] relative shrink-0 w-[1023px]" data-name="Shell Bar">
      <div className="content-stretch flex items-center justify-between max-w-[inherit] min-w-[inherit] overflow-clip pl-[14px] pr-[16px] py-0 relative rounded-[inherit] w-full">
        <LeftArea />
        <RightArea />
      </div>
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ShellBar1() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Shell Bar">
      <ShellBar />
    </div>
  );
}

function SlimArrowDown() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="slim-arrow-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="slim-arrow-down">
          <path d={svgPaths.p1663edb0} fill="var(--fill-0, #0064D9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function IconButton() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <SlimArrowDown />
    </div>
  );
}

function VariantManagementForDynamicPageHeader() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[2px] items-center ml-0 mt-0 relative" data-name="Variant Management for Dynamic Page Header">
      <p className="font-['72:Black',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[24px] text-nowrap">Standard</p>
      <IconButton />
    </div>
  );
}

function Error() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="error">
      <div className="absolute inset-[-14.29%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
          <g clipPath="url(#clip0_1_45353)" filter="url(#filter0_d_1_45353)" id="error">
            <path clipRule="evenodd" d={svgPaths.p31fb5d00} fill="var(--fill-0, #F53232)" fillRule="evenodd" id="Icon" />
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="18" id="filter0_d_1_45353" width="18" x="0" y="0">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset />
              <feGaussianBlur stdDeviation="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_1_45353" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_1_45353" mode="normal" result="shape" />
            </filter>
            <clipPath id="clip0_1_45353">
              <rect fill="white" height="14" transform="translate(2 2)" width="14" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function ObjectNumber() {
  return (
    <div className="content-start flex flex-wrap gap-[0px_4px] h-[16px] items-start leading-[0] not-italic pl-[10px] pr-0 py-0 relative shadow-[0px_0px_2px_0px_white,0px_0px_0px_0px_rgba(255,255,255,0),0px_0px_0px_0px_rgba(255,255,255,0),0px_0px_0px_0px_rgba(255,255,255,0)] shrink-0 text-[#aa0808] text-[14px] text-nowrap text-shadow-[0px_0px_0px_rgba(255,255,255,0),0px_0px_0px_rgba(255,255,255,0),0px_0px_0px_rgba(255,255,255,0),0px_0px_2px_white]" data-name="Object Number">
      <div className="flex flex-col font-['72:Regular',sans-serif] justify-center relative shrink-0">
        <p className="leading-[normal] text-nowrap">221.8</p>
      </div>
      <div className="flex flex-col font-['72:Light',sans-serif] justify-center relative shrink-0">
        <p className="leading-[normal] text-nowrap">EUR</p>
      </div>
    </div>
  );
}

function GenericTag() {
  return (
    <div className="[grid-area:1_/_1] bg-[#ffeaf4] content-stretch flex gap-[8px] items-center ml-[161px] mt-[3px] overflow-clip pl-0 pr-[8px] py-0 relative rounded-[9px] shadow-[0px_0px_2px_0px_rgba(34,53,72,0.2),0px_2px_4px_0px_rgba(34,53,72,0.2)]" data-name="Generic Tag">
      <div className="bg-[#f53232] h-[25px] shrink-0 w-[6px]" data-name="Status Indicator" />
      <Error />
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[14px] text-nowrap text-shadow-[0px_0px_0px_rgba(255,255,255,0),0px_0px_0px_rgba(255,255,255,0),0px_0px_0px_rgba(255,255,255,0),0px_0px_2px_white]">PCM</p>
      <ObjectNumber />
    </div>
  );
}

function VariantManagement() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-name="Variant Management">
      <VariantManagementForDynamicPageHeader />
      <GenericTag />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white min-h-[26px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="content-stretch flex gap-[6px] items-center justify-center min-h-[inherit] overflow-clip px-[8px] py-[5px] relative rounded-[inherit]">
        <p className="font-['72:Semibold_Duplex',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] text-nowrap">Adapt Filters</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[#bcc3ca] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex items-start min-h-[26px] relative shrink-0" data-name="Button">
      <Button />
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pebf9000} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function SegmentedButtonSingular() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Segmented Button Singular">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon6 />
    </div>
  );
}

function Icon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p788e100} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function SegmentedButtonSingular1() {
  return (
    <div className="bg-[#edf6ff] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Segmented Button Singular">
      <div aria-hidden="true" className="absolute border border-[#0064d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon7 />
    </div>
  );
}

function SegmentedButton() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center min-h-[26px] relative rounded-[8px] shrink-0" data-name="Segmented Button">
      <div aria-hidden="true" className="absolute border border-[#bcc3ca] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <SegmentedButtonSingular />
      <SegmentedButtonSingular1 />
    </div>
  );
}

function SegmentedButton1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start min-h-[26px] relative shrink-0" data-name="Segmented Button">
      <SegmentedButton />
    </div>
  );
}

function Action() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="action">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_45315)">
          <path d={svgPaths.p2e4f4d80} fill="var(--fill-0, #0064D9)" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_1_45315">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Action />
    </div>
  );
}

function IconButton2() {
  return (
    <div className="content-stretch flex items-start min-h-[26px] relative shrink-0" data-name="Icon Button">
      <IconButton1 />
    </div>
  );
}

function Buttons() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0" data-name="Buttons">
      <Button1 />
      <SegmentedButton1 />
      <IconButton2 />
    </div>
  );
}

function HeaderToolbar() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Header Toolbar">
      <VariantManagement />
      <Buttons />
    </div>
  );
}

function ValueHelp() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="value-help">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="value-help">
          <path d={svgPaths.p1b2a2c00} fill="var(--fill-0, #0064D9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function IconButton3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ValueHelp />
    </div>
  );
}

function IconButton4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start relative shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
      <IconButton3 />
    </div>
  );
}

function VisualFilterTitle() {
  return (
    <div className="content-stretch flex h-[48px] items-center justify-between relative shrink-0 w-full" data-name="Visual Filter Title">
      <p className="font-['72:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[14px] w-[266.025px]">Revenue by Customer Country | K EUR</p>
      <IconButton4 />
    </div>
  );
}

function Container() {
  return (
    <div className="absolute h-[39.01px] left-0 right-0 top-0" data-name="Container">
      <div className="absolute h-[36px] left-0 right-0 top-[2px]" data-name="Selection Background">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(121, 140, 119, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 320 36">
            <path clipRule="evenodd" d={svgPaths.p3fb65e00} fill="var(--fill-0, #798C77)" fillRule="evenodd" id="Selection Background" opacity="0.2" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['72:Bold',sans-serif] leading-[normal] left-[4px] not-italic text-[#131e29] text-[14px] text-nowrap top-[calc(50%-7.51px)]">Italy</p>
    </div>
  );
}

function Bar() {
  return (
    <div className="absolute bg-[#0070f2] h-[24px] left-[124.11px] right-[8.68px] top-[8px]" data-name="Bar">
      <p className="absolute font-['72:Bold',sans-serif] leading-[normal] not-italic right-[27.89px] text-[14px] text-white top-[calc(50%-8px)] tracking-[0.0418px] translate-x-[100%] w-[23.822px]">532</p>
    </div>
  );
}

function BaseBarWithLabel() {
  return (
    <div className="absolute inset-[0_0_66.67%_0]" data-name=".base/Bar with Label">
      <Container />
      <Bar />
      <div className="absolute h-[40px] left-[123px] top-0 w-[1.092px]" data-name="Separator">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(85, 107, 129, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.092 40">
            <path clipRule="evenodd" d="M0 40H1.092V0H0V40Z" fill="var(--fill-0, #556B81)" fillRule="evenodd" id="Separator" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute bottom-0 left-0 top-0 w-[306px]" data-name="Container">
      <p className="absolute font-['72:Regular',sans-serif] leading-[normal] left-[9px] not-italic text-[#556b82] text-[14px] top-[calc(50%-8px)] w-[106.31px]">Brazil</p>
    </div>
  );
}

function Bar1() {
  return (
    <div className="absolute bg-[#0070f2] h-[24px] left-[124.11px] right-[8.24px] top-1/2 translate-y-[-50%]" data-name="Bar">
      <p className="absolute font-['72:Bold',sans-serif] leading-[normal] not-italic right-[28.89px] text-[14px] text-white top-[calc(50%-8px)] tracking-[0.0418px] translate-x-[100%] w-[23.822px]">186</p>
    </div>
  );
}

function BaseBarWithLabel1() {
  return (
    <div className="absolute inset-[33.33%_38.89%_33.34%_0]" data-name=".base/Bar with Label">
      <Container1 />
      <Bar1 />
      <div className="absolute h-[39.004px] left-[123px] top-[calc(50%-0.5px)] translate-y-[-50%] w-[3px]" data-name="Separator">
        <div className="absolute inset-[0_63.6%_0_0]" style={{ "--fill-0": "rgba(85, 107, 129, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.09207 39.0036">
            <path clipRule="evenodd" d={svgPaths.p12577980} fill="var(--fill-0, #556B81)" fillRule="evenodd" id="Separator" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bottom-0 left-0 top-0 w-[306px]" data-name="Container">
      <p className="absolute font-['72:Regular',sans-serif] leading-[normal] left-[9px] not-italic text-[#556b82] text-[14px] top-[calc(50%-8px)] w-[106.31px]">Canada</p>
    </div>
  );
}

function Bar2() {
  return (
    <div className="absolute bg-[#0070f2] h-[24px] left-[124.11px] right-[8.37px] top-1/2 translate-y-[-50%]" data-name="Bar">
      <p className="absolute font-['72:Bold',sans-serif] leading-[normal] not-italic right-[28.89px] text-[14px] text-white top-[calc(50%-8px)] tracking-[0.0418px] translate-x-[100%] w-[23.822px]">132</p>
    </div>
  );
}

function BaseBarWithLabel2() {
  return (
    <div className="absolute inset-[66.66%_45.1%_0.02%_0]" data-name=".base/Bar with Label">
      <Container2 />
      <Bar2 />
      <div className="absolute h-[39.004px] left-[123px] top-[calc(50%-0.5px)] translate-y-[-50%] w-[3px]" data-name="Separator">
        <div className="absolute inset-[0_63.6%_0_0]" style={{ "--fill-0": "rgba(85, 107, 129, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.09207 39.0036">
            <path clipRule="evenodd" d={svgPaths.p12577980} fill="var(--fill-0, #556B81)" fillRule="evenodd" id="Separator" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ChartContent() {
  return (
    <div className="h-[120px] relative shrink-0 w-full" data-name="Chart Content">
      <BaseBarWithLabel />
      <BaseBarWithLabel1 />
      <BaseBarWithLabel2 />
    </div>
  );
}

function BaseInteractiveCharts() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[184px] items-start min-w-[320px] pb-0 pt-[8px] px-0 relative shrink-0 w-[320px]" data-name=".base/Interactive  Charts">
      <VisualFilterTitle />
      <ChartContent />
    </div>
  );
}

function ValueHelp1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="value-help">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="value-help">
          <path d={svgPaths.p1b2a2c00} fill="var(--fill-0, #0064D9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function IconButton5() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ValueHelp1 />
    </div>
  );
}

function IconButton6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start relative shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
      <IconButton5 />
    </div>
  );
}

function VisualFilterTitle1() {
  return (
    <div className="content-stretch flex h-[48px] items-center justify-between relative shrink-0 w-full" data-name="Visual Filter Title">
      <p className="font-['72:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[14px] text-nowrap">Revenue by Month | M EUR</p>
      <IconButton6 />
    </div>
  );
}

function BaseLineChartBarWithLabels() {
  return (
    <div className="absolute h-[119.983px] left-0 top-0 w-[51.242px]" data-name=".base/Line Chart Bar with Labels">
      <div className="absolute right-[21.24px] size-[8px] top-[35.02px]" data-name="Dot">
        <div className="absolute inset-[-6.25%]" style={{ "--fill-0": "rgba(0, 112, 242, 1)", "--stroke-0": "rgba(0, 112, 242, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
            <circle cx="4.5" cy="4.5" fill="var(--fill-0, #0070F2)" id="Dot" r="4" stroke="var(--stroke-0, #0070F2)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['72:Regular',sans-serif] leading-[normal] left-0 not-italic right-0 text-[#556b82] text-[14px] text-center top-[14.02px]">31.7</p>
      <p className="absolute bottom-[19.98px] font-['72:Regular',sans-serif] leading-[normal] left-[18.51%] not-italic right-[19.78%] text-[#556b82] text-[14px] text-center translate-y-[100%]">Jan</p>
    </div>
  );
}

function BaseLineChartBarWithLabels1() {
  return (
    <div className="absolute h-[119.983px] left-[55.24px] top-0 w-[51.242px]" data-name=".base/Line Chart Bar with Labels">
      <div className="absolute inset-0" style={{ "--fill-0": "rgba(121, 140, 119, 1)" } as React.CSSProperties}>
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 51.2418 119.983">
          <path clipRule="evenodd" d={svgPaths.pcd2c600} fill="var(--fill-0, #798C77)" fillRule="evenodd" id="Selection Background" opacity="0.3" />
        </svg>
      </div>
      <div className="absolute right-[21.24px] size-[8px] top-[35.02px]" data-name="Dot">
        <div className="absolute inset-[-6.25%]" style={{ "--fill-0": "rgba(0, 112, 242, 1)", "--stroke-0": "rgba(0, 112, 242, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
            <circle cx="4.5" cy="4.5" fill="var(--fill-0, #0070F2)" id="Dot" r="4" stroke="var(--stroke-0, #0070F2)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['72:Bold',sans-serif] leading-[normal] left-0 not-italic right-0 text-[#131e29] text-[14px] text-center top-[14.02px]">31.7</p>
      <p className="absolute bottom-[19.96px] font-['72:Bold',sans-serif] leading-[normal] left-[19.3%] not-italic right-[18.99%] text-[#131e29] text-[14px] text-center translate-y-[100%]">Jan</p>
    </div>
  );
}

function BaseLineChartBarWithLabels2() {
  return (
    <div className="absolute h-[112.304px] left-[110.48px] top-[7.68px] w-[51.242px]" data-name=".base/Line Chart Bar with Labels">
      <div className="absolute right-[21.24px] size-[8px] top-[35.02px]" data-name="Dot">
        <div className="absolute inset-[-6.25%]" style={{ "--fill-0": "rgba(0, 112, 242, 1)", "--stroke-0": "rgba(0, 112, 242, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
            <circle cx="4.5" cy="4.5" fill="var(--fill-0, #0070F2)" id="Dot" r="4" stroke="var(--stroke-0, #0070F2)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['72:Regular',sans-serif] leading-[normal] left-0 not-italic right-0 text-[#556b82] text-[14px] text-center top-[14.02px]">31.7</p>
      <p className="absolute bottom-[20.3px] font-['72:Regular',sans-serif] leading-[normal] left-[18.51%] not-italic right-[19.78%] text-[#556b82] text-[14px] text-center translate-y-[100%]">Jan</p>
    </div>
  );
}

function BaseLineChartBarWithLabels3() {
  return (
    <div className="absolute h-[104.625px] left-[165.73px] top-[15.36px] w-[51.242px]" data-name=".base/Line Chart Bar with Labels">
      <div className="absolute right-[21.24px] size-[8px] top-[35.02px]" data-name="Dot">
        <div className="absolute inset-[-6.25%]" style={{ "--fill-0": "rgba(0, 112, 242, 1)", "--stroke-0": "rgba(0, 112, 242, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
            <circle cx="4.5" cy="4.5" fill="var(--fill-0, #0070F2)" id="Dot" r="4" stroke="var(--stroke-0, #0070F2)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['72:Regular',sans-serif] leading-[normal] left-0 not-italic right-0 text-[#556b82] text-[14px] text-center top-[14.02px]">31.7</p>
      <p className="absolute bottom-[19.63px] font-['72:Regular',sans-serif] leading-[normal] left-[18.51%] not-italic right-[19.78%] text-[#556b82] text-[14px] text-center translate-y-[100%]">Jan</p>
    </div>
  );
}

function BaseLineChartBarWithLabels4() {
  return (
    <div className="absolute h-[98.866px] left-[220.97px] top-[21.12px] w-[51.242px]" data-name=".base/Line Chart Bar with Labels">
      <div className="absolute right-[21.24px] size-[8px] top-[35.02px]" data-name="Dot">
        <div className="absolute inset-[-6.25%]" style={{ "--fill-0": "rgba(0, 112, 242, 1)", "--stroke-0": "rgba(0, 112, 242, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
            <circle cx="4.5" cy="4.5" fill="var(--fill-0, #0070F2)" id="Dot" r="4" stroke="var(--stroke-0, #0070F2)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['72:Regular',sans-serif] leading-[normal] left-0 not-italic right-0 text-[#556b82] text-[14px] text-center top-[14.02px]">31.7</p>
      <p className="absolute bottom-[19.87px] font-['72:Regular',sans-serif] leading-[normal] left-[18.51%] not-italic right-[19.78%] text-[#556b82] text-[14px] text-center translate-y-[100%]">Jan</p>
    </div>
  );
}

function BaseLineChartBarWithLabels5() {
  return (
    <div className="absolute h-[68px] left-[275.91px] top-[52px] w-[52px]" data-name=".base/Line Chart Bar with Labels">
      <div className="absolute right-[21px] size-[8px] top-[35.02px]" data-name="Dot">
        <div className="absolute inset-[-6.25%]" style={{ "--fill-0": "rgba(0, 112, 242, 1)", "--stroke-0": "rgba(0, 112, 242, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
            <circle cx="4.5" cy="4.5" fill="var(--fill-0, #0070F2)" id="Dot" r="4" stroke="var(--stroke-0, #0070F2)" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['72:Regular',sans-serif] leading-[normal] left-0 not-italic right-0 text-[#556b82] text-[14px] text-center top-[14.02px]">31.7</p>
      <p className="absolute bottom-[20px] font-['72:Regular',sans-serif] leading-[normal] left-[18.51%] not-italic right-[19.78%] text-[#556b82] text-[14px] text-center translate-y-[100%]">Jan</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="absolute h-[119.983px] left-[2.09px] top-0 w-[327.451px]" data-name="Container">
      <BaseLineChartBarWithLabels />
      <BaseLineChartBarWithLabels1 />
      <BaseLineChartBarWithLabels2 />
      <BaseLineChartBarWithLabels3 />
      <BaseLineChartBarWithLabels4 />
      <BaseLineChartBarWithLabels5 />
    </div>
  );
}

function LineChart() {
  return (
    <div className="basis-0 grow min-h-px min-w-px overflow-clip relative shrink-0 w-full" data-name="Line Chart">
      <div className="absolute h-[3px] left-0 top-[96px] w-[330px]" data-name="Separator">
        <div className="absolute inset-[0_0_63.6%_0]" style={{ "--fill-0": "rgba(121, 140, 119, 1)", "--stroke-0": "rgba(121, 140, 119, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 330 1.092">
            <path clipRule="evenodd" d="M0 1.092H330V0H0V1.092Z" fill="var(--fill-0, #798C77)" fillRule="evenodd" id="Separator" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[58px] left-0 top-[33px] w-[305px]" data-name="Graph">
        <div className="absolute inset-[-1.69%_-0.16%_-1.51%_-0.07%]" style={{ "--stroke-0": "rgba(121, 140, 119, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 305.692 59.8535">
            <path d={svgPaths.p21bd1300} id="Graph" stroke="var(--stroke-0, #798C77)" strokeWidth="2" />
          </svg>
        </div>
      </div>
      <Container3 />
    </div>
  );
}

function BaseInteractiveCharts1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[184px] items-center min-w-[320px] pb-0 pt-[8px] px-0 relative shrink-0 w-[330px]" data-name=".base/Interactive  Charts">
      <VisualFilterTitle1 />
      <LineChart />
    </div>
  );
}

function ValueHelp2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="value-help">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="value-help">
          <path d={svgPaths.p1b2a2c00} fill="var(--fill-0, #0064D9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function IconButton7() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ValueHelp2 />
    </div>
  );
}

function IconButton8() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-start relative shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
      <IconButton7 />
    </div>
  );
}

function VisualFilterTitle2() {
  return (
    <div className="content-stretch flex h-[48px] items-center justify-between relative shrink-0 w-full" data-name="Visual Filter Title">
      <p className="font-['72:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[14px] w-[248.826px]">Revenue by Main Category I K EUR</p>
      <IconButton8 />
    </div>
  );
}

function VariableSegmentsCircleCopy() {
  return (
    <div className="absolute left-[-0.28px] size-[104px] top-0" data-name="Variable segments circle Copy">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 104 104">
        <g id="Variable segments circle Copy">
          <g id="Base plate"></g>
          <path d={svgPaths.p84d900} fill="var(--fill-0, #0070F2)" id="Donut Chart Segment" stroke="var(--stroke-0, white)" />
          <path d={svgPaths.pf7f1600} fill="var(--fill-0, #5D36FF)" id="Donut Chart Segment_2" stroke="var(--stroke-0, white)" />
          <path d={svgPaths.p3d047370} fill="var(--fill-0, #8B47D7)" id="Donut Chart Segment_3" stroke="var(--stroke-0, white)" />
        </g>
      </svg>
    </div>
  );
}

function BaseFilterValueLabel() {
  return (
    <div className="absolute h-[36px] left-[144.72px] rounded-[8px] top-px w-[173.21px]" data-name=".base/Filter Value Label">
      <div className="absolute inset-[0_0.08%_-0.14%_0.05%]" data-name="Selection Background">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(121, 140, 119, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 173 36.0497">
            <path clipRule="evenodd" d={svgPaths.p15e64400} fill="var(--fill-0, #798C77)" fillRule="evenodd" id="Selection Background" opacity="0.3" />
          </svg>
        </div>
      </div>
      <div className="absolute h-[14.064px] left-[4px] top-[calc(50%+0.03px)] translate-y-[-50%] w-[14px]" data-name="Legend Indicator">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 112, 242, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14.0644">
            <path clipRule="evenodd" d={svgPaths.p1de25b00} fill="var(--fill-0, #0070F2)" fillRule="evenodd" id="Legend Indicator" opacity="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['72:Bold',sans-serif] h-[16px] leading-[normal] not-italic right-[147.42px] text-[#131e29] text-[14px] top-[calc(50%-8px)] translate-x-[100%] w-[147px]">Personal Equ... 55.0%</p>
    </div>
  );
}

function BaseFilterValueLabel1() {
  return (
    <div className="absolute h-[36px] left-[144.72px] rounded-[8px] top-[81px] w-[173.21px]" data-name=".base/Filter Value Label">
      <div className="absolute h-[14.064px] left-[4px] top-[calc(50%+0.03px)] translate-y-[-50%] w-[14px]" data-name="Legend Indicator">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(93, 54, 255, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14.0644">
            <path clipRule="evenodd" d={svgPaths.p1de25b00} fill="var(--fill-0, #5D36FF)" fillRule="evenodd" id="Legend Indicator" opacity="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['72:Regular',sans-serif] h-[15.956px] leading-[normal] not-italic right-[147.21px] text-[#556b82] text-[14px] top-[calc(50%-8px)] translate-x-[100%] w-[146.293px]">{`Other                 30.5%`}</p>
    </div>
  );
}

function BaseFilterValueLabel2() {
  return (
    <div className="absolute h-[36px] left-[144.72px] rounded-[8px] top-[41px] w-[173.21px]" data-name=".base/Filter Value Label">
      <div className="absolute h-[14.064px] left-[4px] top-[calc(50%+0.03px)] translate-y-[-50%] w-[14px]" data-name="Legend Indicator">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(139, 71, 215, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14.0644">
            <path clipRule="evenodd" d={svgPaths.p1de25b00} fill="var(--fill-0, #8B47D7)" fillRule="evenodd" id="Legend Indicator" opacity="0.8" />
          </svg>
        </div>
      </div>
      <p className="absolute font-['72:Regular',sans-serif] h-[15.956px] leading-[normal] not-italic right-[147.21px] text-[#556b82] text-[14px] top-[calc(50%-8px)] translate-x-[100%] w-[146.293px]">{`Computer Sy...  30.5%`}</p>
    </div>
  );
}

function DonutChart() {
  return (
    <div className="h-[120px] relative shrink-0 w-[320px]" data-name="Donut Chart">
      <VariableSegmentsCircleCopy />
      <BaseFilterValueLabel />
      <BaseFilterValueLabel1 />
      <BaseFilterValueLabel2 />
    </div>
  );
}

function BaseInteractiveCharts2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] h-[184px] items-start min-w-[320px] pb-0 pt-[8px] px-0 relative shrink-0 w-[320px]" data-name=".base/Interactive  Charts">
      <VisualFilterTitle2 />
      <DonutChart />
    </div>
  );
}

function SlimArrowRight() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="slim-arrow-right">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="slim-arrow-right">
          <path d={svgPaths.p628ea00} fill="var(--fill-0, #0064D9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function IconButton9() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] right-[9px] rounded-[8px] top-[calc(50%-1px)] translate-y-[-50%] w-[16px]" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <SlimArrowRight />
    </div>
  );
}

function RightArrow() {
  return (
    <div className="absolute contents right-0 top-0" data-name="right arrow">
      <div className="absolute bg-white bottom-0 right-0 top-0 w-[32px]" data-name="Cover" />
      <IconButton9 />
    </div>
  );
}

function Charts() {
  return (
    <div className="content-stretch flex gap-[32px] items-center overflow-clip relative shrink-0 w-full" data-name="Charts">
      <BaseInteractiveCharts />
      <BaseInteractiveCharts1 />
      <BaseInteractiveCharts2 />
      <RightArrow />
    </div>
  );
}

function GradientLine() {
  return (
    <div className="absolute contents left-0 right-0 top-0" data-name="Gradient Line">
      <div className="absolute flex h-px items-center justify-center left-0 right-[67.35%] top-0">
        <div className="flex-none h-px rotate-[180deg] scale-y-[-100%] w-[64px]">
          <div className="relative size-full" data-name="Rectangle">
            <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgRectangle} />
          </div>
        </div>
      </div>
      <div className="absolute bg-[#bcc3ca] h-px left-[32.65%] right-[32.65%] top-0" data-name="Rectangle" />
      <div className="absolute h-px left-[67.35%] right-0 top-0" data-name="Rectangle">
        <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none size-full" src={imgRectangle} />
      </div>
    </div>
  );
}

function BaseHeaderIndicationLine() {
  return (
    <div className="absolute h-px left-0 right-0 top-[11.5px]" data-name=".base/Header Indication Line">
      <GradientLine />
    </div>
  );
}

function Icon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3bdbc700} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconButton10() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[#bcc3ca] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon8 />
    </div>
  );
}

function Icon9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p23088dc0} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconButton11() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[#bcc3ca] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon9 />
    </div>
  );
}

function Buttons1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-start left-1/2 top-0 translate-x-[-50%]" data-name="Buttons">
      <IconButton10 />
      <IconButton11 />
    </div>
  );
}

function BaseHeaderIndication() {
  return (
    <div className="absolute bottom-[-9px] h-[22px] left-[414px] w-[196px]" data-name=".base/Header Indication">
      <BaseHeaderIndicationLine />
      <Buttons1 />
    </div>
  );
}

function VisualFilterBar() {
  return (
    <div className="bg-white relative shadow-[0px_2px_2px_0px_rgba(34,53,72,0.05)] shrink-0 w-full" data-name="Visual Filter Bar">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[48px] items-center pb-[53px] pt-[16px] px-[32px] relative w-full">
          <HeaderToolbar />
          <Charts />
          <BaseHeaderIndication />
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_-1px_0px_0px_#d9d9d9]" />
    </div>
  );
}

function ScrollBar() {
  return (
    <div className="absolute bg-white bottom-[388px] right-0 top-[52px] w-[12px]" data-name="Scroll Bar">
      <div className="absolute bg-[#7b91a8] border-2 border-solid border-white bottom-[265px] left-0 rounded-[12px] top-[2px] w-[12px]" data-name="Scroll Face" />
    </div>
  );
}

function Header() {
  return (
    <div className="basis-0 content-stretch flex gap-[10px] grow items-center min-h-[26px] min-w-px relative shrink-0 w-full" data-name="Header">
      <p className="basis-0 font-['72:Bold',sans-serif] grow h-[18px] leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[16px] text-nowrap">Sales Order Items</p>
    </div>
  );
}

function Header1() {
  return (
    <div className="basis-0 bg-white grow min-h-[40px] min-w-px relative shrink-0 w-full" data-name="Header">
      <div className="min-h-[inherit] overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[9px] items-start min-h-[inherit] px-[16px] py-[7px] relative size-full">
          <Header />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function HeaderToolbar1() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-full items-start min-h-px min-w-px relative shrink-0" data-name="Header Toolbar">
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Header1 />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] min-h-[26px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="content-stretch flex gap-[6px] items-center justify-center min-h-[inherit] overflow-clip px-[8px] py-[5px] relative rounded-[inherit]">
        <p className="font-['72:Semibold_Duplex',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] text-nowrap">Details</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Button">
      <Button2 />
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] min-h-[26px] relative rounded-[8px] shrink-0" data-name="Button">
      <div className="content-stretch flex gap-[6px] items-center justify-center min-h-[inherit] overflow-clip px-[8px] py-[5px] relative rounded-[inherit]">
        <p className="font-['72:Semibold_Duplex',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] text-nowrap">Drill Down</p>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Button">
      <Button4 />
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3b842500} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconButton12() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon10 />
    </div>
  );
}

function IconButton13() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Icon Button">
      <IconButton12 />
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <g id="Icon_2">
            <path d={svgPaths.p3987abc0} fill="var(--fill-0, #0064D9)" />
            <path clipRule="evenodd" d={svgPaths.p1bc60c00} fill="var(--fill-0, #0064D9)" fillRule="evenodd" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function IconButton14() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon11 />
    </div>
  );
}

function IconButton15() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Icon Button">
      <IconButton14 />
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <g id="Icon_2">
            <path d={svgPaths.pdf5c080} fill="var(--fill-0, #0064D9)" />
            <path clipRule="evenodd" d={svgPaths.p1bc60c00} fill="var(--fill-0, #0064D9)" fillRule="evenodd" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function IconButton16() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon12 />
    </div>
  );
}

function IconButton17() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Icon Button">
      <IconButton16 />
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_45249)" id="Icon">
          <path d={svgPaths.p1927da00} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_45249">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton18() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon13 />
    </div>
  );
}

function IconButton19() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Icon Button">
      <IconButton18 />
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_13638)" id="action-settings">
          <path d={svgPaths.p20c87a00} fill="var(--fill-0, #0064D9)" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_1_13638">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton20() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon14 />
    </div>
  );
}

function IconButton21() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Icon Button">
      <IconButton20 />
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_13632)" id="full-screen">
          <path d={svgPaths.p20052540} fill="var(--fill-0, #0064D9)" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_1_13632">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton22() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon15 />
    </div>
  );
}

function IconButton23() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Icon Button">
      <IconButton22 />
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p18f77700} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconButton24() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon16 />
    </div>
  );
}

function IconButton25() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Icon Button">
      <IconButton24 />
    </div>
  );
}

function Separator() {
  return (
    <div className="h-[24px] relative shrink-0 w-px" data-name="Separator 2">
      <div className="absolute bg-[#d9d9d9] inset-0" data-name="Rectangle" />
    </div>
  );
}

function Icon17() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_45422)" id="Icon">
          <path d={svgPaths.p9451000} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_45422">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function SegmentedButtonSingular2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Segmented Button Singular">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon17 />
    </div>
  );
}

function Icon18() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p21c1e00} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function SegmentedButtonSingular3() {
  return (
    <div className="bg-[#edf6ff] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Segmented Button Singular">
      <div aria-hidden="true" className="absolute border border-[#0064d9] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon18 />
    </div>
  );
}

function Icon19() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p3f2700} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function SegmentedButtonSingular4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Segmented Button Singular">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon19 />
    </div>
  );
}

function SegmentedButton2() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center min-h-[26px] relative rounded-[8px] shrink-0" data-name="Segmented Button">
      <div aria-hidden="true" className="absolute border border-[#bcc3ca] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <SegmentedButtonSingular2 />
      <SegmentedButtonSingular3 />
      <SegmentedButtonSingular4 />
    </div>
  );
}

function SegmentedButton3() {
  return (
    <div className="bg-white content-stretch flex items-start relative shrink-0" data-name="Segmented Button">
      <SegmentedButton2 />
    </div>
  );
}

function Buttons2() {
  return (
    <div className="content-stretch flex gap-[8px] h-full items-center justify-end pl-0 pr-[8px] py-[8px] relative shrink-0" data-name="Buttons">
      <Button3 />
      <Button5 />
      <IconButton13 />
      <IconButton15 />
      <IconButton17 />
      <IconButton19 />
      <IconButton21 />
      <IconButton23 />
      <IconButton25 />
      <Separator />
      <SegmentedButton3 />
    </div>
  );
}

function ChartHeaderToolbar() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between relative shrink-0 w-full" data-name="Chart Header Toolbar">
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="basis-0 flex flex-row grow items-center self-stretch shrink-0">
        <HeaderToolbar1 />
      </div>
      <div className="flex flex-row items-center self-stretch">
        <Buttons2 />
      </div>
    </div>
  );
}

function ParentItem() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0" data-name="Parent Item">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] text-nowrap">Sales Order Items</p>
    </div>
  );
}

function Breadcrumb() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Breadcrumb">
      <ParentItem />
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#556b82] text-[14px] text-nowrap">/</p>
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#556b82] text-[14px] text-nowrap">By Revenue and Cost</p>
    </div>
  );
}

function Breadcrumb1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Breadcrumb">
      <Breadcrumb />
    </div>
  );
}

function ChartLineContainer() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[16px] items-center ml-0 mt-0 relative w-[896px]" data-name="Chart Line Container">
      <p className="font-['72:Regular',sans-serif] h-[15px] leading-[16px] not-italic relative shrink-0 text-[#556b82] text-[12px] text-right w-[30px]">150K</p>
      <div className="basis-0 grow h-0 min-h-px min-w-px relative shrink-0" data-name="Line">
        <div className="absolute inset-[-0.5px_0]" style={{ "--fill-0": "rgba(117, 140, 164, 1)", "--stroke-0": "rgba(217, 217, 217, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 850 1">
            <g id="Line">
              <path clipRule="evenodd" d="M0 0.5H850Z" fill="var(--fill-0, #758CA4)" fillRule="evenodd" />
              <path d="M0 0.5H850" stroke="var(--stroke-0, #D9D9D9)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function ChartLineContainer1() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[16px] items-center ml-0 mt-[38px] relative w-[896px]" data-name="Chart Line Container">
      <p className="font-['72:Regular',sans-serif] h-[15px] leading-[16px] not-italic relative shrink-0 text-[#556b82] text-[12px] text-right w-[30px]">100K</p>
      <div className="basis-0 grow h-px min-h-px min-w-px relative shrink-0" data-name="Line">
        <div className="absolute bottom-1/2 left-0 right-0 top-[-50%]" style={{ "--fill-0": "rgba(117, 140, 164, 1)", "--stroke-0": "rgba(217, 217, 217, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 850 1">
            <g id="Line">
              <path clipRule="evenodd" d="M0 0.5H850Z" fill="var(--fill-0, #758CA4)" fillRule="evenodd" />
              <path d="M0 0.5H850" stroke="var(--stroke-0, #D9D9D9)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function ChartLineContainer2() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[16px] items-center ml-0 mt-[76px] relative w-[896px]" data-name="Chart Line Container">
      <p className="font-['72:Regular',sans-serif] h-[15px] leading-[16px] not-italic relative shrink-0 text-[#556b82] text-[12px] text-right w-[30px]">50K</p>
      <div className="basis-0 grow h-px min-h-px min-w-px relative shrink-0" data-name="Line">
        <div className="absolute bottom-1/2 left-0 right-0 top-[-50%]" style={{ "--fill-0": "rgba(117, 140, 164, 1)", "--stroke-0": "rgba(217, 217, 217, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 850 1">
            <g id="Line">
              <path clipRule="evenodd" d="M0 0.5H850Z" fill="var(--fill-0, #758CA4)" fillRule="evenodd" />
              <path d="M0 0.5H850" stroke="var(--stroke-0, #D9D9D9)" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function ChartLineContainer3() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[11px] items-end ml-[5.62px] mt-[109px] relative w-[886.872px]" data-name="Chart Line Container">
      <p className="font-['72:Regular',sans-serif] h-[15px] leading-[16px] not-italic relative shrink-0 text-[#556b82] text-[12px] text-right w-[22px]">0</p>
      <div className="basis-0 grow h-px min-h-px min-w-px relative shrink-0" data-name="Line">
        <div className="absolute bottom-1/2 left-0 right-0 top-[-50%]" style={{ "--stroke-0": "rgba(117, 140, 164, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 853.872 1">
            <path d="M0 0.5H853.872" id="Line" stroke="var(--stroke-0, #758CA4)" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Lines() {
  return (
    <div className="[grid-area:1_/_1] grid-cols-[max-content] grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative" data-name="Lines">
      <ChartLineContainer />
      <ChartLineContainer1 />
      <ChartLineContainer2 />
      <ChartLineContainer3 />
    </div>
  );
}

function Component() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[85.746px]" data-name="1">
      <div className="h-[69.136px] relative shrink-0 w-[85.746px]" data-name="Bar">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 112, 242, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 85.7462 69.1358">
            <path clipRule="evenodd" d={svgPaths.p14d41d80} fill="var(--fill-0, #0070F2)" fillRule="evenodd" id="Bar" />
          </svg>
        </div>
      </div>
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#556b82] text-[12px] text-center w-[59.955px]">Anav Ideon</p>
    </div>
  );
}

function Component1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[85.746px]" data-name="2">
      <div className="h-[83.951px] relative shrink-0 w-[85.746px]" data-name="Bar">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 112, 242, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 85.7462 83.9506">
            <path clipRule="evenodd" d={svgPaths.p13aa7600} fill="var(--fill-0, #0070F2)" fillRule="evenodd" id="Bar" />
          </svg>
        </div>
      </div>
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#556b82] text-[12px] text-center w-[50.962px]">HEPA Tec</p>
    </div>
  );
}

function Component2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[85.746px]" data-name="3">
      <div className="h-[113.58px] relative shrink-0 w-[85.746px]" data-name="Bar">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 112, 242, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 85.7462 113.58">
            <path clipRule="evenodd" d={svgPaths.p2ddbda00} fill="var(--fill-0, #0070F2)" fillRule="evenodd" id="Bar" />
          </svg>
        </div>
      </div>
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#556b82] text-[12px] text-center w-[57.957px]">Brazil Tech</p>
    </div>
  );
}

function Component3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[85.746px]" data-name="4">
      <div className="h-[104.938px] relative shrink-0 w-[85.746px]" data-name="Bar">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 112, 242, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 85.7462 104.938">
            <path clipRule="evenodd" d={svgPaths.p3ef9e700} fill="var(--fill-0, #0070F2)" fillRule="evenodd" id="Bar" />
          </svg>
        </div>
      </div>
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#556b82] text-[12px] text-center w-[37.972px]">Angeré</p>
    </div>
  );
}

function Component4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[85.746px]" data-name="5">
      <div className="h-[29.63px] relative shrink-0 w-[85.746px]" data-name="Bar">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 112, 242, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 85.7462 29.6296">
            <path clipRule="evenodd" d={svgPaths.p18fd65f0} fill="var(--fill-0, #0070F2)" fillRule="evenodd" id="Bar" />
          </svg>
        </div>
      </div>
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#556b82] text-[12px] text-center w-[35.973px]">Jologa</p>
    </div>
  );
}

function Component5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[85.746px]" data-name="6">
      <div className="h-[92.593px] relative shrink-0 w-[85.746px]" data-name="Bar">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 112, 242, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 85.7462 92.5926">
            <path clipRule="evenodd" d={svgPaths.p229f3f80} fill="var(--fill-0, #0070F2)" fillRule="evenodd" id="Bar" />
          </svg>
        </div>
      </div>
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#556b82] text-[12px] text-center w-[42.968px]">DelBont</p>
    </div>
  );
}

function Component6() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[85.746px]" data-name="7">
      <div className="h-[59.259px] relative shrink-0 w-[85.746px]" data-name="Bar">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 112, 242, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 85.7462 59.2593">
            <path clipRule="evenodd" d={svgPaths.pfc3cb00} fill="var(--fill-0, #0070F2)" fillRule="evenodd" id="Bar" />
          </svg>
        </div>
      </div>
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#556b82] text-[12px] text-center w-[40.97px]">Laurent</p>
    </div>
  );
}

function Component7() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center relative shrink-0 w-[85.746px]" data-name="8">
      <div className="h-[82.716px] relative shrink-0 w-[85.746px]" data-name="Bar">
        <div className="absolute inset-0" style={{ "--fill-0": "rgba(0, 112, 242, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 85.7462 82.716">
            <path clipRule="evenodd" d={svgPaths.p39b3dc00} fill="var(--fill-0, #0070F2)" fillRule="evenodd" id="Bar" />
          </svg>
        </div>
      </div>
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#556b82] text-[12px] text-center w-[43.967px]">Quimica</p>
    </div>
  );
}

function Bars() {
  return (
    <div className="[grid-area:1_/_1] content-stretch flex gap-[22px] items-end justify-center ml-[40px] mt-[10.52px] relative w-[816.798px]" data-name="Bars">
      <Component />
      <Component1 />
      <Component2 />
      <Component3 />
      <Component4 />
      <Component5 />
      <Component6 />
      <Component7 />
    </div>
  );
}

function SmartChart() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0 w-full" data-name="Smart Chart">
      <Lines />
      <Bars />
    </div>
  );
}

function SmartChart1() {
  return (
    <div className="relative shrink-0 w-full" data-name="Smart Chart">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[32px] items-center px-[32px] py-0 relative w-full">
          <Breadcrumb1 />
          <SmartChart />
        </div>
      </div>
    </div>
  );
}

function SmartChart2() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[8px] items-center overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Smart Chart">
      <ChartHeaderToolbar />
      <SmartChart1 />
    </div>
  );
}

function LeftArea1() {
  return (
    <div className="basis-0 grow h-[38px] min-h-px min-w-px relative shrink-0" data-name="Left Area">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[8px] pr-0 py-0 relative size-full">
          <div className="flex flex-col font-['72:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1d2d3e] text-[16px] text-nowrap">
            <p className="leading-[normal]">Sales Orders Items</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextContainer() {
  return (
    <div className="basis-0 grow min-h-px min-w-px mr-[-8px] relative shrink-0" data-name="Text Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center px-[8px] py-[5px] relative w-full">
          <p className="basis-0 font-['72:Italic',sans-serif] grow h-[16px] italic leading-[normal] min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#556b82] text-[14px] text-nowrap">Search</p>
        </div>
      </div>
    </div>
  );
}

function Icon20() {
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

function TrailingAction() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center overflow-clip px-[8px] py-[5px] relative rounded-[4px] shrink-0" data-name="Trailing Action">
      <Icon20 />
    </div>
  );
}

function ButtonContainer() {
  return (
    <div className="content-stretch flex items-start justify-center mr-[-8px] relative shrink-0" data-name="Button Container">
      <TrailingAction />
    </div>
  );
}

function InputField() {
  return (
    <div className="basis-0 bg-white content-stretch flex grow items-center max-h-[26px] min-h-[26px] min-w-[32px] overflow-clip pl-0 pr-[8px] py-0 relative rounded-[4px] shrink-0" data-name="Input Field">
      <TextContainer />
      <ButtonContainer />
      <div className="absolute bottom-0 h-0 left-0 right-0" data-name="Underline">
        <div className="absolute inset-[-1px_0_0_0]" style={{ "--stroke-0": "rgba(85, 107, 129, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 280 1">
            <line id="Underline" stroke="var(--stroke-0, #556B81)" x2="280" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_0px_0px_1px_rgba(85,107,129,0.25)]" />
    </div>
  );
}

function Input() {
  return (
    <div className="content-stretch flex gap-[8px] items-center max-h-[26px] min-h-[26px] min-w-[32px] relative rounded-[4px] shrink-0 w-[280px]" data-name="Input">
      <InputField />
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[6px] items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['72:Semibold_Duplex',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] text-nowrap">Create</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[6px] items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['72:Semibold_Duplex',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] text-nowrap">Delete</p>
    </div>
  );
}

function ActivityItems() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="activity-items">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_45236)" id="activity-items">
          <g id="Icon">
            <path clipRule="evenodd" d={svgPaths.p36a93080} fill="var(--fill-0, #0064D9)" fillRule="evenodd" />
            <path d={svgPaths.p9170700} fill="var(--fill-0, #0064D9)" />
            <path d={svgPaths.pf0f4180} fill="var(--fill-0, #0064D9)" />
            <path d={svgPaths.p3cecf100} fill="var(--fill-0, #0064D9)" />
            <path d={svgPaths.p3da09600} fill="var(--fill-0, #0064D9)" />
            <path d={svgPaths.p189f3f00} fill="var(--fill-0, #0064D9)" />
            <path d={svgPaths.p4567300} fill="var(--fill-0, #0064D9)" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_1_45236">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton26() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ActivityItems />
    </div>
  );
}

function ToolbarItems1() {
  return (
    <div className="bg-[#d9d9d9] h-[26px] max-w-px min-w-px relative shrink-0 w-px" data-name="Toolbar Items">
      <div className="max-w-[inherit] min-w-[inherit] size-full" />
    </div>
  );
}

function ActionSettings() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="action-settings">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_13638)" id="action-settings">
          <path d={svgPaths.p20c87a00} fill="var(--fill-0, #0064D9)" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_1_13638">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton27() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ActionSettings />
    </div>
  );
}

function ExcelAttachment() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="excel-attachment">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="excel-attachment">
          <g id="Icon">
            <path d={svgPaths.p3b107e00} fill="var(--fill-0, #0064D9)" />
            <path clipRule="evenodd" d={svgPaths.p3bf49700} fill="var(--fill-0, #0064D9)" fillRule="evenodd" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function IconButton28() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ExcelAttachment />
    </div>
  );
}

function SlimArrowDown1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="slim-arrow-down">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="slim-arrow-down">
          <path d={svgPaths.p1663edb0} fill="var(--fill-0, #0064D9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function IconButton29() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <SlimArrowDown1 />
    </div>
  );
}

function IconSplitButton() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] relative rounded-[8px] shrink-0" data-name="Icon Split Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <IconButton28 />
      <div className="h-[16px] relative shrink-0 w-0" data-name="Separator">
        <div className="absolute inset-[-3.13%_-0.5px]" style={{ "--stroke-0": "rgba(0, 100, 217, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 17">
            <path d="M0.5 16.5V0.5" id="Separator" stroke="var(--stroke-0, #0064D9)" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <IconButton29 />
    </div>
  );
}

function Icon21() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_13632)" id="full-screen">
          <path d={svgPaths.p20052540} fill="var(--fill-0, #0064D9)" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_1_13632">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function NinthAction() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Ninth Action">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon21 />
    </div>
  );
}

function Toolbar() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Toolbar">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-end px-[8px] py-[3px] relative w-full">
          <LeftArea1 />
          <Input />
          <Button6 />
          <Button7 />
          <IconButton26 />
          <ToolbarItems1 />
          <IconButton27 />
          <ToolbarItems1 />
          <IconSplitButton />
          <ToolbarItems1 />
          <NinthAction />
        </div>
      </div>
    </div>
  );
}

function TableHighlight() {
  return (
    <div className="absolute bottom-px left-0 top-0 w-[6px]" data-name="Table Highlight">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-solid border-white inset-0 pointer-events-none" />
    </div>
  );
}

function TableCell7() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[6px] min-h-[32px] min-w-[6px] relative self-stretch shrink-0" data-name="Table Cell 1-01">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <TableHighlight />
    </div>
  );
}

function Checkbox() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox />
    </div>
  );
}

function TableCell8() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-h-[32px] max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell 1-02">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <CheckBox />
    </div>
  );
}

function TableCell9() {
  return (
    <div className="basis-0 bg-white grow max-h-[32px] min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 1-03">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center max-h-[inherit] min-h-[inherit] size-full">
        <div className="content-stretch flex items-center max-h-[inherit] min-h-[inherit] p-[8px] relative w-full">
          <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">Sales Order</p>
        </div>
      </div>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="basis-0 bg-white grow max-h-[32px] min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 1-04">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center max-h-[inherit] min-h-[inherit] size-full">
        <div className="content-stretch flex items-center max-h-[inherit] min-h-[inherit] p-[8px] relative w-full">
          <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">Company</p>
        </div>
      </div>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="basis-0 bg-white grow max-h-[32px] min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 1-05">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center max-h-[inherit] min-h-[inherit] size-full">
        <div className="content-stretch flex items-center max-h-[inherit] min-h-[inherit] p-[8px] relative w-full">
          <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">City</p>
        </div>
      </div>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="basis-0 bg-white grow max-h-[32px] min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 1-06">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center max-h-[inherit] min-h-[inherit] size-full">
        <div className="content-stretch flex items-center max-h-[inherit] min-h-[inherit] p-[8px] relative w-full">
          <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">Contact Person</p>
        </div>
      </div>
    </div>
  );
}

function TableCell13() {
  return (
    <div className="basis-0 bg-white grow max-h-[32px] min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 1-07">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end max-h-[inherit] min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-end max-h-[inherit] min-h-[inherit] p-[8px] relative w-full">
          <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap text-right">Posting Date</p>
        </div>
      </div>
    </div>
  );
}

function TableCell14() {
  return (
    <div className="basis-0 bg-white grow max-h-[32px] min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 1-08">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end max-h-[inherit] min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-end max-h-[inherit] min-h-[inherit] p-[8px] relative w-full">
          <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap text-right">Amount</p>
        </div>
      </div>
    </div>
  );
}

function TableCell() {
  return (
    <div className="bg-white max-h-[32px] min-h-[32px] relative shrink-0 w-[8px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center max-h-[inherit] min-h-[inherit] size-full">
        <div className="content-stretch flex items-center max-h-[inherit] min-h-[inherit] p-[8px] w-full" />
      </div>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="bg-white content-stretch flex items-center max-h-[32px] min-h-[32px] p-[8px] relative shrink-0 w-[34px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ActionsContainer() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Actions Container">
      <TableCell />
      {[...Array(2).keys()].map((_, i) => (
        <TableCell1 key={i} />
      ))}
      <TableCell />
    </div>
  );
}

function TableCell2() {
  return (
    <div className="bg-white content-stretch flex items-center max-h-[32px] min-h-[32px] p-[8px] relative shrink-0 w-[32px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function HeaderRow() {
  return (
    <div className="content-stretch flex items-start min-h-[32px] relative shrink-0 w-full z-[14]" data-name="Header Row">
      <TableCell7 />
      <TableCell8 />
      <TableCell9 />
      <TableCell10 />
      <TableCell11 />
      <TableCell12 />
      <TableCell13 />
      <TableCell14 />
      <ActionsContainer />
      <TableCell2 />
    </div>
  );
}

function Row2InteractionState() {
  return (
    <div className="absolute bg-[#ebf8ff] inset-[0_-190px_-140px_0]" data-name="Row 2 Interaction State">
      <div aria-hidden="true" className="absolute border-[#0064d9] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function TableHighlight1() {
  return (
    <div className="bg-[#0070f2] h-full relative shrink-0 w-[7px]" data-name="Table Highlight">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-solid border-white inset-0 pointer-events-none" />
    </div>
  );
}

function TableCell15() {
  return (
    <div className="content-stretch flex items-start max-w-[6px] min-h-[32px] min-w-[6px] pb-px pt-0 px-0 relative self-stretch shrink-0 w-[6px]" data-name="Table Cell 2-01">
      <TableHighlight1 />
    </div>
  );
}

function CheckMark() {
  return (
    <div className="absolute left-1/2 size-[12px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="CheckMark">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="CheckMark">
          <path d={svgPaths.p19628e00} fill="var(--fill-0, #0064D9)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function Checkbox1() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
      <CheckMark />
    </div>
  );
}

function CheckBox1() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox1 />
    </div>
  );
}

function TableCell16() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] p-[8px] relative self-stretch shrink-0" data-name="Table Cell 2-02">
      <CheckBox1 />
    </div>
  );
}

function ObjectIdentifier() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start justify-center leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[14px]" data-name="Object Identifier">
      <p className="font-['72:Bold',sans-serif] relative shrink-0 text-[#0064d9] w-full">232058679452165</p>
      <p className="font-['72:Regular',sans-serif] relative shrink-0 text-[#556b82] w-full">Description</p>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 2-03">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative w-full">
          <ObjectIdentifier />
        </div>
      </div>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 2-04">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Jologa</p>
        </div>
      </div>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 2-05">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Erie, PL9 8AT</p>
        </div>
      </div>
    </div>
  );
}

function TableCell20() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 2-06">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Katrin Bauer</p>
        </div>
      </div>
    </div>
  );
}

function TableCell21() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 2-07">
      <div className="flex flex-row items-center justify-end min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-end min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">02/26/2024</p>
        </div>
      </div>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 2-08">
      <div className="flex flex-row items-center justify-end min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-end min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">19,503.26 EUR</p>
        </div>
      </div>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="h-full min-h-[32px] relative shrink-0 w-[8px]" data-name="Table Cell">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="min-h-[inherit] size-full" />
      </div>
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_45459)" id="Icon">
          <path d={svgPaths.p30bcf970} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_45459">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton30() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon22 />
    </div>
  );
}

function TableCell23() {
  return (
    <div className="content-stretch flex h-full items-center min-h-[32px] pl-0 pr-[2px] py-[3px] relative shrink-0" data-name="Table Cell 2-10">
      <IconButton30 />
    </div>
  );
}

function Icon23() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p13e2700} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconButton31() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon23 />
    </div>
  );
}

function TableCell24() {
  return (
    <div className="content-stretch flex h-full items-center min-h-[32px] pl-0 pr-[2px] py-[3px] relative shrink-0" data-name="Table Cell 2-11">
      <IconButton31 />
    </div>
  );
}

function ActionsContainer1() {
  return (
    <div className="content-stretch flex items-start relative self-stretch shrink-0" data-name="Actions Container">
      <TableCell3 />
      <TableCell23 />
      <TableCell24 />
      <TableCell3 />
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p21b12300} fill="var(--fill-0, #758CA4)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function TableCell25() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative self-stretch shrink-0" data-name="Table Cell 2-12">
      <Icon24 />
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex items-start min-h-[32px] relative shrink-0 w-full" data-name="Row">
      <TableCell16 />
      <TableCell17 />
      <TableCell18 />
      <TableCell19 />
      <TableCell20 />
      <TableCell21 />
      <TableCell22 />
      <ActionsContainer1 />
      <TableCell25 />
    </div>
  );
}

function Content() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Content">
      <Row />
    </div>
  );
}

function Row1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full z-[12]" data-name="Row">
      <Row2InteractionState />
      <TableCell15 />
      <Content />
    </div>
  );
}

function Row3InteractionState() {
  return (
    <div className="absolute bg-white inset-[0_-190px_-140px_0] min-h-[32px]" data-name="Row 3 Interaction State">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function TableHighlight2() {
  return (
    <div className="h-full relative shrink-0 w-[7px]" data-name="Table Highlight">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-solid border-white inset-0 pointer-events-none" />
    </div>
  );
}

function TableCell26() {
  return (
    <div className="content-stretch flex items-start max-w-[6px] min-h-[32px] min-w-[6px] pb-px pt-0 px-0 relative self-stretch shrink-0 w-[6px]" data-name="Table Cell 3-01">
      <TableHighlight2 />
    </div>
  );
}

function Checkbox2() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox2() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox2 />
    </div>
  );
}

function TableCell27() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] p-[8px] relative self-stretch shrink-0" data-name="Table Cell 3-02">
      <CheckBox2 />
    </div>
  );
}

function ObjectIdentifier1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start justify-center leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[14px]" data-name="Object Identifier">
      <p className="font-['72:Bold',sans-serif] relative shrink-0 text-[#0064d9] w-full">761302359006367</p>
      <p className="font-['72:Regular',sans-serif] relative shrink-0 text-[#556b82] w-full">Description</p>
    </div>
  );
}

function TableCell28() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 3-03">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative w-full">
          <ObjectIdentifier1 />
        </div>
      </div>
    </div>
  );
}

function TableCell29() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 3-04">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Jologa</p>
        </div>
      </div>
    </div>
  );
}

function TableCell30() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 3-05">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Edinburg, GU31 6OQ</p>
        </div>
      </div>
    </div>
  );
}

function TableCell31() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 3-06">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">John Miller</p>
        </div>
      </div>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 3-07">
      <div className="flex flex-row items-center justify-end min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-end min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">02/26/2024</p>
        </div>
      </div>
    </div>
  );
}

function TableCell33() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 3-08">
      <div className="flex flex-row items-center justify-end min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-end min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">33,620.26 KWD</p>
        </div>
      </div>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="h-full min-h-[32px] relative shrink-0 w-[8px]" data-name="Table Cell">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="min-h-[inherit] size-full" />
      </div>
    </div>
  );
}

function Icon25() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_45459)" id="Icon">
          <path d={svgPaths.p30bcf970} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_45459">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton32() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon25 />
    </div>
  );
}

function TableCell34() {
  return (
    <div className="content-stretch flex h-full items-center min-h-[32px] pl-0 pr-[2px] py-[3px] relative shrink-0" data-name="Table Cell 3-10">
      <IconButton32 />
    </div>
  );
}

function Icon26() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p13e2700} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconButton33() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon26 />
    </div>
  );
}

function TableCell35() {
  return (
    <div className="content-stretch flex h-full items-center min-h-[32px] pl-0 pr-[2px] py-[3px] relative shrink-0" data-name="Table Cell 3-11">
      <IconButton33 />
    </div>
  );
}

function ActionsContainer2() {
  return (
    <div className="content-stretch flex items-start relative self-stretch shrink-0" data-name="Actions Container">
      <TableCell4 />
      <TableCell34 />
      <TableCell35 />
      <TableCell4 />
    </div>
  );
}

function Icon27() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p21b12300} fill="var(--fill-0, #758CA4)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function TableCell36() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative self-stretch shrink-0" data-name="Table Cell 3-12">
      <Icon27 />
    </div>
  );
}

function Row2() {
  return (
    <div className="content-stretch flex items-start min-h-[32px] relative shrink-0 w-full" data-name="Row">
      <TableCell27 />
      <TableCell28 />
      <TableCell29 />
      <TableCell30 />
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <ActionsContainer2 />
      <TableCell36 />
    </div>
  );
}

function Content1() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Content">
      <Row2 />
    </div>
  );
}

function Row3() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full z-[11]" data-name="Row">
      <Row3InteractionState />
      <TableCell26 />
      <Content1 />
    </div>
  );
}

function Row4InteractionState() {
  return (
    <div className="absolute bg-white inset-[0_-190px_-140px_0] min-h-[32px]" data-name="Row4 Interaction State">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function TableHighlight3() {
  return (
    <div className="h-full relative shrink-0 w-[7px]" data-name="Table Highlight">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-solid border-white inset-0 pointer-events-none" />
    </div>
  );
}

function TableCell37() {
  return (
    <div className="content-stretch flex items-start max-w-[6px] min-h-[32px] min-w-[6px] pb-px pt-0 px-0 relative self-stretch shrink-0 w-[6px]" data-name="Table Cell 4-01">
      <TableHighlight3 />
    </div>
  );
}

function Checkbox3() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox3() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox3 />
    </div>
  );
}

function TableCell38() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] p-[8px] relative self-stretch shrink-0" data-name="Table Cell 4-02">
      <CheckBox3 />
    </div>
  );
}

function ObjectIdentifier2() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start justify-center leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[14px]" data-name="Object Identifier">
      <p className="font-['72:Bold',sans-serif] relative shrink-0 text-[#0064d9] w-full">305382373556494</p>
      <p className="font-['72:Regular',sans-serif] relative shrink-0 text-[#556b82] w-full">Description</p>
    </div>
  );
}

function TableCell39() {
  return (
    <div className="basis-0 bg-white grow min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 4-03">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative w-full">
          <ObjectIdentifier2 />
        </div>
      </div>
    </div>
  );
}

function TableCell40() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 4-04">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Jologa</p>
        </div>
      </div>
    </div>
  );
}

function TableCell41() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 4-05">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Moore, VC8 4CY</p>
        </div>
      </div>
    </div>
  );
}

function TableCell42() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 4-06">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Julie Armstrong</p>
        </div>
      </div>
    </div>
  );
}

function TableCell43() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 4-07">
      <div className="flex flex-row items-center justify-end min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-end min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">02/25/2024</p>
        </div>
      </div>
    </div>
  );
}

function TableCell44() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 4-08">
      <div className="flex flex-row items-center justify-end min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-end min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">23,747.36 USD</p>
        </div>
      </div>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="h-full min-h-[32px] relative shrink-0 w-[8px]" data-name="Table Cell">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="min-h-[inherit] size-full" />
      </div>
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_45459)" id="Icon">
          <path d={svgPaths.p30bcf970} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_45459">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton34() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon28 />
    </div>
  );
}

function TableCell45() {
  return (
    <div className="content-stretch flex h-full items-center min-h-[32px] pl-0 pr-[2px] py-[3px] relative shrink-0" data-name="Table Cell 4-10">
      <IconButton34 />
    </div>
  );
}

function Icon29() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p13e2700} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconButton35() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon29 />
    </div>
  );
}

function TableCell46() {
  return (
    <div className="content-stretch flex h-full items-center min-h-[32px] pl-0 pr-[2px] py-[3px] relative shrink-0" data-name="Table Cell 4-11">
      <IconButton35 />
    </div>
  );
}

function ActionsContainer3() {
  return (
    <div className="content-stretch flex items-start relative self-stretch shrink-0" data-name="Actions Container">
      <TableCell5 />
      <TableCell45 />
      <TableCell46 />
      <TableCell5 />
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p21b12300} fill="var(--fill-0, #758CA4)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function TableCell47() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative self-stretch shrink-0" data-name="Table Cell 4-12">
      <Icon30 />
    </div>
  );
}

function Row4() {
  return (
    <div className="content-stretch flex items-start min-h-[32px] relative shrink-0 w-full" data-name="Row">
      <TableCell38 />
      <TableCell39 />
      <TableCell40 />
      <TableCell41 />
      <TableCell42 />
      <TableCell43 />
      <TableCell44 />
      <ActionsContainer3 />
      <TableCell47 />
    </div>
  );
}

function Content2() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Content">
      <Row4 />
    </div>
  );
}

function Row5() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full z-10" data-name="Row">
      <Row4InteractionState />
      <TableCell37 />
      <Content2 />
    </div>
  );
}

function Row5InteractionState() {
  return (
    <div className="absolute bg-white inset-[0_-190px_-184px_0] min-h-[32px]" data-name="Row 5 Interaction State">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function TableHighlight4() {
  return (
    <div className="h-full relative shrink-0 w-[7px]" data-name="Table Highlight">
      <div aria-hidden="true" className="absolute border-[0px_1px_0px_0px] border-solid border-white inset-0 pointer-events-none" />
    </div>
  );
}

function TableCell48() {
  return (
    <div className="content-stretch flex items-start max-w-[6px] min-h-[32px] min-w-[6px] pb-px pt-0 px-0 relative self-stretch shrink-0 w-[6px]" data-name="Table Cell 5-01">
      <TableHighlight4 />
    </div>
  );
}

function Checkbox4() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox4() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox4 />
    </div>
  );
}

function TableCell49() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] p-[8px] relative self-stretch shrink-0" data-name="Table Cell 5-02">
      <CheckBox4 />
    </div>
  );
}

function ObjectIdentifier3() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start justify-center leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[14px]" data-name="Object Identifier">
      <p className="font-['72:Bold',sans-serif] relative shrink-0 text-[#0064d9] w-full">584481767262332</p>
      <p className="font-['72:Regular',sans-serif] relative shrink-0 text-[#556b82] w-full">Description</p>
    </div>
  );
}

function TableCell50() {
  return (
    <div className="basis-0 bg-white grow min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 5-03">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative w-full">
          <ObjectIdentifier3 />
        </div>
      </div>
    </div>
  );
}

function TableCell51() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 5-04">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">DelBont Industries</p>
        </div>
      </div>
    </div>
  );
}

function TableCell52() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 5-05">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Baldwin Park, GD1 6VJ</p>
        </div>
      </div>
    </div>
  );
}

function TableCell53() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 5-06">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Nathalie Perrin</p>
        </div>
      </div>
    </div>
  );
}

function TableCell54() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 5-07">
      <div className="flex flex-row items-center justify-end min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-end min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">02/25/2024</p>
        </div>
      </div>
    </div>
  );
}

function TableCell55() {
  return (
    <div className="basis-0 grow min-h-[32px] min-w-px relative self-stretch shrink-0" data-name="Table Cell 5-08">
      <div className="flex flex-row items-center justify-end min-h-[inherit] size-full">
        <div className="content-stretch flex items-center justify-end min-h-[inherit] px-[8px] py-[4px] relative size-full">
          <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">51,451.56 EUR</p>
        </div>
      </div>
    </div>
  );
}

function TableCell6() {
  return (
    <div className="h-full min-h-[32px] relative shrink-0 w-[8px]" data-name="Table Cell">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="min-h-[inherit] size-full" />
      </div>
    </div>
  );
}

function Icon31() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_45459)" id="Icon">
          <path d={svgPaths.p30bcf970} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_45459">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton36() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon31 />
    </div>
  );
}

function TableCell56() {
  return (
    <div className="content-stretch flex h-full items-center min-h-[32px] pl-0 pr-[2px] py-[3px] relative shrink-0" data-name="Table Cell 5-10">
      <IconButton36 />
    </div>
  );
}

function Icon32() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p13e2700} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconButton37() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon32 />
    </div>
  );
}

function TableCell57() {
  return (
    <div className="content-stretch flex h-full items-center min-h-[32px] pl-0 pr-[2px] py-[3px] relative shrink-0" data-name="Table Cell 5-11">
      <IconButton37 />
    </div>
  );
}

function ActionsContainer4() {
  return (
    <div className="content-stretch flex items-start relative self-stretch shrink-0" data-name="Actions Container">
      <TableCell6 />
      <TableCell56 />
      <TableCell57 />
      <TableCell6 />
    </div>
  );
}

function Icon33() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p21b12300} fill="var(--fill-0, #758CA4)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function TableCell58() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative self-stretch shrink-0" data-name="Table Cell 5-12">
      <Icon33 />
    </div>
  );
}

function Row6() {
  return (
    <div className="content-stretch flex items-start min-h-[32px] relative shrink-0 w-full" data-name="Row">
      <TableCell49 />
      <TableCell50 />
      <TableCell51 />
      <TableCell52 />
      <TableCell53 />
      <TableCell54 />
      <TableCell55 />
      <ActionsContainer4 />
      <TableCell58 />
    </div>
  );
}

function Content3() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Content">
      <Row6 />
    </div>
  );
}

function Row7() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full z-[8]" data-name="Row">
      <Row5InteractionState />
      <TableCell48 />
      <Content3 />
    </div>
  );
}

function Table() {
  return (
    <div className="content-stretch flex flex-col isolate items-start overflow-clip relative shrink-0 w-full" data-name="Table">
      <HeaderRow />
      <Row1 />
      <Row3 />
      <Row5 />
      <Row7 />
    </div>
  );
}

function ResponsiveTable() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-[12px] shrink-0 w-full" data-name="Responsive Table">
      <Toolbar />
      <Table />
    </div>
  );
}

function AnalyticalListPageContent() {
  return (
    <div className="h-[387px] relative shrink-0 w-full" data-name="Analytical List Page Content">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center pb-0 pt-[16px] px-[32px] relative size-full">
          <SmartChart2 />
          <ResponsiveTable />
        </div>
      </div>
    </div>
  );
}

export default function AnalyticalListPage() {
  return (
    <div className="bg-[#f5f6f7] content-stretch flex flex-col items-center relative size-full" data-name="Analytical List Page">
      <ShellBar1 />
      <VisualFilterBar />
      <ScrollBar />
      <AnalyticalListPageContent />
    </div>
  );
}
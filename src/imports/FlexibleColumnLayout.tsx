import svgPaths from "./svg-bb8kg7dvfl";
import imgSapLogo from "figma:asset/3e08f7a5932f9da5a3e3ae48c3f051b3899ace69.png";
import imgAvatar from "figma:asset/d292dd374339b730261f5e0c4639b0449008dfba.png";
import imgAvatar1 from "figma:asset/9cf16acb2a84f9573e19db0d2c7b2d15b48ba41c.png";
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
      <p className="font-['72:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[16px] text-nowrap">View Products Details</p>
      <ArrowDown />
    </div>
  );
}

function MenuButton1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Menu Button">
      <MenuButton />
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
      <MenuButton1 />
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
        <g clipPath="url(#clip0_1_45200)" id="Icon">
          <path d={svgPaths.p804d3c0} fill="var(--fill-0, #131E29)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_45200">
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
    <div className="bg-white max-w-[1919px] min-w-[1440px] relative shrink-0 w-full" data-name="Shell Bar">
      <div className="flex flex-row items-center max-w-[inherit] min-w-[inherit] overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center justify-between max-w-[inherit] min-w-[inherit] pl-[14px] pr-[16px] py-0 relative w-full">
          <LeftArea />
          <RightArea />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Title() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full" data-name="Title">
      <p className="font-['72:Black',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1d2d3e] text-[20px] text-nowrap">Products (23)</p>
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

function Icon6() {
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
      <Icon6 />
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
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 408 1">
            <line id="Underline" stroke="var(--stroke-0, #556B81)" x2="408" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_0px_0px_1px_rgba(85,107,129,0.25)]" />
    </div>
  );
}

function Input() {
  return (
    <div className="content-stretch flex gap-[8px] items-center max-h-[26px] min-h-[26px] min-w-[32px] overflow-clip relative rounded-[4px] shrink-0 w-full" data-name="Input">
      <InputField />
    </div>
  );
}

function Search() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[26px] items-start min-h-px min-w-px relative shrink-0" data-name="Search">
      <Input />
    </div>
  );
}

function Overflow() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="overflow">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.pe8dd800} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconButton() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Overflow />
    </div>
  );
}

function SearchAndButtons() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Search and Buttons">
      <Search />
      <IconButton />
    </div>
  );
}

function Header() {
  return (
    <div className="bg-white relative shadow-[0px_2px_2px_0px_rgba(34,53,72,0.05)] shrink-0 w-full" data-name="Header">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[8px] relative w-full">
        <Title />
        <SearchAndButtons />
      </div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_-1px_0px_0px_#d9d9d9]" />
    </div>
  );
}

function Title1() {
  return (
    <div className="basis-0 grow h-[38px] min-h-px min-w-px relative shrink-0" data-name="Title">
      <div className="flex flex-row justify-end size-full">
        <div className="content-stretch flex items-start justify-end pl-[8px] pr-0 py-0 relative size-full">
          <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow h-[38px] justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#1d2d3e] text-[16px]">
            <p className="leading-[normal]">Product</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Title2() {
  return (
    <div className="basis-0 grow h-[38px] min-h-px min-w-px relative shrink-0" data-name="Title">
      <div className="flex flex-row justify-end size-full">
        <div className="content-stretch flex items-start justify-end pl-[8px] pr-[32px] py-0 relative size-full">
          <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow h-[38px] justify-center leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#1d2d3e] text-[16px] text-right">
            <p className="leading-[normal]">Price</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColumnsTitles() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Columns Titles">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center justify-end size-full">
        <div className="content-stretch flex gap-[8px] items-center justify-end px-[8px] py-[3px] relative w-full">
          <Title1 />
          <Title2 />
        </div>
      </div>
    </div>
  );
}

function Bylines() {
  return (
    <div className="content-stretch flex gap-[10px] items-end relative shrink-0 w-full" data-name="Bylines">
      <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#556b82] text-[14px] text-nowrap">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">HT-2001</p>
      </div>
    </div>
  );
}

function TextByline() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[44px] items-center justify-between min-h-px min-w-px px-0 py-[2px] relative shrink-0" data-name="Text + Byline">
      <div className="flex flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap w-full">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">Robot Arm Series 9</p>
      </div>
      <Bylines />
    </div>
  );
}

function TextContainer1() {
  return (
    <div className="content-stretch flex gap-[16px] h-[76px] items-center mr-[-16px] p-[16px] relative shrink-0 w-[438px]" data-name="Text Container">
      <TextByline />
      <div className="-webkit-box flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[0px] text-right w-[75px]">
        <p className="leading-[normal] text-[14px]">
          <span className="font-['72:Bold',sans-serif] not-italic">449.99</span>
          <span>{` EUR`}</span>
        </p>
      </div>
    </div>
  );
}

function TrailingIcon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Trailing Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Trailing Icon">
          <path d={svgPaths.p628ea00} fill="var(--fill-0, #758CA4)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function TrailingIconContainer() {
  return (
    <div className="content-stretch flex h-full items-center justify-center mr-[-16px] px-[12px] py-[8px] relative shrink-0 w-[39px]" data-name="Trailing Icon Container">
      <TrailingIcon />
    </div>
  );
}

function TableCell() {
  return (
    <div className="bg-[#ebf8ff] content-stretch flex items-center pl-0 pr-[16px] py-0 relative shrink-0 w-full z-[13]" data-name="Table Cell 2-03">
      <div aria-hidden="true" className="absolute border-[#0064d9] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <TextContainer1 />
      <div className="flex flex-row items-center self-stretch">
        <TrailingIconContainer />
      </div>
    </div>
  );
}

function Bylines1() {
  return (
    <div className="content-stretch flex gap-[10px] items-end relative shrink-0 w-full" data-name="Bylines">
      <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#556b82] text-[14px] text-nowrap">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">HT-2000</p>
      </div>
    </div>
  );
}

function TextByline1() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[44px] items-center justify-between min-h-px min-w-px px-0 py-[2px] relative shrink-0" data-name="Text + Byline">
      <div className="flex flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap w-full">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">7’’ Widescreen Portable DVD Player w/ MP3</p>
      </div>
      <Bylines1 />
    </div>
  );
}

function TextContainer2() {
  return (
    <div className="content-stretch flex gap-[16px] h-[76px] items-center mr-[-16px] p-[16px] relative shrink-0 w-[438px]" data-name="Text Container">
      <TextByline1 />
      <div className="-webkit-box flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[0px] text-right w-[75px]">
        <p className="leading-[normal] text-[14px]">
          <span className="font-['72:Bold',sans-serif] not-italic">249.99</span>
          <span>{` EUR`}</span>
        </p>
      </div>
    </div>
  );
}

function TrailingIcon1() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Trailing Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Trailing Icon">
          <path d={svgPaths.p628ea00} fill="var(--fill-0, #758CA4)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function TrailingIconContainer1() {
  return (
    <div className="content-stretch flex h-full items-center justify-center mr-[-16px] px-[12px] py-[8px] relative shrink-0 w-[39px]" data-name="Trailing Icon Container">
      <TrailingIcon1 />
    </div>
  );
}

function TableCell1() {
  return (
    <div className="bg-white content-stretch flex items-center pl-0 pr-[16px] py-0 relative shrink-0 w-full z-[12]" data-name="Table Cell 2-03">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <TextContainer2 />
      <div className="flex flex-row items-center self-stretch">
        <TrailingIconContainer1 />
      </div>
    </div>
  );
}

function Bylines2() {
  return (
    <div className="content-stretch flex gap-[10px] items-end relative shrink-0 w-full" data-name="Bylines">
      <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#556b82] text-[14px] text-nowrap">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">HT-1251</p>
      </div>
    </div>
  );
}

function TextByline2() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[44px] items-center justify-between min-h-px min-w-px px-0 py-[2px] relative shrink-0" data-name="Text + Byline">
      <div className="flex flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap w-full">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">Astro Laptop 1516</p>
      </div>
      <Bylines2 />
    </div>
  );
}

function TextContainer3() {
  return (
    <div className="content-stretch flex gap-[16px] h-[76px] items-center mr-[-16px] p-[16px] relative shrink-0 w-[438px]" data-name="Text Container">
      <TextByline2 />
      <div className="-webkit-box flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[0px] text-right w-[75px]">
        <p className="leading-[normal] text-[14px]">
          <span className="font-['72:Bold',sans-serif] not-italic">989.00</span>
          <span>{` EUR`}</span>
        </p>
      </div>
    </div>
  );
}

function TrailingIcon2() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Trailing Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Trailing Icon">
          <path d={svgPaths.p628ea00} fill="var(--fill-0, #758CA4)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function TrailingIconContainer2() {
  return (
    <div className="content-stretch flex h-full items-center justify-center mr-[-16px] px-[12px] py-[8px] relative shrink-0 w-[39px]" data-name="Trailing Icon Container">
      <TrailingIcon2 />
    </div>
  );
}

function TableCell2() {
  return (
    <div className="bg-white content-stretch flex items-center pl-0 pr-[16px] py-0 relative shrink-0 w-full z-[11]" data-name="Table Cell 2-03">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <TextContainer3 />
      <div className="flex flex-row items-center self-stretch">
        <TrailingIconContainer2 />
      </div>
    </div>
  );
}

function Bylines3() {
  return (
    <div className="content-stretch flex gap-[10px] items-end relative shrink-0 w-full" data-name="Bylines">
      <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#556b82] text-[14px] text-nowrap">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">HT-1252</p>
      </div>
    </div>
  );
}

function TextByline3() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[44px] items-center justify-between min-h-px min-w-px px-0 py-[2px] relative shrink-0" data-name="Text + Byline">
      <div className="flex flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap w-full">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">Astro Phone 6</p>
      </div>
      <Bylines3 />
    </div>
  );
}

function TextContainer4() {
  return (
    <div className="content-stretch flex gap-[16px] h-[76px] items-center mr-[-16px] p-[16px] relative shrink-0 w-[438px]" data-name="Text Container">
      <TextByline3 />
      <div className="-webkit-box flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[0px] text-right w-[75px]">
        <p className="leading-[normal] text-[14px]">
          <span className="font-['72:Bold',sans-serif] not-italic">649.00</span>
          <span>{` EUR`}</span>
        </p>
      </div>
    </div>
  );
}

function TrailingIcon3() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Trailing Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Trailing Icon">
          <path d={svgPaths.p628ea00} fill="var(--fill-0, #758CA4)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function TrailingIconContainer3() {
  return (
    <div className="content-stretch flex h-full items-center justify-center mr-[-16px] px-[12px] py-[8px] relative shrink-0 w-[39px]" data-name="Trailing Icon Container">
      <TrailingIcon3 />
    </div>
  );
}

function TableCell3() {
  return (
    <div className="bg-white content-stretch flex items-center pl-0 pr-[16px] py-0 relative shrink-0 w-full z-[9]" data-name="Table Cell 2-03">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <TextContainer4 />
      <div className="flex flex-row items-center self-stretch">
        <TrailingIconContainer3 />
      </div>
    </div>
  );
}

function Bylines4() {
  return (
    <div className="content-stretch flex gap-[10px] items-end relative shrink-0 w-full" data-name="Bylines">
      <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#556b82] text-[14px] text-nowrap">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">HT-2026</p>
      </div>
    </div>
  );
}

function TextByline4() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[44px] items-center justify-between min-h-px min-w-px px-0 py-[2px] relative shrink-0" data-name="Text + Byline">
      <div className="flex flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap w-full">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">{`Audio/Video Cable Kit - 4m `}</p>
      </div>
      <Bylines4 />
    </div>
  );
}

function TextContainer5() {
  return (
    <div className="content-stretch flex gap-[16px] h-[76px] items-center mr-[-16px] p-[16px] relative shrink-0 w-[438px]" data-name="Text Container">
      <TextByline4 />
      <div className="-webkit-box flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[0px] text-right w-[75px]">
        <p className="leading-[normal] text-[14px]">
          <span className="font-['72:Bold',sans-serif] not-italic">29.99</span>
          <span>{` EUR`}</span>
        </p>
      </div>
    </div>
  );
}

function TrailingIcon4() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Trailing Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Trailing Icon">
          <path d={svgPaths.p628ea00} fill="var(--fill-0, #758CA4)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function TrailingIconContainer4() {
  return (
    <div className="content-stretch flex h-full items-center justify-center mr-[-16px] px-[12px] py-[8px] relative shrink-0 w-[39px]" data-name="Trailing Icon Container">
      <TrailingIcon4 />
    </div>
  );
}

function TableCell4() {
  return (
    <div className="bg-white content-stretch flex items-center pl-0 pr-[16px] py-0 relative shrink-0 w-full z-[8]" data-name="Table Cell 2-03">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <TextContainer5 />
      <div className="flex flex-row items-center self-stretch">
        <TrailingIconContainer4 />
      </div>
    </div>
  );
}

function Bylines5() {
  return (
    <div className="content-stretch flex gap-[10px] items-end relative shrink-0 w-full" data-name="Bylines">
      <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#556b82] text-[14px] text-nowrap">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">HT-6100</p>
      </div>
    </div>
  );
}

function TextByline5() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[44px] items-center justify-between min-h-px min-w-px px-0 py-[2px] relative shrink-0" data-name="Text + Byline">
      <div className="flex flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap w-full">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">Beam Breaker B-1</p>
      </div>
      <Bylines5 />
    </div>
  );
}

function TextContainer6() {
  return (
    <div className="content-stretch flex gap-[16px] h-[76px] items-center mr-[-16px] p-[16px] relative shrink-0 w-[438px]" data-name="Text Container">
      <TextByline5 />
      <div className="-webkit-box flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[0px] text-right w-[75px]">
        <p className="leading-[normal] text-[14px]">
          <span className="font-['72:Bold',sans-serif] not-italic">469.00</span>
          <span>{` EUR`}</span>
        </p>
      </div>
    </div>
  );
}

function TrailingIcon5() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Trailing Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Trailing Icon">
          <path d={svgPaths.p628ea00} fill="var(--fill-0, #758CA4)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function TrailingIconContainer5() {
  return (
    <div className="content-stretch flex h-full items-center justify-center mr-[-16px] px-[12px] py-[8px] relative shrink-0 w-[39px]" data-name="Trailing Icon Container">
      <TrailingIcon5 />
    </div>
  );
}

function TableCell5() {
  return (
    <div className="bg-white content-stretch flex items-center pl-0 pr-[16px] py-0 relative shrink-0 w-full z-[7]" data-name="Table Cell 2-03">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <TextContainer6 />
      <div className="flex flex-row items-center self-stretch">
        <TrailingIconContainer5 />
      </div>
    </div>
  );
}

function Bylines6() {
  return (
    <div className="content-stretch flex gap-[10px] items-end relative shrink-0 w-full" data-name="Bylines">
      <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#556b82] text-[14px] text-nowrap">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">HT-6101</p>
      </div>
    </div>
  );
}

function TextByline6() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[44px] items-center justify-between min-h-px min-w-px px-0 py-[2px] relative shrink-0" data-name="Text + Byline">
      <div className="flex flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap w-full">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">Beam Breaker B-2</p>
      </div>
      <Bylines6 />
    </div>
  );
}

function TextContainer7() {
  return (
    <div className="content-stretch flex gap-[16px] h-[76px] items-center mr-[-16px] p-[16px] relative shrink-0 w-[438px]" data-name="Text Container">
      <TextByline6 />
      <div className="-webkit-box flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[0px] text-right w-[75px]">
        <p className="leading-[normal] text-[14px]">
          <span className="font-['72:Bold',sans-serif] not-italic">679.00</span>
          <span>{` EUR`}</span>
        </p>
      </div>
    </div>
  );
}

function TrailingIcon6() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Trailing Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Trailing Icon">
          <path d={svgPaths.p628ea00} fill="var(--fill-0, #758CA4)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function TrailingIconContainer6() {
  return (
    <div className="content-stretch flex h-full items-center justify-center mr-[-16px] px-[12px] py-[8px] relative shrink-0 w-[39px]" data-name="Trailing Icon Container">
      <TrailingIcon6 />
    </div>
  );
}

function TableCell6() {
  return (
    <div className="bg-white content-stretch flex items-center pl-0 pr-[16px] py-0 relative shrink-0 w-full z-[5]" data-name="Table Cell 2-03">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <TextContainer7 />
      <div className="flex flex-row items-center self-stretch">
        <TrailingIconContainer6 />
      </div>
    </div>
  );
}

function Bylines7() {
  return (
    <div className="content-stretch flex gap-[10px] items-end relative shrink-0 w-full" data-name="Bylines">
      <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#556b82] text-[14px] text-nowrap">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">HT-6102</p>
      </div>
    </div>
  );
}

function TextByline7() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[44px] items-center justify-between min-h-px min-w-px px-0 py-[2px] relative shrink-0" data-name="Text + Byline">
      <div className="flex flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap w-full">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">Beam Breaker B-3</p>
      </div>
      <Bylines7 />
    </div>
  );
}

function TextContainer8() {
  return (
    <div className="content-stretch flex gap-[16px] h-[76px] items-center mr-[-16px] p-[16px] relative shrink-0 w-[438px]" data-name="Text Container">
      <TextByline7 />
      <div className="-webkit-box flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[0px] text-right w-[75px]">
        <p className="leading-[normal] text-[14px]">
          <span className="font-['72:Bold',sans-serif] not-italic">889.00</span>
          <span>{` EUR`}</span>
        </p>
      </div>
    </div>
  );
}

function TrailingIcon7() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Trailing Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Trailing Icon">
          <path d={svgPaths.p628ea00} fill="var(--fill-0, #758CA4)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function TrailingIconContainer7() {
  return (
    <div className="content-stretch flex h-full items-center justify-center mr-[-16px] px-[12px] py-[8px] relative shrink-0 w-[39px]" data-name="Trailing Icon Container">
      <TrailingIcon7 />
    </div>
  );
}

function TableCell7() {
  return (
    <div className="bg-white content-stretch flex items-center pl-0 pr-[16px] py-0 relative shrink-0 w-full z-[4]" data-name="Table Cell 2-03">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <TextContainer8 />
      <div className="flex flex-row items-center self-stretch">
        <TrailingIconContainer7 />
      </div>
    </div>
  );
}

function Bylines8() {
  return (
    <div className="content-stretch flex gap-[10px] items-end relative shrink-0 w-full" data-name="Bylines">
      <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#556b82] text-[14px] text-nowrap">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">HT-1254</p>
      </div>
    </div>
  );
}

function TextByline8() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[44px] items-center justify-between min-h-px min-w-px px-0 py-[2px] relative shrink-0" data-name="Text + Byline">
      <div className="flex flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap w-full">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">Bending Screen 21HD</p>
      </div>
      <Bylines8 />
    </div>
  );
}

function TextContainer9() {
  return (
    <div className="content-stretch flex gap-[16px] h-[76px] items-center mr-[-3px] p-[16px] relative shrink-0 w-[438px]" data-name="Text Container">
      <TextByline8 />
      <div className="-webkit-box flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[0px] text-right w-[75px]">
        <p className="leading-[normal] text-[14px]">
          <span className="font-['72:Bold',sans-serif] not-italic">250.00</span>
          <span>{` EUR`}</span>
        </p>
      </div>
    </div>
  );
}

function TrailingIcon8() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Trailing Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Trailing Icon">
          <path d={svgPaths.p628ea00} fill="var(--fill-0, #758CA4)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function TrailingIconContainer8() {
  return (
    <div className="content-stretch flex h-full items-center justify-center mr-[-3px] px-[12px] py-[8px] relative shrink-0 w-[39px]" data-name="Trailing Icon Container">
      <TrailingIcon8 />
    </div>
  );
}

function NavigationIndicator() {
  return <div className="absolute bottom-0 right-0 top-0 w-[3px]" data-name="Navigation Indicator" />;
}

function TableCell8() {
  return (
    <div className="bg-white content-stretch flex items-center pl-0 pr-[3px] py-0 relative shrink-0 w-full z-[3]" data-name="Table Cell 2-03">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <TextContainer9 />
      <div className="flex flex-row items-center self-stretch">
        <TrailingIconContainer8 />
      </div>
      <NavigationIndicator />
    </div>
  );
}

function Bylines9() {
  return (
    <div className="content-stretch flex gap-[10px] items-end relative shrink-0 w-full" data-name="Bylines">
      <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#556b82] text-[14px] text-nowrap">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">HT-1091</p>
      </div>
    </div>
  );
}

function TextByline9() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[44px] items-center justify-between min-h-px min-w-px px-0 py-[2px] relative shrink-0" data-name="Text + Byline">
      <div className="flex flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap w-full">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">Blaster Extreme</p>
      </div>
      <Bylines9 />
    </div>
  );
}

function TextContainer10() {
  return (
    <div className="content-stretch flex gap-[16px] h-[76px] items-center mr-[-3px] p-[16px] relative shrink-0 w-[438px]" data-name="Text Container">
      <TextByline9 />
      <div className="-webkit-box flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[0px] text-right w-[75px]">
        <p className="leading-[normal] text-[14px]">
          <span className="font-['72:Bold',sans-serif] not-italic">26.00</span>
          <span>{` EUR`}</span>
        </p>
      </div>
    </div>
  );
}

function TrailingIcon9() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Trailing Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Trailing Icon">
          <path d={svgPaths.p628ea00} fill="var(--fill-0, #758CA4)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function TrailingIconContainer9() {
  return (
    <div className="content-stretch flex h-full items-center justify-center mr-[-3px] px-[12px] py-[8px] relative shrink-0 w-[39px]" data-name="Trailing Icon Container">
      <TrailingIcon9 />
    </div>
  );
}

function NavigationIndicator1() {
  return <div className="absolute bottom-0 right-0 top-0 w-[3px]" data-name="Navigation Indicator" />;
}

function TableCell9() {
  return (
    <div className="bg-white content-stretch flex items-center pl-0 pr-[3px] py-0 relative shrink-0 w-full z-[2]" data-name="Table Cell 2-03">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <TextContainer10 />
      <div className="flex flex-row items-center self-stretch">
        <TrailingIconContainer9 />
      </div>
      <NavigationIndicator1 />
    </div>
  );
}

function Bylines10() {
  return (
    <div className="content-stretch flex gap-[10px] items-end relative shrink-0 w-full" data-name="Bylines">
      <div className="basis-0 flex flex-col font-['72:Regular',sans-serif] grow justify-center leading-[0] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#556b82] text-[14px] text-nowrap">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">HT-1255</p>
      </div>
    </div>
  );
}

function TextByline10() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-[44px] items-center justify-between min-h-px min-w-px px-0 py-[2px] relative shrink-0" data-name="Text + Byline">
      <div className="flex flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap w-full">
        <p className="leading-[normal] overflow-ellipsis overflow-hidden">Broad Screen 22HD</p>
      </div>
      <Bylines10 />
    </div>
  );
}

function TextContainer11() {
  return (
    <div className="content-stretch flex gap-[16px] h-[76px] items-center mr-[-3px] p-[16px] relative shrink-0 w-[452px]" data-name="Text Container">
      <TextByline10 />
      <div className="-webkit-box flex-col font-['72:Regular',sans-serif] justify-center leading-[0] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[0px] text-right w-[75px]">
        <p className="leading-[normal] text-[14px]">
          <span className="font-['72:Bold',sans-serif] not-italic">270.00</span>
          <span>{` EUR`}</span>
        </p>
      </div>
    </div>
  );
}

function TrailingIcon10() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Trailing Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Trailing Icon">
          <path d={svgPaths.p628ea00} fill="var(--fill-0, #758CA4)" id="Icon" />
        </g>
      </svg>
    </div>
  );
}

function TrailingIconContainer10() {
  return (
    <div className="content-stretch flex h-full items-center justify-center mr-[-3px] px-[12px] py-[8px] relative shrink-0 w-[39px]" data-name="Trailing Icon Container">
      <TrailingIcon10 />
    </div>
  );
}

function NavigationIndicator2() {
  return <div className="absolute bottom-0 right-0 top-0 w-[3px]" data-name="Navigation Indicator" />;
}

function TableCell10() {
  return (
    <div className="bg-white content-stretch flex items-center pl-0 pr-[3px] py-0 relative shrink-0 w-full z-[1]" data-name="Table Cell 2-03">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <TextContainer11 />
      <div className="flex flex-row items-center self-stretch">
        <TrailingIconContainer10 />
      </div>
      <NavigationIndicator2 />
    </div>
  );
}

function List() {
  return (
    <div className="content-stretch flex flex-col isolate items-start relative shrink-0 w-full" data-name="List">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCell3 />
      <TableCell4 />
      <TableCell5 />
      <TableCell6 />
      <TableCell7 />
      <TableCell8 />
      <TableCell9 />
      <TableCell10 />
    </div>
  );
}

function Table() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Table">
      <ColumnsTitles />
      <List />
    </div>
  );
}

function ListContent() {
  return (
    <div className="content-stretch flex flex-col h-full items-start relative shrink-0 w-[464px]" data-name="List Content">
      <Header />
      <Table />
    </div>
  );
}

function Column() {
  return (
    <div className="bg-[#f5f6f7] h-full relative shrink-0 w-[476px]" data-name="Column 01">
      <div className="content-stretch flex items-start overflow-clip relative rounded-[inherit] size-full">
        <ListContent />
      </div>
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

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

function IconButton1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[6px] items-center justify-center px-[8px] py-[5px] relative rounded-[8px]" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <VerticalGrip />
    </div>
  );
}

function BaseFlexibleColumnArrow() {
  return (
    <div className="h-full overflow-clip relative w-[16px]" data-name=".base/Flexible Column Arrow">
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
          <IconButton1 />
        </div>
      </div>
    </div>
  );
}

function Title3() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0 w-full" data-name="Title">
      <p className="font-['72:Black',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1d2d3e] text-[20px] text-nowrap">Robot Arm Series 9</p>
    </div>
  );
}

function TitleSubtitle() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0" data-name="Title & Subtitle">
      <Title3 />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#0070f2] content-stretch flex gap-[8px] items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#0070f2] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['72:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-shadow-[0px_0px_0px_rgba(0,0,0,0)] text-white">Edit</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-white content-stretch flex gap-[6px] items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#bcc3ca] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['72:Semibold_Duplex',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] text-nowrap">Delete</p>
    </div>
  );
}

function ToolbarItems1() {
  return (
    <div className="bg-[#d9d9d9] h-[26px] max-w-px min-h-[26px] relative shrink-0 w-px" data-name="Toolbar Items">
      <div className="max-w-[inherit] min-h-[inherit] size-full" />
    </div>
  );
}

function FullScreen() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="full-screen">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_45078)" id="Icon">
          <path d={svgPaths.p20052540} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
        <defs>
          <clipPath id="clip0_1_45078">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <FullScreen />
    </div>
  );
}

function Decline() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="decline">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p13e2700} fill="var(--fill-0, #0064D9)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function IconButton3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Decline />
    </div>
  );
}

function Buttons() {
  return (
    <div className="content-stretch flex gap-[8px] items-start justify-end pl-[8px] pr-0 py-0 relative shrink-0 w-[705px]" data-name="Buttons">
      <Button />
      <Button1 />
      <ToolbarItems1 />
      <IconButton2 />
      <IconButton3 />
    </div>
  );
}

function ObjectHeaderTitle() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-[8px] w-[884px]" data-name="Object Header Title">
      <TitleSubtitle />
      <Buttons />
    </div>
  );
}

function Title4() {
  return (
    <div className="h-[55px] relative shrink-0 w-full" data-name="Title">
      <ObjectHeaderTitle />
    </div>
  );
}

function Avatar1() {
  return (
    <div className="content-stretch flex gap-[10px] items-start max-h-[80px] max-w-[80px] relative rounded-[12px] shrink-0" data-name="Avatar">
      <img alt="" className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-[12px] size-full" src={imgAvatar1} />
    </div>
  );
}

function LabelTextPair() {
  return (
    <div className="content-stretch flex font-['72:Regular',sans-serif] gap-[8px] items-start leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap" data-name="Label-Text Pair 01">
      <p className="relative shrink-0 text-[#556b82]">Manufacturer:</p>
      <p className="relative shrink-0 text-[#131e29]">Robotech</p>
    </div>
  );
}

function LabelTextPair1() {
  return (
    <div className="content-stretch flex font-['72:Regular',sans-serif] gap-[8px] items-start leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap" data-name="Label-Text Pair 02">
      <p className="relative shrink-0 text-[#556b82]">Factory:</p>
      <p className="relative shrink-0 text-[#131e29]">Orlando, FL</p>
    </div>
  );
}

function Link() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] text-nowrap">Robotech (234242343)</p>
    </div>
  );
}

function LabelTextPair2() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Label-Text Pair 03">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#556b82] text-[14px] text-nowrap">Supplier:</p>
      <Link />
    </div>
  );
}

function Facet() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start pb-[16px] pt-0 px-0 relative shrink-0" data-name="Facet">
      <LabelTextPair />
      <LabelTextPair1 />
      <LabelTextPair2 />
    </div>
  );
}

function ObjectNumber() {
  return (
    <div className="content-stretch flex items-start relative shadow-[0px_0px_2px_0px_white,0px_0px_0px_0px_rgba(255,255,255,0),0px_0px_0px_0px_rgba(255,255,255,0),0px_0px_0px_0px_rgba(255,255,255,0)] shrink-0" data-name="Object Number">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1d2d3e] text-[24px] text-nowrap">449.99 EUR</p>
    </div>
  );
}

function Facet1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0" data-name="Facet">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[16px] text-nowrap">Amount</p>
      <ObjectNumber />
    </div>
  );
}

function Facets() {
  return (
    <div className="content-start flex flex-wrap gap-[16px_32px] items-start px-0 py-[16px] relative shrink-0 w-full" data-name="Facets">
      <Avatar1 />
      <Facet />
      <Facet1 />
    </div>
  );
}

function ObjectPageHeaderContent() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Object Page Header Content">
      <Title4 />
      <Facets />
    </div>
  );
}

function Container() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex flex-col items-start px-[32px] py-0 relative w-full">
        <ObjectPageHeaderContent />
      </div>
    </div>
  );
}

function Padding() {
  return (
    <div className="content-stretch flex gap-[4px] h-[44px] items-center justify-center mb-[-3px] px-[3px] py-0 relative shrink-0" data-name="Padding">
      <div className="flex flex-col font-['72:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#0064d9] text-[14px] text-center text-nowrap">
        <p className="leading-[normal]">General Information</p>
      </div>
    </div>
  );
}

function FirstTab() {
  return (
    <div className="content-stretch flex flex-col items-center justify-end pb-[3px] pt-0 px-0 relative shrink-0 z-10" data-name="First Tab">
      <Padding />
      <div className="bg-[#0064d9] h-[3px] mb-[-3px] rounded-tl-[2px] rounded-tr-[2px] shrink-0 w-full" data-name="Selection Bar" />
    </div>
  );
}

function Padding1() {
  return (
    <div className="content-stretch flex gap-[4px] h-[44px] items-center justify-center mb-[-3px] px-[3px] py-0 relative shrink-0" data-name="Padding">
      <div className="flex flex-col font-['72:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#131e29] text-[14px] text-center text-nowrap">
        <p className="leading-[normal]">Suppliers</p>
      </div>
    </div>
  );
}

function SecondTab() {
  return (
    <div className="content-stretch flex flex-col items-center justify-end pb-[3px] pt-0 px-0 relative shrink-0 z-[9]" data-name="Second Tab">
      <Padding1 />
    </div>
  );
}

function IconTabBar() {
  return (
    <div className="max-w-[1439px] min-w-[600px] relative shrink-0 w-full" data-name="Icon Tab Bar">
      <div className="flex flex-row items-center max-w-[inherit] min-w-[inherit] size-full">
        <div className="content-stretch flex gap-[32px] isolate items-center max-w-[inherit] min-w-[inherit] px-[32px] py-0 relative w-full">
          <FirstTab />
          <SecondTab />
          <div className="absolute bg-white inset-0 shadow-[0px_2px_2px_0px_rgba(34,53,72,0.05)] z-[1]" data-name="Inner Shadow">
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_-1px_0px_0px_#d9d9d9]" />
          </div>
        </div>
      </div>
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
      <div className="absolute h-px left-[32.65%] right-[32.65%] top-0" data-name="Rectangle">
        <div aria-hidden="true" className="absolute border-0 border-[#d9d9d9] border-dashed inset-0 pointer-events-none" />
      </div>
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

function Icon7() {
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

function IconButton4() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[#bcc3ca] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon7 />
    </div>
  );
}

function Icon8() {
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

function IconButton5() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[#bcc3ca] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Icon8 />
    </div>
  );
}

function Buttons1() {
  return (
    <div className="absolute content-stretch flex gap-[8px] items-start left-1/2 top-0 translate-x-[-50%]" data-name="Buttons">
      <IconButton4 />
      <IconButton5 />
    </div>
  );
}

function BaseHeaderIndication() {
  return (
    <div className="absolute bottom-[32px] h-[24px] left-1/2 translate-x-[-50%] w-[196px]" data-name=".base/Header Indication">
      <BaseHeaderIndicationLine />
      <Buttons1 />
    </div>
  );
}

function ObjectPageHeader() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Object Page Header">
      <Container />
      <IconTabBar />
      <BaseHeaderIndication />
    </div>
  );
}

function BaseSectionTitle() {
  return (
    <div className="content-stretch flex flex-col h-[44px] items-start justify-center relative shrink-0 w-full" data-name=".base/Section Title">
      <div className="flex flex-col font-['72:Bold',sans-serif] h-[32px] justify-center leading-[0] not-italic relative shrink-0 text-[#1d2d3e] text-[20px] w-full">
        <p className="leading-[normal]">General Information</p>
      </div>
    </div>
  );
}

function Label() {
  return (
    <div className="content-stretch flex gap-[2px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#556b82] text-[14px] text-nowrap">Product ID:</p>
    </div>
  );
}

function TextContainer12() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Text Container">
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-2001</p>
    </div>
  );
}

function LabelText() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[288px]" data-name="Label & Text">
      <Label />
      <TextContainer12 />
    </div>
  );
}

function FormItem() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Form Item 01">
      <LabelText />
    </div>
  );
}

function Label1() {
  return (
    <div className="content-stretch flex gap-[2px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#556b82] text-[14px] text-nowrap">Description:</p>
    </div>
  );
}

function TextContainer13() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Text Container">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[14px] text-nowrap">10” LCD Screen, storage battery holds up to 8 hours</p>
    </div>
  );
}

function LabelText1() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[288px]" data-name="Label & Text">
      <Label1 />
      <TextContainer13 />
    </div>
  );
}

function FormItem1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Form Item 02">
      <LabelText1 />
    </div>
  );
}

function Label2() {
  return (
    <div className="content-stretch flex gap-[2px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#556b82] text-[14px] text-nowrap">Supplier:</p>
    </div>
  );
}

function TextContainer14() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full" data-name="Text Container">
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Titanium</p>
    </div>
  );
}

function LabelText2() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-[288px]" data-name="Label & Text">
      <Label2 />
      <TextContainer14 />
    </div>
  );
}

function FormItem2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0" data-name="Form Item 03">
      <LabelText2 />
    </div>
  );
}

function FormGroup() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full" data-name="Form Group">
      <FormItem />
      <FormItem1 />
      <FormItem2 />
    </div>
  );
}

function FormGroup1() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Form Group 01">
      <FormGroup />
    </div>
  );
}

function Form() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="Form">
      <div className="content-stretch flex gap-[16px] items-start p-[16px] relative w-full">
        <FormGroup1 />
      </div>
    </div>
  );
}

function GeneralInfo() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="General Info">
      <BaseSectionTitle />
      <Form />
    </div>
  );
}

function LeftArea1() {
  return (
    <div className="basis-0 grow h-[38px] min-h-px min-w-px relative shrink-0" data-name="Left Area">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pl-[8px] pr-0 py-0 relative size-full">
          <div className="flex flex-col font-['72:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1d2d3e] text-[0px] text-nowrap">
            <p className="leading-[normal] text-[20px]">Suppliers</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TextContainer15() {
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

function Icon9() {
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

function TrailingAction1() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center overflow-clip px-[8px] py-[5px] relative rounded-[4px] shrink-0" data-name="Trailing Action">
      <Icon9 />
    </div>
  );
}

function ButtonContainer1() {
  return (
    <div className="content-stretch flex items-start justify-center mr-[-8px] relative shrink-0" data-name="Button Container">
      <TrailingAction1 />
    </div>
  );
}

function InputField1() {
  return (
    <div className="basis-0 bg-white content-stretch flex grow items-center max-h-[26px] min-h-[26px] min-w-[32px] overflow-clip pl-0 pr-[8px] py-0 relative rounded-[4px] shrink-0" data-name="Input Field">
      <TextContainer15 />
      <ButtonContainer1 />
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

function Input1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center max-h-[26px] min-h-[26px] min-w-[32px] relative rounded-[4px] shrink-0 w-[280px]" data-name="Input">
      <InputField1 />
    </div>
  );
}

function Toolbar() {
  return (
    <div className="content-stretch flex gap-[8px] h-[44px] items-center justify-end relative shrink-0 w-full" data-name="Toolbar">
      <LeftArea1 />
      <Input1 />
    </div>
  );
}

function Row5InteractionState() {
  return (
    <div className="absolute bg-white inset-0 min-h-[32px]" data-name="Row 5 Interaction State">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ObjectIdentifier() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start justify-center min-h-px min-w-px relative shrink-0" data-name="Object Identifier">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[14px] w-full">Premier Display Solutions</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="basis-0 bg-white grow min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 5-03">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative w-full">
          <ObjectIdentifier />
        </div>
      </div>
    </div>
  );
}

function Icon10() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p217a9e00} fill="var(--fill-0, #758CA4)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative self-stretch shrink-0" data-name="Table Cell 5-12">
      <Icon10 />
    </div>
  );
}

function Row() {
  return (
    <div className="content-stretch flex items-start min-h-[32px] relative shrink-0 w-full" data-name="Row">
      <TableCell11 />
      <TableCell16 />
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
    <div className="bg-white relative shrink-0 w-full" data-name="Row">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[8px] items-start px-[8px] py-[4px] relative w-full">
        <Row5InteractionState />
        <Content />
      </div>
    </div>
  );
}

function Row5InteractionState1() {
  return (
    <div className="absolute bg-white inset-0 min-h-[32px]" data-name="Row 5 Interaction State">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ObjectIdentifier1() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start justify-center min-h-px min-w-px relative shrink-0" data-name="Object Identifier">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[14px] w-full">Tech Sphere</p>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="basis-0 bg-white grow min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 5-03">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative w-full">
          <ObjectIdentifier1 />
        </div>
      </div>
    </div>
  );
}

function Icon11() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p217a9e00} fill="var(--fill-0, #758CA4)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative self-stretch shrink-0" data-name="Table Cell 5-12">
      <Icon11 />
    </div>
  );
}

function Row2() {
  return (
    <div className="content-stretch flex items-start min-h-[32px] relative shrink-0 w-full" data-name="Row">
      <TableCell12 />
      <TableCell17 />
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
    <div className="bg-white relative shrink-0 w-full" data-name="Row">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[8px] items-start px-[8px] py-[4px] relative w-full">
        <Row5InteractionState1 />
        <Content1 />
      </div>
    </div>
  );
}

function Row5InteractionState2() {
  return (
    <div className="absolute bg-white inset-0 min-h-[32px]" data-name="Row 5 Interaction State">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ObjectIdentifier2() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start justify-center min-h-px min-w-px relative shrink-0" data-name="Object Identifier">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[14px] w-full">Elite Screen Innovations</p>
    </div>
  );
}

function TableCell13() {
  return (
    <div className="basis-0 bg-white grow min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 5-03">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative w-full">
          <ObjectIdentifier2 />
        </div>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p217a9e00} fill="var(--fill-0, #758CA4)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative self-stretch shrink-0" data-name="Table Cell 5-12">
      <Icon12 />
    </div>
  );
}

function Row4() {
  return (
    <div className="content-stretch flex items-start min-h-[32px] relative shrink-0 w-full" data-name="Row">
      <TableCell13 />
      <TableCell18 />
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
    <div className="bg-white relative shrink-0 w-full" data-name="Row">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[8px] items-start px-[8px] py-[4px] relative w-full">
        <Row5InteractionState2 />
        <Content2 />
      </div>
    </div>
  );
}

function Row5InteractionState3() {
  return (
    <div className="absolute bg-white inset-0 min-h-[32px]" data-name="Row 5 Interaction State">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ObjectIdentifier3() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start justify-center min-h-px min-w-px relative shrink-0" data-name="Object Identifier">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[14px] w-full">Supreme Screen Co.</p>
    </div>
  );
}

function TableCell14() {
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

function Icon13() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p217a9e00} fill="var(--fill-0, #758CA4)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative self-stretch shrink-0" data-name="Table Cell 5-12">
      <Icon13 />
    </div>
  );
}

function Row6() {
  return (
    <div className="content-stretch flex items-start min-h-[32px] relative shrink-0 w-full" data-name="Row">
      <TableCell14 />
      <TableCell19 />
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
    <div className="bg-white relative shrink-0 w-full" data-name="Row">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[8px] items-start px-[8px] py-[4px] relative w-full">
        <Row5InteractionState3 />
        <Content3 />
      </div>
    </div>
  );
}

function Row5InteractionState4() {
  return (
    <div className="absolute bg-white inset-0 min-h-[32px]" data-name="Row 5 Interaction State">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ObjectIdentifier4() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start justify-center min-h-px min-w-px relative shrink-0" data-name="Object Identifier">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[14px] w-full">Ultimate Display Systems</p>
    </div>
  );
}

function TableCell15() {
  return (
    <div className="basis-0 bg-white grow min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 5-03">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative w-full">
          <ObjectIdentifier4 />
        </div>
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p217a9e00} fill="var(--fill-0, #758CA4)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function TableCell20() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative self-stretch shrink-0" data-name="Table Cell 5-12">
      <Icon14 />
    </div>
  );
}

function Row8() {
  return (
    <div className="content-stretch flex items-start min-h-[32px] relative shrink-0 w-full" data-name="Row">
      <TableCell15 />
      <TableCell20 />
    </div>
  );
}

function Content4() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Content">
      <Row8 />
    </div>
  );
}

function Row9() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Row">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[8px] items-start px-[8px] py-[4px] relative w-full">
        <Row5InteractionState4 />
        <Content4 />
      </div>
    </div>
  );
}

function Row5InteractionState5() {
  return (
    <div className="absolute bg-white inset-0 min-h-[32px]" data-name="Row 5 Interaction State">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function ObjectIdentifier5() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start justify-center min-h-px min-w-px relative shrink-0" data-name="Object Identifier">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[14px] w-full">Optimum Screen Technologies</p>
    </div>
  );
}

function TableCell21() {
  return (
    <div className="basis-0 bg-white grow min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 5-03">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative w-full">
          <ObjectIdentifier5 />
        </div>
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p217a9e00} fill="var(--fill-0, #758CA4)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative self-stretch shrink-0" data-name="Table Cell 5-12">
      <Icon15 />
    </div>
  );
}

function Row10() {
  return (
    <div className="content-stretch flex items-start min-h-[32px] relative shrink-0 w-full" data-name="Row">
      <TableCell21 />
      <TableCell22 />
    </div>
  );
}

function Content5() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Content">
      <Row10 />
    </div>
  );
}

function Row11() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Row">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[8px] items-start px-[8px] py-[4px] relative w-full">
        <Row5InteractionState5 />
        <Content5 />
      </div>
    </div>
  );
}

function Row5InteractionState6() {
  return <div className="absolute bg-white inset-0 min-h-[32px]" data-name="Row 5 Interaction State" />;
}

function ObjectIdentifier6() {
  return (
    <div className="basis-0 content-stretch flex flex-col gap-[8px] grow items-start justify-center min-h-px min-w-px relative shrink-0" data-name="Object Identifier">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#131e29] text-[14px] w-full">Best Choice Displays</p>
    </div>
  );
}

function TableCell23() {
  return (
    <div className="basis-0 bg-white grow min-h-[32px] min-w-px relative shrink-0" data-name="Table Cell 5-03">
      <div className="flex flex-row items-center min-h-[inherit] size-full">
        <div className="content-stretch flex items-center min-h-[inherit] px-[8px] py-[4px] relative w-full">
          <ObjectIdentifier6 />
        </div>
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d={svgPaths.p217a9e00} fill="var(--fill-0, #758CA4)" id="Icon_2" />
        </g>
      </svg>
    </div>
  );
}

function TableCell24() {
  return (
    <div className="content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative self-stretch shrink-0" data-name="Table Cell 5-12">
      <Icon16 />
    </div>
  );
}

function Row12() {
  return (
    <div className="content-stretch flex items-start min-h-[32px] relative shrink-0 w-full" data-name="Row">
      <TableCell23 />
      <TableCell24 />
    </div>
  );
}

function Content6() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Content">
      <Row12 />
    </div>
  );
}

function Row13() {
  return (
    <div className="bg-white relative shrink-0 w-full" data-name="Row">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex gap-[8px] items-start px-[8px] py-[4px] relative w-full">
        <Row5InteractionState6 />
        <Content6 />
      </div>
    </div>
  );
}

function Rows() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full" data-name="Rows">
      <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
        <Row1 />
        <Row3 />
        <Row5 />
        <Row7 />
        <Row9 />
        <Row11 />
        <Row13 />
      </div>
    </div>
  );
}

function AssemblyOptions() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Assembly Options">
      <Toolbar />
      <Rows />
    </div>
  );
}

function ProductParts() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Product Parts">
      <AssemblyOptions />
    </div>
  );
}

function Body() {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full" data-name="Body">
      <div className="content-stretch flex flex-col gap-[24px] items-start px-[32px] py-[16px] relative size-full">
        <GeneralInfo />
        <ProductParts />
      </div>
    </div>
  );
}

function ContentContainer() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-full items-start min-h-px min-w-px relative shrink-0" data-name="Content Container">
      <ObjectPageHeader />
      <Body />
    </div>
  );
}

function ScrollArea() {
  return (
    <div className="basis-0 content-stretch flex grow items-start min-h-px min-w-px relative shrink-0 w-full" data-name="Scroll Area">
      <ContentContainer />
    </div>
  );
}

function ObjectPage() {
  return (
    <div className="basis-0 bg-[#f5f6f7] content-stretch flex flex-col grow items-end max-w-[1440px] min-h-px min-w-[834px] overflow-clip relative shrink-0 w-full" data-name="Object Page">
      <ScrollArea />
    </div>
  );
}

function ContentContainer1() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow h-full items-start min-h-px min-w-px relative shrink-0" data-name="Content Container">
      <ObjectPage />
    </div>
  );
}

function Column1() {
  return (
    <div className="basis-0 content-stretch flex grow h-full items-start min-h-px min-w-px relative shrink-0" data-name="Column 02">
      <div aria-hidden="true" className="absolute border-[#d9d9d9] border-[0px_0px_0px_1px] border-solid inset-[0_0_0_-1px] pointer-events-none" />
      <ContentContainer1 />
    </div>
  );
}

function Scrollbar() {
  return (
    <div className="absolute bg-white content-stretch flex h-[895px] items-start justify-center left-[463px] pb-[50px] pt-[2px] px-0 top-0 w-[12px]" data-name="Scrollbar">
      <div className="bg-[#7b91a8] h-full relative rounded-[12px] shrink-0 w-[12px]" data-name="Scroll Face">
        <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[12px]" />
      </div>
    </div>
  );
}

function Content7() {
  return (
    <div className="basis-0 content-stretch flex grow items-start min-h-px min-w-px relative shrink-0 w-full" data-name="Content">
      <Column />
      <div className="flex h-full items-center justify-center relative shrink-0">
        <div className="flex-none h-full rotate-[180deg]">
          <BaseFlexibleColumnArrow />
        </div>
      </div>
      <Column1 />
      <Scrollbar />
    </div>
  );
}

export default function FlexibleColumnLayout() {
  return (
    <div className="bg-[#f5f6f7] content-stretch flex flex-col items-start relative size-full" data-name="Flexible Column Layout">
      <ShellBar />
      <Content7 />
    </div>
  );
}
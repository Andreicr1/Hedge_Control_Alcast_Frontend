import svgPaths from "./svg-adzoi2dpwy";

function CheckboxAndTitle() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-[273.701px]" data-name="Checkbox and Title">
      <p className="font-['72:Bold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#1d2d3e] text-[16px] text-nowrap">Products</p>
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

function Icon() {
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
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex h-[26px] items-start justify-end overflow-clip px-[8px] py-[5px] relative rounded-[4px] shrink-0 w-[32px]" data-name="Trailing Action">
      <Icon />
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

function Input() {
  return (
    <div className="absolute bg-white content-stretch flex items-center left-0 max-h-[26px] min-h-[26px] overflow-clip pl-0 pr-[8px] py-0 right-0 rounded-[4px] top-0" data-name="Input">
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

function InputField() {
  return (
    <div className="h-[26px] relative rounded-[5px] shrink-0 w-[280px]" data-name="Input Field">
      <Input />
    </div>
  );
}

function Button() {
  return (
    <div className="bg-white content-stretch flex gap-[6px] items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[#bcc3ca] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['72:Semibold_Duplex',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] text-nowrap">Create</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Button">
      <Button />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[6px] items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['72:Semibold_Duplex',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] text-nowrap">Edit</p>
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
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[6px] items-center justify-center min-h-[26px] opacity-40 px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['72:Semibold_Duplex',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] text-nowrap">Delete</p>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[52.866px]" data-name="Button">
      <Button4 />
    </div>
  );
}

function Button6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[6px] items-center justify-center min-h-[26px] opacity-40 px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['72:Semibold_Duplex',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] text-nowrap">Copy</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[52.866px]" data-name="Button">
      <Button6 />
    </div>
  );
}

function Button8() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex gap-[6px] items-center justify-center min-h-[26px] opacity-40 px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <p className="font-['72:Semibold_Duplex',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] text-nowrap">Paste</p>
    </div>
  );
}

function Button9() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-[52.866px]" data-name="Button">
      <Button8 />
    </div>
  );
}

function BusinessActions() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0" data-name="Business Actions">
      <Button1 />
      <Button3 />
      <Button5 />
      <Button7 />
      <Button9 />
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

function IconButton() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ActionSettings />
    </div>
  );
}

function IconButton1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
      <IconButton />
    </div>
  );
}

function ViewSettingsActions() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0" data-name="View Settings Actions">
      <div className="bg-[#d9d9d9] h-[24px] shrink-0 w-px" data-name="Separator" />
      <IconButton1 />
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

function IconButton2() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ExcelAttachment />
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

function IconButton3() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <SlimArrowDown />
    </div>
  );
}

function IconSplitButton() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] relative rounded-[8px] shrink-0" data-name="Icon Split Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <IconButton2 />
      <div className="h-[16px] relative shrink-0 w-0" data-name="Separator">
        <div className="absolute inset-[-3.13%_-0.5px]" style={{ "--stroke-0": "rgba(0, 100, 217, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1 17">
            <path d="M0.5 16.5V0.5" id="Separator" stroke="var(--stroke-0, #0064D9)" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      <IconButton3 />
    </div>
  );
}

function IconSplitButton1() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Icon Split Button">
      <IconSplitButton />
    </div>
  );
}

function Print() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="print">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0_1_13652)" id="print">
          <path d={svgPaths.p2592ad00} fill="var(--fill-0, #0064D9)" id="Icon" />
        </g>
        <defs>
          <clipPath id="clip0_1_13652">
            <rect fill="white" height="16" width="16" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function IconButton4() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <Print />
    </div>
  );
}

function IconButton5() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
      <IconButton4 />
    </div>
  );
}

function FullScreen() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="full-screen">
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

function IconButton6() {
  return (
    <div className="bg-[rgba(0,0,0,0)] content-stretch flex items-center justify-center min-h-[26px] px-[8px] py-[5px] relative rounded-[8px] shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <FullScreen />
    </div>
  );
}

function IconButton7() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Icon Button">
      <div aria-hidden="true" className="absolute border border-[rgba(0,0,0,0)] border-solid inset-0 pointer-events-none" />
      <IconButton6 />
    </div>
  );
}

function GenericActions() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-end relative shrink-0" data-name="Generic Actions">
      <div className="bg-[#d9d9d9] h-[24px] shrink-0 w-px" data-name="Separator" />
      <IconSplitButton1 />
      <IconButton5 />
      <div className="bg-[#d9d9d9] h-[24px] shrink-0 w-px" data-name="Separator" />
      <IconButton7 />
    </div>
  );
}

function Actions() {
  return (
    <div className="content-stretch flex gap-[8px] h-[44px] items-center justify-end relative shrink-0" data-name="Actions">
      <InputField />
      <BusinessActions />
      <ViewSettingsActions />
      <GenericActions />
    </div>
  );
}

function TableToolbar() {
  return (
    <div className="bg-white relative rounded-tl-[12px] rounded-tr-[12px] shrink-0 w-full" data-name="Table Toolbar">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[0px_0px_1px] border-solid inset-0 pointer-events-none rounded-tl-[12px] rounded-tr-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[8px] py-0 relative w-full">
          <CheckboxAndTitle />
          <Actions />
        </div>
      </div>
    </div>
  );
}

function Spacer() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell() {
  return (
    <div className="bg-white content-stretch flex items-center max-h-[32px] min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">Product Name</p>
    </div>
  );
}

function TableCell101() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 002">
      <TableCell />
    </div>
  );
}

function TableCell1() {
  return (
    <div className="bg-white content-stretch flex items-center max-h-[32px] min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">Product Id</p>
    </div>
  );
}

function TableCell102() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 003">
      <TableCell1 />
    </div>
  );
}

function TableCell2() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end max-h-[32px] min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap text-right">Quantity</p>
    </div>
  );
}

function TableCell103() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 004">
      <TableCell2 />
    </div>
  );
}

function TableCell3() {
  return (
    <div className="bg-white content-stretch flex items-center max-h-[32px] min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">Status</p>
    </div>
  );
}

function TableCell104() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 005">
      <TableCell3 />
    </div>
  );
}

function TableCell4() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end max-h-[32px] min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap text-right">Price</p>
    </div>
  );
}

function TableCell105() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 006">
      <TableCell4 />
    </div>
  );
}

function TableCell5() {
  return (
    <div className="bg-white content-stretch flex items-center max-h-[32px] min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">Supplier</p>
    </div>
  );
}

function TableCell106() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 007">
      <TableCell5 />
    </div>
  );
}

function TableCell6() {
  return (
    <div className="bg-white content-stretch flex items-center max-h-[32px] min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">Image</p>
    </div>
  );
}

function TableCell107() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 008">
      <TableCell6 />
    </div>
  );
}

function TableCell7() {
  return (
    <div className="bg-white content-stretch flex items-center max-h-[32px] min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">Details</p>
    </div>
  );
}

function TableCell108() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 009">
      <TableCell7 />
    </div>
  );
}

function TableCell8() {
  return (
    <div className="bg-white content-stretch flex items-center max-h-[32px] min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">Main Category</p>
    </div>
  );
}

function TableCell109() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 010">
      <TableCell8 />
    </div>
  );
}

function TableCell9() {
  return (
    <div className="bg-white content-stretch flex items-center max-h-[32px] min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Semibold_Duplex',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#131e29] text-[14px] text-nowrap">Delivery Date</p>
    </div>
  );
}

function TableCell110() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 011">
      <TableCell9 />
    </div>
  );
}

function TableCellContainer() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer />
      <TableCell101 />
      <TableCell102 />
      <TableCell103 />
      <TableCell104 />
      <TableCell105 />
      <TableCell106 />
      <TableCell107 />
      <TableCell108 />
      <TableCell109 />
      <TableCell110 />
    </div>
  );
}

function TableCell10() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function TableCell111() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 012">
      <TableCell10 />
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

function TableCell11() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-h-[32px] max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox />
    </div>
  );
}

function TableCell100() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 001">
      <TableCell11 />
    </div>
  );
}

function GridTableHeader() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Header">
      <TableCellContainer />
      <TableCell111 />
      <TableCell100 />
      <div className="absolute bottom-0 h-0 left-0 right-[12px]" data-name="Grid Table Header Border Bottom">
        <div className="absolute inset-[-1px_0_0_0]" style={{ "--stroke-0": "rgba(168, 179, 189, 1)" } as React.CSSProperties}>
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2016 1">
            <line id="Grid Table Header Border Bottom" stroke="var(--stroke-0, #A8B3BD)" x2="2016" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Spacer1() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell12() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Notebook Basic 15</p>
    </div>
  );
}

function TableCell113() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 014">
      <TableCell12 />
    </div>
  );
}

function TableCell13() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1000</p>
    </div>
  );
}

function TableCell114() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 015">
      <TableCell13 />
    </div>
  );
}

function TableCell14() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">10</p>
    </div>
  );
}

function TableCell115() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 016">
      <TableCell14 />
    </div>
  );
}

function TableCell15() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell116() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 017">
      <TableCell15 />
    </div>
  );
}

function TableCell16() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">956,00 €</p>
    </div>
  );
}

function TableCell117() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 018">
      <TableCell16 />
    </div>
  );
}

function TableCell17() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Very Best Screens</p>
    </div>
  );
}

function TableCell118() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 019">
      <TableCell17 />
    </div>
  );
}

function Link() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link />
    </div>
  );
}

function TableCell119() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 020">
      <TableCell18 />
    </div>
  );
}

function Link1() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link1 />
    </div>
  );
}

function TableCell120() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 021">
      <TableCell19 />
    </div>
  );
}

function TableCell20() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Laptops</p>
    </div>
  );
}

function TableCell121() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 022">
      <TableCell20 />
    </div>
  );
}

function TableCell21() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">02.04.2024</p>
    </div>
  );
}

function TableCell122() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 023">
      <TableCell21 />
    </div>
  );
}

function TableCellContainer1() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer1 />
      <TableCell113 />
      <TableCell114 />
      <TableCell115 />
      <TableCell116 />
      <TableCell117 />
      <TableCell118 />
      <TableCell119 />
      <TableCell120 />
      <TableCell121 />
      <TableCell122 />
    </div>
  );
}

function Checkbox1() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
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

function TableCell22() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox1 />
    </div>
  );
}

function TableCell112() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 013">
      <TableCell22 />
    </div>
  );
}

function Icon1() {
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

function TableCell23() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon1 />
    </div>
  );
}

function TableCell123() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 024">
      <TableCell23 />
    </div>
  );
}

function GridTableRow() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer1 />
      <TableCell112 />
      <TableCell123 />
    </div>
  );
}

function Spacer2() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell24() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Notebook Basic 17</p>
    </div>
  );
}

function TableCell125() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 026">
      <TableCell24 />
    </div>
  );
}

function TableCell25() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1001</p>
    </div>
  );
}

function TableCell126() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 027">
      <TableCell25 />
    </div>
  );
}

function TableCell26() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">20</p>
    </div>
  );
}

function TableCell127() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 028">
      <TableCell26 />
    </div>
  );
}

function TableCell27() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell128() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 029">
      <TableCell27 />
    </div>
  );
}

function TableCell28() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">1.149,00 €</p>
    </div>
  );
}

function TableCell129() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 030">
      <TableCell28 />
    </div>
  );
}

function TableCell29() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Very Best Screens</p>
    </div>
  );
}

function TableCell130() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 031">
      <TableCell29 />
    </div>
  );
}

function Link2() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell30() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link2 />
    </div>
  );
}

function TableCell131() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 032">
      <TableCell30 />
    </div>
  );
}

function Link3() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell31() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link3 />
    </div>
  );
}

function TableCell132() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 033">
      <TableCell31 />
    </div>
  );
}

function TableCell32() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Laptops</p>
    </div>
  );
}

function TableCell133() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 034">
      <TableCell32 />
    </div>
  );
}

function TableCell33() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">29.03.2024</p>
    </div>
  );
}

function TableCell134() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 035">
      <TableCell33 />
    </div>
  );
}

function TableCellContainer2() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer2 />
      <TableCell125 />
      <TableCell126 />
      <TableCell127 />
      <TableCell128 />
      <TableCell129 />
      <TableCell130 />
      <TableCell131 />
      <TableCell132 />
      <TableCell133 />
      <TableCell134 />
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

function TableCell34() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox2 />
    </div>
  );
}

function TableCell124() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 025">
      <TableCell34 />
    </div>
  );
}

function Icon2() {
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

function TableCell35() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon2 />
    </div>
  );
}

function TableCell135() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 036">
      <TableCell35 />
    </div>
  );
}

function GridTableRow1() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer2 />
      <TableCell124 />
      <TableCell135 />
    </div>
  );
}

function Spacer3() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell36() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Notebook Basic 18</p>
    </div>
  );
}

function TableCell137() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 038">
      <TableCell36 />
    </div>
  );
}

function TableCell37() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1002</p>
    </div>
  );
}

function TableCell138() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 039">
      <TableCell37 />
    </div>
  );
}

function TableCell38() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">10</p>
    </div>
  );
}

function TableCell139() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 040">
      <TableCell38 />
    </div>
  );
}

function TableCell39() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell140() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 041">
      <TableCell39 />
    </div>
  );
}

function TableCell40() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">1.560,00 €</p>
    </div>
  );
}

function TableCell141() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 042">
      <TableCell40 />
    </div>
  );
}

function TableCell41() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Very Best Screens</p>
    </div>
  );
}

function TableCell142() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 043">
      <TableCell41 />
    </div>
  );
}

function Link4() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell42() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link4 />
    </div>
  );
}

function TableCell143() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 044">
      <TableCell42 />
    </div>
  );
}

function Link5() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell43() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link5 />
    </div>
  );
}

function TableCell144() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 045">
      <TableCell43 />
    </div>
  );
}

function TableCell44() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Laptops</p>
    </div>
  );
}

function TableCell145() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 046">
      <TableCell44 />
    </div>
  );
}

function TableCell45() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">25.03.2024</p>
    </div>
  );
}

function TableCell146() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 047">
      <TableCell45 />
    </div>
  );
}

function TableCellContainer3() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer3 />
      <TableCell137 />
      <TableCell138 />
      <TableCell139 />
      <TableCell140 />
      <TableCell141 />
      <TableCell142 />
      <TableCell143 />
      <TableCell144 />
      <TableCell145 />
      <TableCell146 />
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

function TableCell46() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox3 />
    </div>
  );
}

function TableCell136() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 037">
      <TableCell46 />
    </div>
  );
}

function Icon3() {
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

function TableCell47() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon3 />
    </div>
  );
}

function TableCell147() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 048">
      <TableCell47 />
    </div>
  );
}

function GridTableRow2() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer3 />
      <TableCell136 />
      <TableCell147 />
    </div>
  );
}

function Spacer4() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell48() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Notebook Basic 19</p>
    </div>
  );
}

function TableCell149() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 050">
      <TableCell48 />
    </div>
  );
}

function TableCell49() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1003</p>
    </div>
  );
}

function TableCell150() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 051">
      <TableCell49 />
    </div>
  );
}

function TableCell50() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">15</p>
    </div>
  );
}

function TableCell151() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 052">
      <TableCell50 />
    </div>
  );
}

function TableCell51() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell152() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 053">
      <TableCell51 />
    </div>
  );
}

function TableCell52() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">299,00 €</p>
    </div>
  );
}

function TableCell153() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 054">
      <TableCell52 />
    </div>
  );
}

function TableCell53() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Very Best Screens</p>
    </div>
  );
}

function TableCell154() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 055">
      <TableCell53 />
    </div>
  );
}

function Link6() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell54() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link6 />
    </div>
  );
}

function TableCell155() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 056">
      <TableCell54 />
    </div>
  );
}

function Link7() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell55() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link7 />
    </div>
  );
}

function TableCell156() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 057">
      <TableCell55 />
    </div>
  );
}

function TableCell56() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Laptops</p>
    </div>
  );
}

function TableCell157() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 058">
      <TableCell56 />
    </div>
  );
}

function TableCell57() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">21.03.2024</p>
    </div>
  );
}

function TableCell158() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 059">
      <TableCell57 />
    </div>
  );
}

function TableCellContainer4() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer4 />
      <TableCell149 />
      <TableCell150 />
      <TableCell151 />
      <TableCell152 />
      <TableCell153 />
      <TableCell154 />
      <TableCell155 />
      <TableCell156 />
      <TableCell157 />
      <TableCell158 />
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

function TableCell58() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox4 />
    </div>
  );
}

function TableCell148() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 049">
      <TableCell58 />
    </div>
  );
}

function Icon4() {
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

function TableCell59() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon4 />
    </div>
  );
}

function TableCell159() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 060">
      <TableCell59 />
    </div>
  );
}

function GridTableRow3() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer4 />
      <TableCell148 />
      <TableCell159 />
    </div>
  );
}

function Spacer5() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell60() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">ITelO Vault</p>
    </div>
  );
}

function TableCell161() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 062">
      <TableCell60 />
    </div>
  );
}

function TableCell61() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1007</p>
    </div>
  );
}

function TableCell162() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 063">
      <TableCell61 />
    </div>
  );
}

function TableCell62() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">15</p>
    </div>
  );
}

function TableCell163() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 064">
      <TableCell62 />
    </div>
  );
}

function TableCell63() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell164() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 065">
      <TableCell63 />
    </div>
  );
}

function TableCell64() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">1.999,00 €</p>
    </div>
  );
}

function TableCell165() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 066">
      <TableCell64 />
    </div>
  );
}

function TableCell65() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Alpha Printers</p>
    </div>
  );
}

function TableCell166() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 067">
      <TableCell65 />
    </div>
  );
}

function Link8() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell66() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link8 />
    </div>
  );
}

function TableCell167() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 068">
      <TableCell66 />
    </div>
  );
}

function Link9() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell67() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link9 />
    </div>
  );
}

function TableCell168() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 069">
      <TableCell67 />
    </div>
  );
}

function TableCell68() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Accessories</p>
    </div>
  );
}

function TableCell169() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 070">
      <TableCell68 />
    </div>
  );
}

function TableCell69() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">17.03.2024</p>
    </div>
  );
}

function TableCell170() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 071">
      <TableCell69 />
    </div>
  );
}

function TableCellContainer5() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer5 />
      <TableCell161 />
      <TableCell162 />
      <TableCell163 />
      <TableCell164 />
      <TableCell165 />
      <TableCell166 />
      <TableCell167 />
      <TableCell168 />
      <TableCell169 />
      <TableCell170 />
    </div>
  );
}

function Checkbox5() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox5() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox5 />
    </div>
  );
}

function TableCell70() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox5 />
    </div>
  );
}

function TableCell160() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 061">
      <TableCell70 />
    </div>
  );
}

function Icon5() {
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

function TableCell71() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon5 />
    </div>
  );
}

function TableCell171() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 072">
      <TableCell71 />
    </div>
  );
}

function GridTableRow4() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer5 />
      <TableCell160 />
      <TableCell171 />
    </div>
  );
}

function Spacer6() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell72() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Notebook Professional 15</p>
    </div>
  );
}

function TableCell173() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 074">
      <TableCell72 />
    </div>
  );
}

function TableCell73() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1010</p>
    </div>
  );
}

function TableCell174() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 075">
      <TableCell73 />
    </div>
  );
}

function TableCell74() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">16</p>
    </div>
  );
}

function TableCell175() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 076">
      <TableCell74 />
    </div>
  );
}

function TableCell75() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell176() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 077">
      <TableCell75 />
    </div>
  );
}

function TableCell76() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">2.299,00 €</p>
    </div>
  );
}

function TableCell177() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 078">
      <TableCell76 />
    </div>
  );
}

function TableCell77() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Alpha Printers</p>
    </div>
  );
}

function TableCell178() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 079">
      <TableCell77 />
    </div>
  );
}

function Link10() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell78() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link10 />
    </div>
  );
}

function TableCell179() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 080">
      <TableCell78 />
    </div>
  );
}

function Link11() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell79() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link11 />
    </div>
  );
}

function TableCell180() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 081">
      <TableCell79 />
    </div>
  );
}

function TableCell80() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Accessories</p>
    </div>
  );
}

function TableCell181() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 082">
      <TableCell80 />
    </div>
  );
}

function TableCell81() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">18.04.2024</p>
    </div>
  );
}

function TableCell182() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 083">
      <TableCell81 />
    </div>
  );
}

function TableCellContainer6() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer6 />
      <TableCell173 />
      <TableCell174 />
      <TableCell175 />
      <TableCell176 />
      <TableCell177 />
      <TableCell178 />
      <TableCell179 />
      <TableCell180 />
      <TableCell181 />
      <TableCell182 />
    </div>
  );
}

function Checkbox6() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox6() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox6 />
    </div>
  );
}

function TableCell82() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox6 />
    </div>
  );
}

function TableCell172() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 073">
      <TableCell82 />
    </div>
  );
}

function Icon6() {
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

function TableCell83() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon6 />
    </div>
  );
}

function TableCell183() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 084">
      <TableCell83 />
    </div>
  );
}

function GridTableRow5() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer6 />
      <TableCell172 />
      <TableCell183 />
    </div>
  );
}

function Spacer7() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell84() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Notebook Professional 17</p>
    </div>
  );
}

function TableCell185() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 086">
      <TableCell84 />
    </div>
  );
}

function TableCell85() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1011</p>
    </div>
  );
}

function TableCell186() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 087">
      <TableCell85 />
    </div>
  );
}

function TableCell86() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">17</p>
    </div>
  );
}

function TableCell187() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 088">
      <TableCell86 />
    </div>
  );
}

function TableCell87() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell188() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 089">
      <TableCell87 />
    </div>
  );
}

function TableCell88() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">459,00 €</p>
    </div>
  );
}

function TableCell189() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 090">
      <TableCell88 />
    </div>
  );
}

function TableCell89() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Alpha Printers</p>
    </div>
  );
}

function TableCell190() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 091">
      <TableCell89 />
    </div>
  );
}

function Link12() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell90() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link12 />
    </div>
  );
}

function TableCell191() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 092">
      <TableCell90 />
    </div>
  );
}

function Link13() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell91() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link13 />
    </div>
  );
}

function TableCell192() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 093">
      <TableCell91 />
    </div>
  );
}

function TableCell92() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Laptops</p>
    </div>
  );
}

function TableCell193() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 094">
      <TableCell92 />
    </div>
  );
}

function TableCell93() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">14.04.2024</p>
    </div>
  );
}

function TableCell194() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 095">
      <TableCell93 />
    </div>
  );
}

function TableCellContainer7() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer7 />
      <TableCell185 />
      <TableCell186 />
      <TableCell187 />
      <TableCell188 />
      <TableCell189 />
      <TableCell190 />
      <TableCell191 />
      <TableCell192 />
      <TableCell193 />
      <TableCell194 />
    </div>
  );
}

function Checkbox7() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox7() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox7 />
    </div>
  );
}

function TableCell94() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox7 />
    </div>
  );
}

function TableCell184() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 085">
      <TableCell94 />
    </div>
  );
}

function Icon7() {
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

function TableCell95() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon7 />
    </div>
  );
}

function TableCell195() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 096">
      <TableCell95 />
    </div>
  );
}

function GridTableRow6() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer7 />
      <TableCell184 />
      <TableCell195 />
    </div>
  );
}

function Spacer8() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell96() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">ITelO Vault Net</p>
    </div>
  );
}

function TableCell197() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 098">
      <TableCell96 />
    </div>
  );
}

function TableCell97() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1020</p>
    </div>
  );
}

function TableCell198() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 099">
      <TableCell97 />
    </div>
  );
}

function TableCell98() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">14</p>
    </div>
  );
}

function TableCell199() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 100">
      <TableCell98 />
    </div>
  );
}

function TableCell99() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell200() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 101">
      <TableCell99 />
    </div>
  );
}

function TableCell340() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">149,00 €</p>
    </div>
  );
}

function TableCell201() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 102">
      <TableCell340 />
    </div>
  );
}

function TableCell341() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Alpha Printers</p>
    </div>
  );
}

function TableCell202() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 103">
      <TableCell341 />
    </div>
  );
}

function Link14() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell342() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link14 />
    </div>
  );
}

function TableCell203() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 104">
      <TableCell342 />
    </div>
  );
}

function Link15() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell343() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link15 />
    </div>
  );
}

function TableCell204() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 105">
      <TableCell343 />
    </div>
  );
}

function TableCell344() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Accessories</p>
    </div>
  );
}

function TableCell205() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 106">
      <TableCell344 />
    </div>
  );
}

function TableCell345() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">10.04.2024</p>
    </div>
  );
}

function TableCell206() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 107">
      <TableCell345 />
    </div>
  );
}

function TableCellContainer8() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer8 />
      <TableCell197 />
      <TableCell198 />
      <TableCell199 />
      <TableCell200 />
      <TableCell201 />
      <TableCell202 />
      <TableCell203 />
      <TableCell204 />
      <TableCell205 />
      <TableCell206 />
    </div>
  );
}

function Checkbox8() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox8() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox8 />
    </div>
  );
}

function TableCell346() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox8 />
    </div>
  );
}

function TableCell196() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 097">
      <TableCell346 />
    </div>
  );
}

function Icon8() {
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

function TableCell347() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon8 />
    </div>
  );
}

function TableCell207() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 108">
      <TableCell347 />
    </div>
  );
}

function GridTableRow7() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer8 />
      <TableCell196 />
      <TableCell207 />
    </div>
  );
}

function Spacer9() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell348() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">ITelo Vault SAT</p>
    </div>
  );
}

function TableCell209() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 110">
      <TableCell348 />
    </div>
  );
}

function TableCell349() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1021</p>
    </div>
  );
}

function TableCell210() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 111">
      <TableCell349 />
    </div>
  );
}

function TableCell350() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">50</p>
    </div>
  );
}

function TableCell211() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 112">
      <TableCell350 />
    </div>
  );
}

function TableCell351() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell212() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 113">
      <TableCell351 />
    </div>
  );
}

function TableCell352() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">1.679,00 €</p>
    </div>
  );
}

function TableCell213() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 114">
      <TableCell352 />
    </div>
  );
}

function TableCell353() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Printers for All</p>
    </div>
  );
}

function TableCell214() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 115">
      <TableCell353 />
    </div>
  );
}

function Link16() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell354() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link16 />
    </div>
  );
}

function TableCell215() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 116">
      <TableCell354 />
    </div>
  );
}

function Link17() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell355() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link17 />
    </div>
  );
}

function TableCell216() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 117">
      <TableCell355 />
    </div>
  );
}

function TableCell356() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Accessories</p>
    </div>
  );
}

function TableCell217() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 118">
      <TableCell356 />
    </div>
  );
}

function TableCell357() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">06.04.2024</p>
    </div>
  );
}

function TableCell218() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 119">
      <TableCell357 />
    </div>
  );
}

function TableCellContainer9() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer9 />
      <TableCell209 />
      <TableCell210 />
      <TableCell211 />
      <TableCell212 />
      <TableCell213 />
      <TableCell214 />
      <TableCell215 />
      <TableCell216 />
      <TableCell217 />
      <TableCell218 />
    </div>
  );
}

function Checkbox9() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox9() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox9 />
    </div>
  );
}

function TableCell358() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox9 />
    </div>
  );
}

function TableCell208() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 109">
      <TableCell358 />
    </div>
  );
}

function Icon9() {
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

function TableCell359() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon9 />
    </div>
  );
}

function TableCell219() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 120">
      <TableCell359 />
    </div>
  );
}

function GridTableRow8() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer9 />
      <TableCell208 />
      <TableCell219 />
    </div>
  );
}

function Spacer10() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell360() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Comfort Easy</p>
    </div>
  );
}

function TableCell221() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 122">
      <TableCell360 />
    </div>
  );
}

function TableCell361() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1022</p>
    </div>
  );
}

function TableCell222() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 123">
      <TableCell361 />
    </div>
  );
}

function TableCell362() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">30</p>
    </div>
  );
}

function TableCell223() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 124">
      <TableCell362 />
    </div>
  );
}

function TableCell363() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell224() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 125">
      <TableCell363 />
    </div>
  );
}

function TableCell364() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">512,00 €</p>
    </div>
  );
}

function TableCell225() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 126">
      <TableCell364 />
    </div>
  );
}

function TableCell365() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Printers for All</p>
    </div>
  );
}

function TableCell226() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 127">
      <TableCell365 />
    </div>
  );
}

function Link18() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell366() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link18 />
    </div>
  );
}

function TableCell227() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 128">
      <TableCell366 />
    </div>
  );
}

function Link19() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell367() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link19 />
    </div>
  );
}

function TableCell228() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 129">
      <TableCell367 />
    </div>
  );
}

function TableCell368() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Accessories</p>
    </div>
  );
}

function TableCell229() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 130">
      <TableCell368 />
    </div>
  );
}

function TableCell369() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">02.04.2024</p>
    </div>
  );
}

function TableCell230() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 131">
      <TableCell369 />
    </div>
  );
}

function TableCellContainer10() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer10 />
      <TableCell221 />
      <TableCell222 />
      <TableCell223 />
      <TableCell224 />
      <TableCell225 />
      <TableCell226 />
      <TableCell227 />
      <TableCell228 />
      <TableCell229 />
      <TableCell230 />
    </div>
  );
}

function Checkbox10() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox10() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox10 />
    </div>
  );
}

function TableCell370() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox10 />
    </div>
  );
}

function TableCell220() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 121">
      <TableCell370 />
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

function TableCell371() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon10 />
    </div>
  );
}

function TableCell231() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 132">
      <TableCell371 />
    </div>
  );
}

function GridTableRow9() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer10 />
      <TableCell220 />
      <TableCell231 />
    </div>
  );
}

function Spacer11() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell372() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Comfort Senior</p>
    </div>
  );
}

function TableCell233() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 134">
      <TableCell372 />
    </div>
  );
}

function TableCell373() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1023</p>
    </div>
  );
}

function TableCell234() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 135">
      <TableCell373 />
    </div>
  );
}

function TableCell374() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">24</p>
    </div>
  );
}

function TableCell235() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 136">
      <TableCell374 />
    </div>
  );
}

function TableCell375() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell236() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 137">
      <TableCell375 />
    </div>
  );
}

function TableCell376() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">230,00 €</p>
    </div>
  );
}

function TableCell237() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 138">
      <TableCell376 />
    </div>
  );
}

function TableCell377() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Printers for All</p>
    </div>
  );
}

function TableCell238() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 139">
      <TableCell377 />
    </div>
  );
}

function Link20() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell378() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link20 />
    </div>
  );
}

function TableCell239() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 140">
      <TableCell378 />
    </div>
  );
}

function Link21() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell379() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link21 />
    </div>
  );
}

function TableCell240() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 141">
      <TableCell379 />
    </div>
  );
}

function TableCell380() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Accessories</p>
    </div>
  );
}

function TableCell241() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 142">
      <TableCell380 />
    </div>
  );
}

function TableCell381() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">29.03.2024</p>
    </div>
  );
}

function TableCell242() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 143">
      <TableCell381 />
    </div>
  );
}

function TableCellContainer11() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer11 />
      <TableCell233 />
      <TableCell234 />
      <TableCell235 />
      <TableCell236 />
      <TableCell237 />
      <TableCell238 />
      <TableCell239 />
      <TableCell240 />
      <TableCell241 />
      <TableCell242 />
    </div>
  );
}

function Checkbox11() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox11() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox11 />
    </div>
  );
}

function TableCell382() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox11 />
    </div>
  );
}

function TableCell232() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 133">
      <TableCell382 />
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

function TableCell383() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon11 />
    </div>
  );
}

function TableCell243() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 144">
      <TableCell383 />
    </div>
  );
}

function GridTableRow10() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer11 />
      <TableCell232 />
      <TableCell243 />
    </div>
  );
}

function Spacer12() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell384() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Ergo Screen E-I</p>
    </div>
  );
}

function TableCell245() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 146">
      <TableCell384 />
    </div>
  );
}

function TableCell385() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1030</p>
    </div>
  );
}

function TableCell246() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 147">
      <TableCell385 />
    </div>
  );
}

function TableCell386() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">50</p>
    </div>
  );
}

function TableCell247() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 148">
      <TableCell386 />
    </div>
  );
}

function TableCell387() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell248() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 149">
      <TableCell387 />
    </div>
  );
}

function TableCell388() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">285,99 €</p>
    </div>
  );
}

function TableCell249() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 150">
      <TableCell388 />
    </div>
  );
}

function TableCell389() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Printers for All</p>
    </div>
  );
}

function TableCell250() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 151">
      <TableCell389 />
    </div>
  );
}

function Link22() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell390() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link22 />
    </div>
  );
}

function TableCell251() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 152">
      <TableCell390 />
    </div>
  );
}

function Link23() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell391() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link23 />
    </div>
  );
}

function TableCell252() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 153">
      <TableCell391 />
    </div>
  );
}

function TableCell392() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Flat Screen Monitors</p>
    </div>
  );
}

function TableCell253() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 154">
      <TableCell392 />
    </div>
  );
}

function TableCell393() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">25.03.2024</p>
    </div>
  );
}

function TableCell254() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 155">
      <TableCell393 />
    </div>
  );
}

function TableCellContainer12() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer12 />
      <TableCell245 />
      <TableCell246 />
      <TableCell247 />
      <TableCell248 />
      <TableCell249 />
      <TableCell250 />
      <TableCell251 />
      <TableCell252 />
      <TableCell253 />
      <TableCell254 />
    </div>
  );
}

function Checkbox12() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox12() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox12 />
    </div>
  );
}

function TableCell394() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox12 />
    </div>
  );
}

function TableCell244() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 145">
      <TableCell394 />
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

function TableCell395() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon12 />
    </div>
  );
}

function TableCell255() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 156">
      <TableCell395 />
    </div>
  );
}

function GridTableRow11() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer12 />
      <TableCell244 />
      <TableCell255 />
    </div>
  );
}

function Spacer13() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell396() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Ergo Screen E-II</p>
    </div>
  );
}

function TableCell257() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 158">
      <TableCell396 />
    </div>
  );
}

function TableCell397() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1031</p>
    </div>
  );
}

function TableCell258() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 159">
      <TableCell397 />
    </div>
  );
}

function TableCell398() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">23</p>
    </div>
  );
}

function TableCell259() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 160">
      <TableCell398 />
    </div>
  );
}

function TableCell399() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell260() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 161">
      <TableCell399 />
    </div>
  );
}

function TableCell400() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">345,00 €</p>
    </div>
  );
}

function TableCell261() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 162">
      <TableCell400 />
    </div>
  );
}

function TableCell401() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Oxynum</p>
    </div>
  );
}

function TableCell262() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 163">
      <TableCell401 />
    </div>
  );
}

function Link24() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell402() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link24 />
    </div>
  );
}

function TableCell263() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 164">
      <TableCell402 />
    </div>
  );
}

function Link25() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell403() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link25 />
    </div>
  );
}

function TableCell264() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 165">
      <TableCell403 />
    </div>
  );
}

function TableCell404() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Flat Screen Monitors</p>
    </div>
  );
}

function TableCell265() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 166">
      <TableCell404 />
    </div>
  );
}

function TableCell405() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">21.03.2024</p>
    </div>
  );
}

function TableCell266() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 167">
      <TableCell405 />
    </div>
  );
}

function TableCellContainer13() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer13 />
      <TableCell257 />
      <TableCell258 />
      <TableCell259 />
      <TableCell260 />
      <TableCell261 />
      <TableCell262 />
      <TableCell263 />
      <TableCell264 />
      <TableCell265 />
      <TableCell266 />
    </div>
  );
}

function Checkbox13() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox13() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox13 />
    </div>
  );
}

function TableCell406() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox13 />
    </div>
  );
}

function TableCell256() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 157">
      <TableCell406 />
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

function TableCell407() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon13 />
    </div>
  );
}

function TableCell267() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 168">
      <TableCell407 />
    </div>
  );
}

function GridTableRow12() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer13 />
      <TableCell256 />
      <TableCell267 />
    </div>
  );
}

function Spacer14() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell408() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Ergo Screen E-III</p>
    </div>
  );
}

function TableCell269() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 170">
      <TableCell408 />
    </div>
  );
}

function TableCell409() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1032</p>
    </div>
  );
}

function TableCell270() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 171">
      <TableCell409 />
    </div>
  );
}

function TableCell410() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">22</p>
    </div>
  );
}

function TableCell271() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 172">
      <TableCell410 />
    </div>
  );
}

function TableCell411() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell272() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 173">
      <TableCell411 />
    </div>
  );
}

function TableCell412() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">399,00 €</p>
    </div>
  );
}

function TableCell273() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 174">
      <TableCell412 />
    </div>
  );
}

function TableCell413() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Oxynum</p>
    </div>
  );
}

function TableCell274() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 175">
      <TableCell413 />
    </div>
  );
}

function Link26() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell414() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link26 />
    </div>
  );
}

function TableCell275() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 176">
      <TableCell414 />
    </div>
  );
}

function Link27() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell415() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link27 />
    </div>
  );
}

function TableCell276() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 177">
      <TableCell415 />
    </div>
  );
}

function TableCell416() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Flat Screen Monitors</p>
    </div>
  );
}

function TableCell277() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 178">
      <TableCell416 />
    </div>
  );
}

function TableCell417() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">17.03.2024</p>
    </div>
  );
}

function TableCell278() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 179">
      <TableCell417 />
    </div>
  );
}

function TableCellContainer14() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer14 />
      <TableCell269 />
      <TableCell270 />
      <TableCell271 />
      <TableCell272 />
      <TableCell273 />
      <TableCell274 />
      <TableCell275 />
      <TableCell276 />
      <TableCell277 />
      <TableCell278 />
    </div>
  );
}

function Checkbox14() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox14() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox14 />
    </div>
  );
}

function TableCell418() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox14 />
    </div>
  );
}

function TableCell268() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 169">
      <TableCell418 />
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

function TableCell419() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon14 />
    </div>
  );
}

function TableCell279() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 180">
      <TableCell419 />
    </div>
  );
}

function GridTableRow13() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer14 />
      <TableCell268 />
      <TableCell279 />
    </div>
  );
}

function Spacer15() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell420() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Flat Basic</p>
    </div>
  );
}

function TableCell281() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 182">
      <TableCell420 />
    </div>
  );
}

function TableCell421() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1035</p>
    </div>
  );
}

function TableCell282() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 183">
      <TableCell421 />
    </div>
  );
}

function TableCell422() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">21</p>
    </div>
  );
}

function TableCell283() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 184">
      <TableCell422 />
    </div>
  );
}

function TableCell423() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell284() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 185">
      <TableCell423 />
    </div>
  );
}

function TableCell424() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">430,00 €</p>
    </div>
  );
}

function TableCell285() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 186">
      <TableCell424 />
    </div>
  );
}

function TableCell425() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Oxynum</p>
    </div>
  );
}

function TableCell286() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 187">
      <TableCell425 />
    </div>
  );
}

function Link28() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell426() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link28 />
    </div>
  );
}

function TableCell287() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 188">
      <TableCell426 />
    </div>
  );
}

function Link29() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell427() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link29 />
    </div>
  );
}

function TableCell288() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 189">
      <TableCell427 />
    </div>
  );
}

function TableCell428() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Flat Screen Monitors</p>
    </div>
  );
}

function TableCell289() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 190">
      <TableCell428 />
    </div>
  );
}

function TableCell429() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">13.03.2024</p>
    </div>
  );
}

function TableCell290() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 191">
      <TableCell429 />
    </div>
  );
}

function TableCellContainer15() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer15 />
      <TableCell281 />
      <TableCell282 />
      <TableCell283 />
      <TableCell284 />
      <TableCell285 />
      <TableCell286 />
      <TableCell287 />
      <TableCell288 />
      <TableCell289 />
      <TableCell290 />
    </div>
  );
}

function Checkbox15() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox15() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox15 />
    </div>
  );
}

function TableCell430() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox15 />
    </div>
  );
}

function TableCell280() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 181">
      <TableCell430 />
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

function TableCell431() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon15 />
    </div>
  );
}

function TableCell291() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 192">
      <TableCell431 />
    </div>
  );
}

function GridTableRow14() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer15 />
      <TableCell280 />
      <TableCell291 />
    </div>
  );
}

function Spacer16() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell432() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Flat Future</p>
    </div>
  );
}

function TableCell293() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 194">
      <TableCell432 />
    </div>
  );
}

function TableCell433() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1036</p>
    </div>
  );
}

function TableCell294() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 195">
      <TableCell433 />
    </div>
  );
}

function TableCell434() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">8</p>
    </div>
  );
}

function TableCell295() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 196">
      <TableCell434 />
    </div>
  );
}

function TableCell435() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell296() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 197">
      <TableCell435 />
    </div>
  );
}

function TableCell436() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">1.230,00 €</p>
    </div>
  );
}

function TableCell297() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 198">
      <TableCell436 />
    </div>
  );
}

function TableCell437() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Oxynum</p>
    </div>
  );
}

function TableCell298() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 199">
      <TableCell437 />
    </div>
  );
}

function Link30() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell438() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link30 />
    </div>
  );
}

function TableCell299() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 200">
      <TableCell438 />
    </div>
  );
}

function Link31() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell439() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link31 />
    </div>
  );
}

function TableCell300() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 201">
      <TableCell439 />
    </div>
  );
}

function TableCell440() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Flat Screen Monitors</p>
    </div>
  );
}

function TableCell301() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 202">
      <TableCell440 />
    </div>
  );
}

function TableCell441() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">18.04.2024</p>
    </div>
  );
}

function TableCell302() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 203">
      <TableCell441 />
    </div>
  );
}

function TableCellContainer16() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer16 />
      <TableCell293 />
      <TableCell294 />
      <TableCell295 />
      <TableCell296 />
      <TableCell297 />
      <TableCell298 />
      <TableCell299 />
      <TableCell300 />
      <TableCell301 />
      <TableCell302 />
    </div>
  );
}

function Checkbox16() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox16() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox16 />
    </div>
  );
}

function TableCell442() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox16 />
    </div>
  );
}

function TableCell292() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 193">
      <TableCell442 />
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

function TableCell443() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon16 />
    </div>
  );
}

function TableCell303() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 204">
      <TableCell443 />
    </div>
  );
}

function GridTableRow15() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer16 />
      <TableCell292 />
      <TableCell303 />
    </div>
  );
}

function Spacer17() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell444() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Flat XL</p>
    </div>
  );
}

function TableCell305() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 206">
      <TableCell444 />
    </div>
  );
}

function TableCell445() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1037</p>
    </div>
  );
}

function TableCell306() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 207">
      <TableCell445 />
    </div>
  );
}

function TableCell446() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">9</p>
    </div>
  );
}

function TableCell307() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 208">
      <TableCell446 />
    </div>
  );
}

function TableCell447() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Bold',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell308() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 209">
      <TableCell447 />
    </div>
  );
}

function TableCell448() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">830,00 €</p>
    </div>
  );
}

function TableCell309() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 210">
      <TableCell448 />
    </div>
  );
}

function TableCell449() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Oxynum</p>
    </div>
  );
}

function TableCell310() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 211">
      <TableCell449 />
    </div>
  );
}

function Link32() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell450() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link32 />
    </div>
  );
}

function TableCell311() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 212">
      <TableCell450 />
    </div>
  );
}

function Link33() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell451() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link33 />
    </div>
  );
}

function TableCell312() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 213">
      <TableCell451 />
    </div>
  );
}

function TableCell452() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Flat Screen Monitors</p>
    </div>
  );
}

function TableCell313() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 214">
      <TableCell452 />
    </div>
  );
}

function TableCell453() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">14.04.2024</p>
    </div>
  );
}

function TableCell314() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 215">
      <TableCell453 />
    </div>
  );
}

function TableCellContainer17() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer17 />
      <TableCell305 />
      <TableCell306 />
      <TableCell307 />
      <TableCell308 />
      <TableCell309 />
      <TableCell310 />
      <TableCell311 />
      <TableCell312 />
      <TableCell313 />
      <TableCell314 />
    </div>
  );
}

function Checkbox17() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox17() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox17 />
    </div>
  );
}

function TableCell454() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox17 />
    </div>
  );
}

function TableCell304() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 205">
      <TableCell454 />
    </div>
  );
}

function Icon17() {
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

function TableCell455() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon17 />
    </div>
  );
}

function TableCell315() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 216">
      <TableCell455 />
    </div>
  );
}

function GridTableRow16() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer17 />
      <TableCell304 />
      <TableCell315 />
    </div>
  );
}

function Spacer18() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell456() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Laser Professional Eco</p>
    </div>
  );
}

function TableCell317() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 218">
      <TableCell456 />
    </div>
  );
}

function TableCell457() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1040</p>
    </div>
  );
}

function TableCell318() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 219">
      <TableCell457 />
    </div>
  );
}

function TableCell458() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">17</p>
    </div>
  );
}

function TableCell319() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 220">
      <TableCell458 />
    </div>
  );
}

function TableCell459() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell320() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 221">
      <TableCell459 />
    </div>
  );
}

function TableCell460() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">490,00 €</p>
    </div>
  );
}

function TableCell321() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 222">
      <TableCell460 />
    </div>
  );
}

function TableCell461() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Oxynum</p>
    </div>
  );
}

function TableCell322() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 223">
      <TableCell461 />
    </div>
  );
}

function Link34() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell462() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link34 />
    </div>
  );
}

function TableCell323() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 224">
      <TableCell462 />
    </div>
  );
}

function Link35() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell463() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link35 />
    </div>
  );
}

function TableCell324() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 225">
      <TableCell463 />
    </div>
  );
}

function TableCell464() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Printers</p>
    </div>
  );
}

function TableCell325() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 226">
      <TableCell464 />
    </div>
  );
}

function TableCell465() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">10.04.2024</p>
    </div>
  );
}

function TableCell326() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 227">
      <TableCell465 />
    </div>
  );
}

function TableCellContainer18() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer18 />
      <TableCell317 />
      <TableCell318 />
      <TableCell319 />
      <TableCell320 />
      <TableCell321 />
      <TableCell322 />
      <TableCell323 />
      <TableCell324 />
      <TableCell325 />
      <TableCell326 />
    </div>
  );
}

function Checkbox18() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox18() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox18 />
    </div>
  );
}

function TableCell466() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox18 />
    </div>
  );
}

function TableCell316() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 217">
      <TableCell466 />
    </div>
  );
}

function Icon18() {
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

function TableCell467() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon18 />
    </div>
  );
}

function TableCell327() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 228">
      <TableCell467 />
    </div>
  );
}

function GridTableRow17() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer18 />
      <TableCell316 />
      <TableCell327 />
    </div>
  );
}

function Spacer19() {
  return <div className="shrink-0 size-[32px]" data-name="Spacer" />;
}

function TableCell468() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Laser Basic</p>
    </div>
  );
}

function TableCell329() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 230">
      <TableCell468 />
    </div>
  );
}

function TableCell469() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">HT-1041</p>
    </div>
  );
}

function TableCell330() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 231">
      <TableCell469 />
    </div>
  );
}

function TableCell470() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">18</p>
    </div>
  );
}

function TableCell331() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 232">
      <TableCell470 />
    </div>
  );
}

function TableCell471() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#256f3a] text-[14px]">Available</p>
    </div>
  );
}

function TableCell332() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 233">
      <TableCell471 />
    </div>
  );
}

function TableCell472() {
  return (
    <div className="bg-white content-stretch flex items-center justify-end min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px] text-right">349,00 €</p>
    </div>
  );
}

function TableCell333() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 234">
      <TableCell472 />
    </div>
  );
}

function TableCell473() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Oxynum</p>
    </div>
  );
}

function TableCell334() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 235">
      <TableCell473 />
    </div>
  );
}

function Link36() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Image</p>
    </div>
  );
}

function TableCell474() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link36 />
    </div>
  );
}

function TableCell335() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 236">
      <TableCell474 />
    </div>
  );
}

function Link37() {
  return (
    <div className="basis-0 content-stretch flex flex-col grow items-start min-h-px min-w-px relative shrink-0" data-name="Link">
      <p className="font-['72:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[#0064d9] text-[14px] w-full">Show Details</p>
    </div>
  );
}

function TableCell475() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] p-[8px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <Link37 />
    </div>
  );
}

function TableCell336() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 237">
      <TableCell475 />
    </div>
  );
}

function TableCell476() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">Printers</p>
    </div>
  );
}

function TableCell337() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 238">
      <TableCell476 />
    </div>
  );
}

function TableCell477() {
  return (
    <div className="bg-white content-stretch flex items-center min-h-[32px] px-[8px] py-[4px] relative shrink-0 w-[200px]" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <p className="basis-0 font-['72:Regular',sans-serif] grow leading-[normal] min-h-px min-w-px not-italic relative shrink-0 text-[#131e29] text-[14px]">29.03.2024</p>
    </div>
  );
}

function TableCell338() {
  return (
    <div className="content-stretch flex items-start relative shrink-0" data-name="Table Cell 239">
      <TableCell477 />
    </div>
  );
}

function TableCellContainer19() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell Container">
      <Spacer19 />
      <TableCell329 />
      <TableCell330 />
      <TableCell331 />
      <TableCell332 />
      <TableCell333 />
      <TableCell334 />
      <TableCell335 />
      <TableCell336 />
      <TableCell337 />
      <TableCell338 />
    </div>
  );
}

function Checkbox19() {
  return (
    <div className="bg-white relative rounded-[4px] shrink-0 size-[16px]" data-name="Checkbox">
      <div aria-hidden="true" className="absolute border border-[#556b81] border-solid inset-0 pointer-events-none rounded-[4px]" />
    </div>
  );
}

function CheckBox19() {
  return (
    <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="Check Box">
      <Checkbox19 />
    </div>
  );
}

function TableCell478() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] px-0 py-[8px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px_0px] border-solid inset-0 pointer-events-none" />
      <CheckBox19 />
    </div>
  );
}

function TableCell328() {
  return (
    <div className="absolute content-stretch flex items-start left-0 top-0" data-name="Table Cell 229">
      <TableCell478 />
    </div>
  );
}

function Icon19() {
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

function TableCell479() {
  return (
    <div className="bg-white content-stretch flex items-center justify-center max-w-[32px] min-h-[32px] min-w-[32px] relative shrink-0" data-name="Table Cell">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_1px_1px] border-solid inset-0 pointer-events-none" />
      <Icon19 />
    </div>
  );
}

function TableCell339() {
  return (
    <div className="absolute content-stretch flex items-start right-[12px] top-0" data-name="Table Cell 240">
      <TableCell479 />
    </div>
  );
}

function GridTableRow18() {
  return (
    <div className="h-[32px] relative shrink-0 w-full" data-name="Grid Table Row">
      <TableCellContainer19 />
      <TableCell328 />
      <TableCell339 />
    </div>
  );
}

function Scrollbar() {
  return (
    <div className="bg-white content-stretch flex h-[113px] items-start justify-center pb-[50px] pt-[2px] px-0 relative shrink-0 w-[12px]" data-name="Scrollbar">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[1px_0px_0px] border-solid inset-[-1px_0_0_0] pointer-events-none" />
      <div className="bg-[#7b91a8] h-full relative rounded-[12px] shrink-0 w-[12px]" data-name="Scroll Face">
        <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[12px]" />
      </div>
    </div>
  );
}

function ScrollBar() {
  return (
    <div className="absolute bg-white bottom-0 content-stretch flex flex-col items-start pb-0 pt-[32px] px-0 right-0 top-0" data-name="Scroll Bar">
      <div aria-hidden="true" className="absolute border-[#e5e5e5] border-[0px_0px_0px_1px] border-solid inset-[0_0_0_-1px] pointer-events-none" />
      <Scrollbar />
    </div>
  );
}

function Scrollbar1() {
  return (
    <div className="bg-white content-stretch flex h-[113px] items-start justify-center pb-[50px] pt-[2px] px-0 relative w-[12px]" data-name="Scrollbar">
      <div className="bg-[#7b91a8] h-full relative rounded-[12px] shrink-0 w-[12px]" data-name="Scroll Face">
        <div aria-hidden="true" className="absolute border-2 border-solid border-white inset-0 pointer-events-none rounded-[12px]" />
      </div>
    </div>
  );
}

function ScrollBar1() {
  return (
    <div className="absolute bg-white bottom-0 content-stretch flex flex-col h-[12px] items-start left-0 right-0" data-name="Scroll Bar">
      <div aria-hidden="true" className="absolute border-[#a8b3bd] border-[1px_0px_0px] border-solid inset-[-1px_0_0_0] pointer-events-none" />
      <div className="flex h-[12px] items-center justify-center relative shrink-0 w-[113px]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
        <div className="flex-none rotate-[270deg]">
          <Scrollbar1 />
        </div>
      </div>
    </div>
  );
}

function GridTableContent() {
  return (
    <div className="basis-0 bg-white content-stretch flex flex-col grow items-start min-h-px min-w-px overflow-clip relative shrink-0 w-full" data-name="Grid Table Content">
      <GridTableHeader />
      <GridTableRow />
      <GridTableRow1 />
      <GridTableRow2 />
      <GridTableRow3 />
      <GridTableRow4 />
      <GridTableRow5 />
      <GridTableRow6 />
      <GridTableRow7 />
      <GridTableRow8 />
      <GridTableRow9 />
      <GridTableRow10 />
      <GridTableRow11 />
      <GridTableRow12 />
      <GridTableRow13 />
      <GridTableRow14 />
      <GridTableRow15 />
      <GridTableRow16 />
      <GridTableRow17 />
      <GridTableRow18 />
      <ScrollBar />
      <ScrollBar1 />
    </div>
  );
}

export default function GridTable() {
  return (
    <div className="content-stretch flex flex-col items-start relative size-full" data-name="Grid Table">
      <TableToolbar />
      <GridTableContent />
    </div>
  );
}
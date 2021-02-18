import React from 'react';

export type RenderSideMenu = () => JSX.Element;
export type RenderHeader = () => JSX.Element;

type LayoutContentProps = {
  children?: JSX.Element;
  renderSideMenu?: RenderSideMenu;
  renderHeader?: RenderHeader;
};

export const LayoutContent = ({ children, renderHeader }: LayoutContentProps) => {
  const header = renderHeader && renderHeader();

  return (
    <div className="flex-1 relative z-0 flex overflow-hidden">
      <main className="flex-1 flex flex-col z-0 focus:outline-none" tabIndex={0}>
        {header}
        <div className="relative flex-1 flex flex-col overflow-y-auto focus:outline-none">{children}</div>
      </main>
    </div>
  );
};

import React from 'react';
import { OverflowList } from 'react-overflow-list';
import Tags from './Tags';


const ItemRenderer = (item) => {
        
        
  return <Tags tagName={item.name} key={item._id} />
};

const OverflowRenderer = (items) => {
  return (
    <div className="relative flex group">
      <Tags tagName={`+ ${items.length}`} />

      <div className="absolute z-50 right-0  mt-2 hidden min-w-[120px] flex-col gap-1 rounded-lg bg-[var(--aux3-color)] p-2 shadow-lg group-hover:flex ">
        {items.map((item) => (
          <Tags key={item.id} tagName={item.name} />
        ))}
      </div>
    </div>

  );
};

export default React.memo(function TagsList2({ tags }) {
  return (
    <>
      {tags.length === 0 ? (
        <p className="text-sm font-extralight text-[#9F9FA6]">--Sin tags-- </p>
      ) : (
        <OverflowList
          className="gap-1"
          collapseFrom="end"
          minVisibleItems={0}
          items={tags}
          itemRenderer={ItemRenderer}
          overflowRenderer={OverflowRenderer}
        />
      )}
    </>
  );
});

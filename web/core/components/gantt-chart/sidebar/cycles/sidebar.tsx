"use client";

import { MutableRefObject } from "react";
// ui
import { Loader } from "@plane/ui";
// components
import { ChartDataType, IBlockUpdateData, IGanttBlock } from "@/components/gantt-chart/types";
import { GanttDnDHOC } from "../gantt-dnd-HOC";
import { handleOrderChange } from "../utils";
import { CyclesSidebarBlock } from "./block";
// types

type Props = {
  title: string;
  blockUpdateHandler: (block: any, payload: IBlockUpdateData) => void;
  getBlockById: (id: string, currentViewData?: ChartDataType | undefined) => IGanttBlock;
  blockIds: string[];
  enableReorder: boolean;
};

export const CycleGanttSidebar: React.FC<Props> = (props) => {
  const { blockUpdateHandler, blockIds, getBlockById, enableReorder } = props;

  const handleOnDrop = (
    draggingBlockId: string | undefined,
    droppedBlockId: string | undefined,
    dropAtEndOfList: boolean
  ) => {
    handleOrderChange(draggingBlockId, droppedBlockId, dropAtEndOfList, blockIds, getBlockById, blockUpdateHandler);
  };

  return (
    <div className="h-full">
      {blockIds ? (
        blockIds.map((blockId, index) => {
          const block = getBlockById(blockId);
          if (!block.start_date || !block.target_date) return null;
          return (
            <GanttDnDHOC
              key={block.id}
              id={block.id}
              isLastChild={index === blockIds.length - 1}
              isDragEnabled={enableReorder}
              onDrop={handleOnDrop}
            >
              {(isDragging: boolean, dragHandleRef: MutableRefObject<HTMLButtonElement | null>) => (
                <CyclesSidebarBlock
                  block={block}
                  enableReorder={enableReorder}
                  isDragging={isDragging}
                  dragHandleRef={dragHandleRef}
                />
              )}
            </GanttDnDHOC>
          );
        })
      ) : (
        <Loader className="space-y-3 pr-2">
          <Loader.Item height="34px" />
          <Loader.Item height="34px" />
          <Loader.Item height="34px" />
          <Loader.Item height="34px" />
        </Loader>
      )}
    </div>
  );
};
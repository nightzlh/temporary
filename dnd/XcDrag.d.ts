import * as React from 'react';

interface XcDragProps<T> {
    /** 只有为相同类型注册的 drop targets 才会对此拖动源生成的项目做出反应 @default item */
    type?: string;
    /** 返回描述被拖动数据 */
    getItem: (props: object) => object;
    /** 当前是否允许拖动 */
    canDrag?: (props: object) => boolean;

    className?: string;
    style?: React.CSSProperties;
    itemStyle?: React.CSSProperties;

    children: ({ isDragging: boolean }) => React.ReactNode;
}

export default class XcDrag<T> extends React.Component<XcDragProps<T>> {}

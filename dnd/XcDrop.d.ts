import * as React from 'react';

interface XcDropProps<T> {
    /** 放置目标仅对指定类型的 drag sources 项目做出反应 @default item */
    type?: string;
    /** 是否以严格检查是否只有 drag source 悬停，而不是嵌套目标 */
    shallow: boolean;
    /** 方向 @default vertical */
    direction?: 'horizontal' | 'vertical';
    /** 返回描述放置数据 */
    getItem: (props: object) => object;
    /** 在目标上放置 drag source 时调用 */
    onDrop: (dropItem: object, dragItem: object, dropDir: int) => void;
    /** 当 drag source 悬停在组件上时调用 */
    onHover: (dropItem: object, dragItem: object, hoverDir: int) => void;
    /** 是否允许被放置 */
    canDrop?: (dropItem: object, dragItem: object) => boolean;

    className?: string;
    style?: React.CSSProperties;
    itemStyle?: React.CSSProperties;
}

export default class XcDrop<T> extends React.Component<XcDropProps<T>> {}

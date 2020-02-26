import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DragSource } from 'react-dnd';

class XcDragItem extends Component {
    render() {
        const { connectDragSource, isDragging, style } = this.props;
        return connectDragSource(
            <div className='xcdrag-item' style={style}>
                {this.props.children({ isDragging })}
            </div>,
        );
    }
}

const createSource = ({ getItem, canDrag }) => {
    let source = {
        beginDrag(props, monitor, component) {
            const item = getItem ? getItem(props) : {};
            return item;
        },
    };
    if (canDrag) {
        source = { ...source, canDrag: (props, monitor) => canDrag(props) };
    }
    return source;
};

export default class XcDrag extends Component {
    constructor(props) {
        super(props);

        this.dragWrapper = DragSource(props.type, createSource(props), (connect, monitor) => ({
            connectDragSource: connect.dragSource(),
            isDragging: monitor.isDragging(),
        }))(XcDragItem);
    }

    static propTypes = {
        type: PropTypes.string.isRequired,
    };

    static defaultProps = {
        type: 'item',
    };

    render() {
        const { className, style, itemStyle } = this.props;
        const DragWrapper = this.dragWrapper;
        return (
            <div className={classnames('xcdrag', className)} style={style}>
                <DragWrapper style={itemStyle}>{this.props.children}</DragWrapper>
            </div>
        );
    }
}

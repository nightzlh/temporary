import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DropTarget } from 'react-dnd';
import { findDOMNode } from 'react-dom';

class XcDropItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            overItem: undefined,
            overDir: undefined,
        };
    }

    clear() {
        if (this.state.overDir) {
            if (!this.lock) {
                this.lock = true;
                this.setState({ overItem: undefined, overDir: undefined }, () => {
                    this.lock = false;
                });
            }
        }
    }

    over(overItem, overDir) {
        if (overDir !== this.state.overDir) {
            this.setState({ overItem, overDir });
        }
    }

    render() {
        const { overItem, overDir } = this.state;
        const { isOver, connectDropTarget, style } = this.props;
        let params = { isOver };
        if (isOver) {
            params = { ...params, overItem, overDir };
        }
        return connectDropTarget(
            <div className='xcdrop-item' style={style}>
                {this.props.children(params)}
            </div>,
        );
    }
}

const createTarget = ({ onDrop, onHover, canDrop = () => true }) => {
    const judgeDirection = (props, monitor, component) => {
        const { direction } = props;
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();
        let center;
        if (direction === 'horizontal') {
            const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
            const hoverClientX = clientOffset.x - hoverBoundingRect.left;
            center = hoverClientX - hoverMiddleX;
        } else {
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const hoverClientY = clientOffset.y - hoverBoundingRect.top;
            center = hoverClientY - hoverMiddleY;
        }
        const centerRange = 0;

        let dir;
        if (center < -centerRange) {
            dir = -1; // upward || left
        } else if (center > centerRange) {
            dir = 1; // downward || right
        } else {
            dir = -1;
        }
        return dir;
    };

    let target = {
        drop(props, monitor, component) {
            const dragItem = monitor.getItem();
            const dropItem = props.getItem();

            if (!component) return;

            if (!canDrop(dropItem, dragItem)) {
                component.clear();
                return;
            }

            if (!monitor.isOver({ shallow: props.shallow })) {
                component.clear();
                return;
            }

            const dropDir = judgeDirection(props, monitor, component);

            component.clear();

            if (onDrop) {
                onDrop(dropItem, dragItem, dropDir);
            }
        },

        hover(props, monitor, component) {
            const dragItem = monitor.getItem();
            const dropItem = props.getItem();

            if (!component) return;

            const hoverDir = judgeDirection(props, monitor, component);

            if (!canDrop(dropItem, dragItem, hoverDir)) {
                component.clear();
                return;
            }

            component.over(dragItem, hoverDir);

            if (onHover) {
                onHover(dropItem, dragItem, hoverDir);
            }
        },
    };
    return target;
};

export default class XcDrop extends Component {
    constructor(props) {
        super(props);

        this.dropWrapper = DropTarget(props.type, createTarget(props), (connect, monitor) => ({
            connectDropTarget: connect.dropTarget(),
            isOver: monitor.isOver({ shallow: props.shallow }),
        }))(XcDropItem);
    }

    static propTypes = {
        type: PropTypes.string.isRequired,
        direction: PropTypes.string,
    };

    static defaultProps = {
        type: 'item',
        direction: 'vertical',
    };

    render() {
        const { direction, shallow, getItem = () => ({}), className, style, itemStyle } = this.props;
        const DropWrapper = this.dropWrapper;
        return (
            <div className={classnames('xcdrop', className)} style={style}>
                <DropWrapper direction={direction} shallow={shallow} getItem={getItem} style={itemStyle}>
                    {this.props.children}
                </DropWrapper>
            </div>
        );
    }
}

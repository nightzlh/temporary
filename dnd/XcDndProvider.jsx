import React, { Component } from 'react';
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

export default class XcDragProvider extends Component {
    render() {
        return <DndProvider backend={HTML5Backend}>{this.props.children}</DndProvider>;
    }
}

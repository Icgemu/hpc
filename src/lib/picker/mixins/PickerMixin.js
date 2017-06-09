import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import { on } from 'dom-lib';

const PickerMixin = {
    propTypes: {
        disabled: PropTypes.bool
    },
    handleDocumentClick(e) {
        if (!ReactDOM.findDOMNode(this).contains(e.target)) {
            this.setState({ open: false });
        }
    },
    handleClose() {
        this.setState({ open: false });
    },
    toggleDropdown() {
        const { disabled } = this.props;
        if (disabled) {
            return;
        }
        this.setState({ open: !this.state.open });
    },
    autoAdjustDropdownPosition() {
        const { height, dropup } = this.props;
        const { open } = this.state;
        if (dropup) {
            this.setState({ dropup });
            return;
        }
        let el = ReactDOM.findDOMNode(this);
        if (el.getBoundingClientRect().bottom + height > window.innerHeight
            && el.getBoundingClientRect().top - height > 0
        ) {
            this.setState({ dropup: true });
        } else {
            this.setState({ dropup: false });
        }
    },
    handleKeyDown(event) {

        const { dropdown } = this.refs;
        switch (event.keyCode) {
            //down
            case 40:
                if (!this.state.open) {
                    this.toggleDropdown();
                } else if (dropdown.focusNextMenuItem) {
                    dropdown.focusNextMenuItem();
                }
                event.preventDefault();
                break;
            //esc | tab
            case 27:
            case 9:
                this.handleClose(event);
            default:

        }
    },
    componentDidMount() {
        this.autoAdjustDropdownPosition();
        this._eventScroll = on(document, 'scroll', this.autoAdjustDropdownPosition);
        this._eventResize = on(window, 'resize', this.autoAdjustDropdownPosition);
        this._eventClick = on(document, 'click', this.handleDocumentClick);
    },
    componentWillUnmount() {
        this._eventScroll.off();
        this._eventResize.off();
        this._eventClick.off();
    }
};

export default PickerMixin;

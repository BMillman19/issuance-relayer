import * as React from 'react';

import Toast from 'grommet/components/Toast';

export interface ToastErrorBoundaryState {
    toastMsg: string;
}

export interface ToastErrorBoundaryProps {}

class ToastErrorBoundary extends React.Component<ToastErrorBoundaryProps, ToastErrorBoundaryState> {
    state = {
        message: '',
    };
    public componentDidCatch(error, info): void {
        console.log(error);
        console.log(info);
    }
    public render(): React.ReactNode {
        if (!this.state.message) {
            return null;
        }
        return (
            <React.Fragment>
                <Toast onClose={() => this.setState({ message: '' })} status="warning">
                    {this.state.message}
                </Toast>
                {this.props.children}
            </React.Fragment>
        );
    }
}

export default ToastErrorBoundary;

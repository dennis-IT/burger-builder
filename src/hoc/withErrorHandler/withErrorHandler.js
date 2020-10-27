import React, { Component } from 'react';
import Modal from '../../components/UI/Modal/Modal';
import Aux from '../Auxiliary/Auxiliary';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends Component {
        state = {
            error: null
        }

        componentWillMount() { //!NOTE: Later componentWillMount will be end of life, so use constructor instead
            this.reqInterceptor = axios.interceptors.request.use(req => { //!TODO: set error empty truoc khi gui request
                this.setState({ error: null });
                return req;
            });

            this.resInterceptor = axios.interceptors.response.use(res => res, error => { //!TODO: lay thong tin cua error moi khi nhan response
                this.setState({ error: error });
            });
        }

        //!TODO: boi vi withErrorHandler wrap nhung cai existing components nen chung ta can phai remove nhung cai old interceptors di
        //!TODO: neu khong se gay ra leaking memory hoac bi loi
        componentWillUnmount() { //!NOTE: co the thay bang useEffect cung duoc nha
            // console.log('Will unmount', this.reqInterceptor, this.resInterceptor);
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        errorConfirmedHandler = () => {
            this.setState({ error: null });
        }

        render() {
            return (
                <Aux>
                    <Modal
                        show={this.state.error}
                        modalClosed={this.errorConfirmedHandler}>
                        {this.state.error ? this.state.error.message : null}
                    </Modal>

                    <WrappedComponent {...this.props} />
                </Aux>
            );
        }
    }
};

export default withErrorHandler;
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import 'nprogress/nprogress.css';
import App from 'src/App';
import { SidebarProvider } from 'src/contexts/SidebarContext';
import * as serviceWorker from 'src/serviceWorker';
import AuthMiddleware from './middleware/AuthMiddleware';
import { Provider } from 'react-redux';
import { setupStore } from './store/store';
import { SocketProvider } from './contexts/SocketContext';


const store = setupStore();


ReactDOM.render(
  <Provider store={store}>
    <HelmetProvider>
      <SocketProvider>
      <SidebarProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SidebarProvider>
      </SocketProvider>
    </HelmetProvider>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();

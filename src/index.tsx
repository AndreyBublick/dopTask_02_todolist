import React from 'react';
import './index.css';
import {createRoot} from 'react-dom/client';
import {App} from "./App";
import {Provider} from "react-redux";
import {store} from "./store/store";

const container = document.getElementById('root') as HTMLElement
const root = createRoot(container);
/*root.render(<App />);*/
root.render(<Provider store={store}>
                <App/>
            </Provider>);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
/*serviceWorker.unregister();*/


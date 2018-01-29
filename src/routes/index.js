import Root from './Root';
import NotFound from '../components/NotFound';
import App from '../components/App';

module.exports = {
    childRoutes: [{
        path: '/',
        component: Root,
        indexRoute: {
            component: App
        },
        childRoutes: [{
            path: '/',
            component: App,
        }, {
            path: '/not-found',
            component: NotFound
        }]
    }, {
        path: '*',
        onEnter: (nextState, replace) => {
            replace('/not-found');
        }
    }]
};

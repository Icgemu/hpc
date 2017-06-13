import React from 'react'
import ReactDOM from 'react-dom'
import {
    Router,
    Route,
    IndexRoute,
    Redirect,
    IndexRedirect,
    hashHistory
} from 'react-router'
import {Provider} from 'react-redux'
import {addTab, activeUrl} from '../reducers/index'
import store from './store'

import Tabs from '../tabs/Tabs'
import StatefulContainer from '../container/Container'
import {AppConfig} from '../app/AppConfig'

const onRouteEnter = function(e, item) {
    let path = e.location.pathname;
    item = {
        path,
        id: item.id,
        title: item.title
    };
    store.dispatch(addTab(item));
    if (AppConfig.navibar) {
        store.dispatch(activeUrl(path))
    }
}

const renderRoot = function(config) {
    let index;
    if (config.indexRoute) {
        index = <IndexRedirect to={config.indexRoute}/>
    }
    let navi = renderNavi(config);
    let root = (
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path={config.path} component={config.naviTo}>
                    {index}
                    {navi}
                </Route>
            </Router>
        </Provider>
    )
    return root;
}

const renderNavi = function(config) {
    if (config.navibar && config.leftbar) {
        return config.childs.map(child => {

            let index;
            if (child.indexRoute) {
                index = <IndexRedirect to={child.indexRoute}/>
            }
            let left = renderLeftbar(child.navibar.path, child.leftbar)
            let route = renderLeftbar(child.navibar.path, child.router)

            let bar = [...child.leftbar];
            let parentRoute = config.path + child.navibar.path + "/"
            bar.map((group, i) => {
                group.childs.map(route => {
                    route.path = parentRoute + route.path
                })
            })
            let DerivedContainer = ({
                children,
                ...props
            }) => {
                let leftbar = <Tabs links={child.leftbar}/>
                return (
                    <StatefulContainer left={leftbar} {...props}>
                        {children}
                    </StatefulContainer>
                )
            }

            let root = (
                <Route path={child.navibar.path} component={DerivedContainer}>
                    {index}
                    {left}
                    {route}
                </Route>
            );

            return root;
        });
    } else if (!config.leftbar) {

        return config.childs.map((child, i) => {
            let Comp = child.naviTo
            let DerivedContainer = ({
                children,
                ...props
            }) => {
                return (
                    <StatefulContainer {...props}>
                        <Comp/>
                    </StatefulContainer>
                )
            }
            let root = (<Route path={child.path} component={DerivedContainer} onEnter={(nextloc) => {
                onRouteEnter(nextloc, {
                    id: `${child.path}.${i}`,
                    title: `${child.title}`
                })
            }}/>)
            return root
        })
    } else {
        let left = renderLeftbar(config.path, config.childs)

        // let bar = [...config.childs];
        // let parentRoute = config.path
        // bar.map((group, i) => {
        //     group.childs.map(route => {
        //         route.path = parentRoute + route.path
        //     })
        // })
        let leftbar = <Tabs links={config.childs}/>
        let DerivedContainer = ({
            children,
            ...props
        }) => {
            return (
                <StatefulContainer left={leftbar} {...props}>
                    {children}
                </StatefulContainer>
            )
        }

        // let route = [...config.route];
        // route.map((item, i) => {        
        //     item.path = parentRoute + item.path           
        // })

        let hiddenRoute = renderLeftbar(config.path, config.route)
        let root = (
            <Route path={config.path} component={DerivedContainer}>
                {left}
                {hiddenRoute}
            </Route>
        );

        return root;
    }
}

const renderLeftbar = function(parent, routes) {
    let r = [];
    routes.map((child, i) => {
        if (!child.group) {
            child.id = `${parent}.${child.path}.${i}`;
            r.push(child);
        } else {
            child.childs.map((route, j) => {
                route.id = `${parent}.${route.path}.${i}.${j}`;
                r.push(route);
            })
        }

    });

    return r.map(route => {
        return (<Route path={route.path} component={route.naviTo} onEnter={(nextloc) => {
            onRouteEnter(nextloc, {
                id: `${route.id}`,
                title: `${route.title}`
            })
        }}/>)
    })
}

ReactDOM.render(renderRoot(AppConfig),document.body);

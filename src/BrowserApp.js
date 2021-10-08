import React, { Component } from 'react'
import { HashRouter,BrowserRouter, Switch, Route } from 'react-router-dom'
//import { TransitionGroup, Transition } from "react-transition-group";

import Minter from "./Minter";
import Store from "./Store-nftport";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="app">
         

<Route render={({location}) => 
{
    const { pathname, key } = location
       
    return (   <Switch location={location}>
                    <Route exact path="/"   component={Store}  />
                    <Route path="/store"     component={Store} />
                    <Route path="/mint"     component={Minter} />
                </Switch>

          )
}} />

        </div>
      </BrowserRouter>
    )
  }


}


export default App;


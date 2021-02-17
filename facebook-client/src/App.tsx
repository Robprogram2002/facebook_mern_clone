import { useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
  }, []);

  if (!false) {
    return (
      <Switch>
        <Route path="/login" exact />
        <Redirect to="/login" />
      </Switch>
    );
  }

  return (
    <>
      {/* <Navigation /> */}
      <Switch>
        <Route path="/" exact />
        <Route path="/user/:id" />
        <Redirect to="/" />
      </Switch>
    </>
  );
}

export default App;

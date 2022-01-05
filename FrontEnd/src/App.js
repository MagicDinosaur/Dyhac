import {
    Switch,
    Route,
} from "react-router-dom";
import Welcome from "./component/screen/Welcome";
import Room from "./component/screen/Room";

export default function App() {
    return (
        <div>
            <Switch>
                <Route path="/:id">
                    <Room/>
                </Route>
                <Route path="/">
                    <Welcome/>
                </Route>
            </Switch>
        </div>
    );
}
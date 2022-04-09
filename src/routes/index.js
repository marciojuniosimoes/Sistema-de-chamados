import Route from './Route';
import SingUp from '../pages/SingUp';
import SingIn from '../pages/SingIn';
import DashBoard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import { Switch } from 'react-router-dom';

export default function Router() {
  return (
    <Switch>
      <Route exact path='/' component={SingIn} />
      <Route exact path='/register' component={SingUp} />
      <Route exact path='/dashboard' component={DashBoard} isPrivate />
      <Route exact path='/profile' component={Profile} isPrivate />
    </Switch>
  );
}

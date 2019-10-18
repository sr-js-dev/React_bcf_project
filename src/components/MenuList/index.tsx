import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import ServiceIcon from '@material-ui/icons/GroupWork';
import HelpIcon from '@material-ui/icons/Help';
import HomeIcon from '@material-ui/icons/Home';
import MessageIcon from '@material-ui/icons/Message';
import PagesIcon from '@material-ui/icons/Pages';
import SettingsIcon from '@material-ui/icons/Settings';
import WidgetsIcon from '@material-ui/icons/Widgets';
import clx from 'clsx';
import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { UserProfile } from 'types/global';

import auth0Client from 'services/auth0/auth';
import styles from './MenuList.style';

interface ConnectedMenuListProps {
  classes: any;
  userProfile: UserProfile;
  location: Location;
}

class MenuList extends React.Component<ConnectedMenuListProps> {
  render() {
    const { classes, userProfile, location } = this.props;
    const pathname = location.pathname;

    if (!auth0Client.isAuthenticated())
      return (
        <List>
          <ListItem
            button
            component={Link}
            to="/"
            className={pathname === '/' ? classes.selectedStyle : ''}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" className={classes.listItemText} />
          </ListItem>
        </List>
      );

    const roles = userProfile.user_metadata.roles;

    return (
      <List>
        <ListItem
          button
          component={Link}
          to="/"
          className={pathname === '/' ? classes.selectedStyle : ''}
        >
          <ListItemIcon>
            <HomeIcon
              color="secondary"
              className={clx({
                [classes.activeIcon]: pathname === '/',
                [classes.nonactiveIcon]: pathname !== '/',
              })}
            />
          </ListItemIcon>
          <ListItemText primary="Home" className={classes.listItemText} />
        </ListItem>
        {(roles.includes('Gen') ||
          roles.includes('GenSub') ||
          roles.includes('SuperAdmin')) && (
            <ListItem
              button
              component={Link}
              to="/gen-contractor"
              className={clx({
                [classes.selectedStyle]: pathname.includes('/gen-contractor'),
              })}
            >
              <ListItemIcon>
                <MessageIcon
                  color="secondary"
                  className={clx({
                    [classes.activeIcon]: pathname.includes('/gen-contractor'),
                    [classes.nonactiveIcon]: !pathname.includes('/gen-contractor'),
                  })}
                />
              </ListItemIcon>
              <ListItemText
                primary="General Contractor"
                className={classes.listItemText}
              />
            </ListItem>
          )}
        {(roles.includes('Sub') ||
          roles.includes('GenSub') ||
          roles.includes('SuperAdmin')) && (
            <ListItem
              button
              component={Link}
              to="/s_cont"
              className={clx({
                [classes.selectedStyle]: pathname.includes('/s_cont'),
              })}
            >
              <ListItemIcon>
                <ServiceIcon
                  color="secondary"
                  className={clx({
                    [classes.activeIcon]: pathname.includes('/s_cont'),
                    [classes.nonactiveIcon]: !pathname.includes('/s_cont'),
                  })}
                />
              </ListItemIcon>
              <ListItemText
                primary="Sub Contractor"
                className={classes.listItemText}
              />
            </ListItem>
          )}
        {(roles.includes('Gen') ||
          roles.includes('GenSub') ||
          roles.includes('SuperAdmin')) && (
            <ListItem
              button
              component={Link}
              to="/b_list"
              className={clx({
                [classes.selectedStyle]: pathname.includes('/b_list'),
              })}
            >
              <ListItemIcon>
                <HelpIcon
                  color="secondary"
                  className={clx({
                    [classes.activeIcon]: pathname.includes('/b_list'),
                    [classes.nonactiveIcon]: !pathname.includes('/b_list'),
                  })}
                />
              </ListItemIcon>
              <ListItemText
                primary="Bidder Listing"
                className={classes.listItemText}
              />
            </ListItem>
          )}
        {(roles.includes('Sub') ||
          roles.includes('GenSub') ||
          roles.includes('SuperAdmin')) && (
            <ListItem
              button
              component={Link}
              to="/projects"
              className={clx({
                [classes.selectedStyle]: pathname.includes('/projects'),
              })}
            >
              <ListItemIcon>
                <WidgetsIcon
                  color="secondary"
                  className={clx({
                    [classes.activeIcon]: pathname.includes('/projects'),
                    [classes.nonactiveIcon]: !pathname.includes('/projects'),
                  })}
                />
              </ListItemIcon>
              <ListItemText primary="Projects" className={classes.listItemText} />
            </ListItem>
          )}
        {(roles.includes('Admin') || roles.includes('SuperAdmin')) && (
          <ListItem
            button
            component={Link}
            to="/m_temp"
            className={clx({
              [classes.selectedStyle]: pathname.includes('/m_temp'),
            })}
          >
            <ListItemIcon>
              <PagesIcon
                color="secondary"
                className={clx({
                  [classes.activeIcon]: pathname.includes('/m_temp'),
                  [classes.nonactiveIcon]: !pathname.includes('/m_temp'),
                })}
              />
            </ListItemIcon>
            <ListItemText
              primary="Manage Templates"
              className={classes.listItemText}
            />
          </ListItem>
        )}
        {(roles.includes('Admin') || roles.includes('SuperAdmin')) && (
          <ListItem
            button
            component={Link}
            to="/m_cont"
            className={clx({
              [classes.selectedStyle]: pathname.includes('/m_cont'),
            })}
          >
            <ListItemIcon>
              <SettingsIcon
                color="secondary"
                className={clx({
                  [classes.activeIcon]: pathname.includes('/m_cont'),
                  [classes.nonactiveIcon]: !pathname.includes('/m_cont'),
                })}
              />
            </ListItemIcon>
            <ListItemText
              primary="Manage Contractor"
              className={classes.listItemText}
            />
          </ListItem>
        )}
        {(roles.includes('Admin') || roles.includes('SuperAdmin')) && (
          <ListItem
            button
            component={Link}
            to="/m_spec"
            className={clx({
              [classes.selectedStyle]: pathname.includes('/m_spec'),
            })}
          >
            <ListItemIcon>
              <PagesIcon
                color="secondary"
                className={clx({
                  [classes.activeIcon]: pathname.includes('/m_spec'),
                  [classes.nonactiveIcon]: !pathname.includes('/m_spec'),
                })}
              />
            </ListItemIcon>
            <ListItemText
              primary="Manage Specialty"
              className={classes.listItemText}
            />
          </ListItem>
        )}
      </List>
    );
  }
}

const mapStateToProps = state => ({
  userProfile: state.global_data.userProfile,
});

export default compose(
  withRouter,
  connect(mapStateToProps),
  withStyles(styles)
)(MenuList);

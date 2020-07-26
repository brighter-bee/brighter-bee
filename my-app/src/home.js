import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

// icons 
import ForumIcon from '@material-ui/icons/Forum';
import WorkIcon from '@material-ui/icons/Work';
import BuildIcon from '@material-ui/icons/Build';
import GroupIcon from '@material-ui/icons/Group';
import AssessmentIcon from '@material-ui/icons/Assessment';

// routes
import {Route, Switch ,useRouteMatch,Link,withRouter,useParams} from 'react-router-dom';
import ForumsPage from './forum';
import FindJobsPage from './findJobs';
import SkillRecommend from './skillRecommend';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

function ClippedDrawer() {
  const classes = useStyles();

  let { path, url } = useRouteMatch();

  const ALL_PAGES = [
    {name:'Forum',icon:<ForumIcon />,urlVal:url + '/forums'},
    {name:'Find Jobs',icon:<WorkIcon />,urlVal:url + '/findjobs'}, 
    {name:'Skill Up',icon:<BuildIcon />,urlVal:url + '/skillup'}, 
    {name:'Set Up Meeting',icon:<GroupIcon />,urlVal:url + '/meetings'},
    {name:'Find Projects', icon:<AssessmentIcon />,urlVal:url + '/findprojects'}
   ];

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Brighter Bee
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {ALL_PAGES.map((text, index) => (
              <ListItem button component={Link} to={text.urlVal}>
                <ListItemIcon>{text.icon}</ListItemIcon>
                <ListItemText primary={text.name} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
           
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
          <Switch>
              <Route exact path={path}>
                <ForumsPage/>
              </Route>
              <Route exact path={`${path}/forums`}>
                <ForumsPage/>
              </Route>
              <Route path={`${path}/skillup`}>
                <SkillRecommend/>
              </Route>
              <Route path={`${path}/findjobs`}>
                <FindJobsPage/>
              </Route>
              <Route path={`${path}/meetings`}>
                <SkillRecommend/>
              </Route>
              <Route path={`${path}/findprojects`}>
                <SkillRecommend/>
              </Route>
          </Switch>
      </main>
    </div>
  );
}

export default (withRouter)(ClippedDrawer);
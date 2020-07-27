import React,{useEffect,useState} from 'react';
import { fade,makeStyles } from '@material-ui/core/styles';
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

// search
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(25),
      width: 'auto',
    },
  },
  searchBtn:{
    color:'white',
    backgroundColor:'inherit',
    borderColor:'white',
    border:'1px solid white',
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '60ch',
    },
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

function ClippedDrawer(props) {
  const classes = useStyles();

  let { path, url } = useRouteMatch();
  
  const [showSearch, setshowSearch] = useState(false);

  useEffect(() => {
   props.location.pathname.includes('findjobs') ? setshowSearch(true):setshowSearch(false);
  }, [props.location]);

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
          { showSearch && <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>}
          {showSearch && <Button className={classes.searchBtn} >Search</Button>}
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

export default withRouter(ClippedDrawer);
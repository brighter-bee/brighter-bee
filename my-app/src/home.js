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
import AccountBoxIcon from '@material-ui/icons/AccountBox';

// routes
import {Route, Switch ,useRouteMatch,Link,withRouter,useParams} from 'react-router-dom';
import ForumsPage from './forum';
import FindJobsPage from './findJobs';
import SkillRecommend from './skillRecommend';
import Meetings from './meetings';
import Profile from './Profile';
import FindProjectsPage from './findProjects';
import Meetings from './meetings';

// search
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import Axios from 'axios';

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
  const [username, setuserName] = useState(localStorage.getItem('user'));

  const [showSearch, setshowSearch] = useState(false);

  const [searchValue, setSearchValue] = useState('');

  const [jobList, setJobList] = useState([])

  const updateSearchValue = (event) =>{
    setSearchValue(event.target.value);
  }

  const getJobs = () => {
    const API_URL =  'https://api.adzuna.com/v1/api/jobs/au/search/1?app_id=170a278c&app_key=14c6ba39db072dd540d0dfdb40e57c12&what='+ searchValue;
    Axios.get(API_URL).then((resp)=>{
      setJobList([...resp.data.results])
      console.log(resp.data.results);
    });
  }

  useEffect(() => {
   if(props.location.pathname.includes('findjobs')){
    setshowSearch(true);
    getJobs();
   }else{
    setshowSearch(false);
   }
  }, [props.location]);

  const ALL_PAGES = [
    {name:'Forum',icon:<ForumIcon />,urlVal:url + '/forums'},
    {name:'Find Jobs',icon:<WorkIcon />,urlVal:url + '/findjobs'},
    {name:'Skill Up',icon:<BuildIcon />,urlVal:url + '/skillup'},
    {name:'Set Up Meeting',icon:<GroupIcon />,urlVal:url + '/meetings'},
    {name:'Find Projects', icon:<AssessmentIcon />,urlVal:url + '/findprojects'},
    {name:'My Profile', icon:<AccountBoxIcon />,urlVal:url + '/profile'}
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
              onKeyUp = {updateSearchValue}
            />
          </div>}
          {showSearch && <Button onClick={getJobs} className={classes.searchBtn} >Search</Button>}
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
              <ListItem key={text.name} button component={Link} to={text.urlVal}>
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
                <ForumsPage username={username}/>
              </Route>
              <Route path={`${path}/skillup`}>
                <SkillRecommend username={username}/>
              </Route>
              <Route path={`${path}/findjobs`}>
                <FindJobsPage jobs={jobList} username={username}/>
              </Route>
              <Route path={`${path}/meetings`}>
                <Meetings/>
              </Route>
              <Route path={`${path}/findprojects`}>
                <FindProjectsPage username={username}/>
              </Route>
              <Route path={`${path}/profile`}>
                <Profile />
              </Route>
          </Switch>
      </main>
    </div>
  );
}

export default withRouter(ClippedDrawer);
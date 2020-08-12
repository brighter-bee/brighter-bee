import React, {useEffect, useState} from 'react';
import {fade, makeStyles} from '@material-ui/core/styles';
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
import {Route, Switch, useRouteMatch, Link, withRouter, useParams} from 'react-router-dom';
import ForumsPage from './forum';
import FindJobsPage from './findJobs';
import SkillRecommend from './skillRecommend';
import Meetings from './meetings';
import AddMeeting from './addMeeting';

import Profile from './Profile';
import NewProject from "./NewProject";
import FindProjectsPage from './findProjects';

// search
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import Axios from 'axios';
import Grid from "@material-ui/core/Grid";

// native
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Mentors from "./Mentors";



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
    searchBtn: {
        color: 'white',
        backgroundColor: 'inherit',
        borderColor: 'white',
        border: '1px solid white',
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

    let {path, url} = useRouteMatch();
    const [username, setuserName] = useState(localStorage.getItem('user'));

    const [showSearch, setshowSearch] = useState(false);

    const [searchValue, setSearchValue] = useState('');

    const [jobList, setJobList] = useState([])

    const [savedjobList, setsavedJobList] = useState([]);

    const [opsList, setopsList] = useState([]);

    const [anchorEl, setAnchorEl] = React.useState(null);

    const open = Boolean(anchorEl);

    const handleClose = () => {
        setAnchorEl(null);
      };

      const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
      };

    const updateSearchValue = (event) => {
        setSearchValue(event.target.value);
    }

    const getJobs = () => {
        const API_URL = 'https://api.adzuna.com/v1/api/jobs/au/search/1?app_id=170a278c&app_key=14c6ba39db072dd540d0dfdb40e57c12&what=' + searchValue;
        Axios.get(API_URL).then((resp) => {
            setJobList([...resp.data.results])
        });
    }

    const getSavedJobs = () => {
        Axios.get('http://localhost:8000/api/v2/persons?user=' + localStorage.getItem('user'))
            .then((resp) => {
                // get all save opportunities of user

                if (resp.data[0].opportunities.length) {

                    let ops = resp.data[0].opportunities.join(',')
                    let opsArray = []

                    // covert array to string
                    Axios.get('http://localhost:8000/api/opportunity/?id=' + ops)
                        .then((resp) => {
                            resp.data.forEach((job) => {
                                opsArray.push({
                                    adref: job.id,
                                    title: job.name,
                                    description: job.desc,
                                    company: {
                                        display_name: job.company_name
                                    },
                                    location: {
                                        display_name: job.location
                                    },
                                    redirect_url: job.link
                                })
                            })
                            setsavedJobList(opsArray)
                        })
                } else {
                    setsavedJobList([])
                }
            })
    }

    const logout = () => {
        // login
        if (!localStorage.getItem("user")) {
            document.location = '/';
            return;
        }

        // logout
        let response = window.confirm("Are you sure to logout?");
        if (response === false) {
            return;
        }
        document.location = '/';
        localStorage.removeItem("user");
    };

    useEffect(() => {
        if (props.location.pathname.includes('findjobs')) {
            setshowSearch(true);
            getJobs();
        } else if (props.location.pathname.includes('savedjobs')) {
            getSavedJobs();
            setshowSearch(false);
        } else {
            setshowSearch(false);
        }
    }, [props.location]);

    const ALL_PAGES = [

        {name: 'Find Jobs', icon: <WorkIcon/>, urlVal: url + '/findjobs'},
        {name: 'Saved Jobs', icon: <WorkIcon/>, urlVal: url + '/savedjobs'},
        {name: 'Find Projects', icon: <AssessmentIcon/>, urlVal: url + '/findprojects'},
        {name: 'Add Project', icon: <AssessmentIcon/>, urlVal: url + '/addproject'},
        {name: 'Skill Up', icon: <BuildIcon/>, urlVal: url + '/skillup'},
        {name: 'Scheduled Meetings', icon: <GroupIcon/>, urlVal: url + '/meetings'},
        {name: 'Create Meeting', icon: <GroupIcon/>, urlVal: url + '/addMeeting'},
        {name: 'Forum', icon: <ForumIcon/>, urlVal: url + '/forums'},
        {name: 'Find mentors', icon: <GroupIcon/>, urlVal: url + '/mentors'},
        // {name: 'My Profile', icon: <AccountBoxIcon/>, urlVal: url + '/profile'}

    ];

    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>

                        <Typography variant="h6" noWrap>
                            Brighter Bee
                        </Typography>

                        {showSearch && <div className={classes.search}>
                            <div className={classes.searchIcon}>
                                <SearchIcon/>
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                inputProps={{'aria-label': 'search'}}
                                onKeyUp={updateSearchValue}
                            />
                        </div>}

                        {showSearch && <Button onClick={getJobs} className={classes.searchBtn}>Search</Button>}
                        <div style={{position:"absolute",right:'1rem'}}>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={() => {window.location = '/home/profile'}}>Profile</MenuItem>
                <MenuItem onClick={logout}>{localStorage.getItem("user") ? 'Logout' : 'Login'}</MenuItem>
              </Menu>
            </div>
                        {/* <span>
                            <Button variant="contained"  className={classes.searchBtn} href={url + '/profile'}>My Profile</Button>
                            <Button variant="contained"  className={classes.searchBtn} onClick={logout}>
                                {localStorage.getItem("user") ? 'Logout' : 'Login'}
                            </Button>
                        </span> */}

                </Toolbar>
            </AppBar>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar/>
                <div className={classes.drawerContainer}>
                    <List>
                        {ALL_PAGES.map((text, index) => (
                            <ListItem key={text.name} button component={Link} to={text.urlVal}>
                                <ListItemIcon>{text.icon}</ListItemIcon>
                                <ListItemText primary={text.name}/>
                            </ListItem>
                        ))}
                    </List>
                    <Divider/>
                    <List>

                    </List>
                </div>
            </Drawer>
            <main className={classes.content}>
                <Toolbar/>
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
                        <FindJobsPage opsList={opsList} jobs={jobList} username={username}/>
                    </Route>
                    <Route path={`${path}/savedjobs`}>
                        <FindJobsPage handlePageRefresh={getSavedJobs} jobs={savedjobList} delete={true} username={username}/>
                    </Route>
                    <Route path={`${path}/meetings`}>
                        <Meetings/>
                    </Route>
                    <Route path={`${path}/addMeeting`}>
                        <AddMeeting/>
                    </Route>
                    <Route path={`${path}/findprojects`}>
                        <FindProjectsPage username={username}/>
                    </Route>
                    <Route path={`${path}/addproject`}>
                        <NewProject username={username}/>
                    </Route>
                    <Route path={`${path}/mentors`}>
                        <Mentors/>
                    </Route>
                    <Route path={`${path}/profile`}>
                        <Profile/>
                    </Route>
                </Switch>
            </main>
            {showSearch && <h1>hello</h1>}
        </div>
    );
}

export default withRouter(ClippedDrawer);

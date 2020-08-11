import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import axios from "axios";
import TextField from '@material-ui/core/TextField';

import Box from '@material-ui/core/Box';
import CategorySelect from "./forum_category_selection";
import Pagination from "@material-ui/lab/Pagination/Pagination";
import Grid from "@material-ui/core/Grid/Grid";
import PostDetailDialog from "./posts_and_detail";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// export default function CreatePostDialog() {
class CreatePostDialog extends React.Component {
    constructor(props){
    super(props);
    this.state = {
        open_01: false,
        open_02: false,
        title: '',
        content: '',
        myPosts: [],
        currentPage: 1,
        count : 0,
    };

    this.modules = {
        toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
    ],
  };

  this.formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    // this.componentDidMount = this.componentDidMount.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this)
    }


    handleClick_01 = () => {
        axios.post("http://127.0.0.1:8000/forum/", {
            title: this.state.title,
            content: this.state.content,
            poster: localStorage.getItem('user'),
            category: 1
        }).then(res => {
            console.log(res);
            window.location.pathname = "/home/forums/";
            alert('post successfully')
        }).catch(err => {
            console.log(err);
            alert('error!!!')
        });
    }

    handleClickOpen_01 = () => {
        this.setState({
            open_01: true
        })
    };

    handleClose_01 = () => {
        this.setState({
            open_01: false
        })
    };

    handleClickOpen_02 = () => {
        this.setState({
            open_02: true
        })
    };

    handleClose_02 = () => {
        this.setState({
            open_02: false
        })
    };

    handleTitleChange (event){
        this.setState({
            title: event.target.value
        })
    };

    handleContentChange (value){
        this.setState({
            content: value
        })
    };

    componentDidMount () {
        axios.get("http://127.0.0.1:8000/myPosts/"+localStorage.getItem('user')+"", {
            params:{
                page: this.state.currentPage,
            }
        }).then(res => {
            this.setState({
                myPosts: res.data,
                count: res.data[0].count,
            });
        }).catch(err => {
            console.log(err);
        })
    }

    handlePageChange(event, page) {
        this.setState({
            currentPage: page,
        }, ()=> {
            this.componentDidMount ()
        });
    }


    render() {
        return (
            <div>
                <div>
                    <Button variant="outlined" color="primary" onClick={this.handleClickOpen_01}>
                        New Post
                    </Button>
                    <Button variant="outlined" color="primary" style={{position: 'relative', left: '80%',}}
                            onClick={this.handleClickOpen_02}>
                        My Posts
                    </Button>
                </div>

                <Dialog fullScreen open={this.state.open_01} onClose={this.handleClose_01} TransitionComponent={Transition}>
                    <AppBar style={{position: 'relative'}}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={this.handleClose_01} aria-label="close">
                                <CloseIcon/>
                            </IconButton>
                            <Box mx="auto" p={1}>
                                <Typography variant="h6">
                                    Create a new post
                                </Typography>
                            </Box>
                            <Button autoFocus color="inherit" onClick={this.handleClick_01}>
                                Save
                            </Button>
                        </Toolbar>
                    </AppBar>

                    <Box mx="auto" p={10} style={{width:600}}>
                        <form style={{width:500}} fullWidth={true}  noValidate autoComplete="off">
                            <TextField label="Title" style={{width:400}} placeholder="Title" multiline
                            value={this.state.title} onChange={this.handleTitleChange}
                            />
                            <br/>
                            <br/>
                            <CategorySelect></CategorySelect>
                            <br/>
                            <br/>
                            <ReactQuill
                                theme="snow"
                                modules={this.modules}
                                formats={this.formats}
                                style={{height:300, width:600}}
                                value={this.state.content}
                                onChange={this.handleContentChange}>
                            </ReactQuill>
                        </form>
                    </Box>
                </Dialog>

                <Dialog fullScreen open={this.state.open_02} onClose={this.handleClose_02} TransitionComponent={Transition}>
                    <AppBar style={{position: 'relative'}}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={this.handleClose_02} aria-label="close">
                                <CloseIcon/>
                            </IconButton>
                            <Box mx="auto" p={1}>
                                <Typography variant="h6">
                                    My Posts
                                </Typography>
                            </Box>
                        </Toolbar>
                    </AppBar>

                    <div style={{marginLeft: 100, marginRight: 100, marginTop: 80}}>
                        <Grid >
                            <PostDetailDialog data={this.state.myPosts} />
                            <br/>
                            <Pagination count={this.state.count} color="primary" style={{position:'relative',
                                        left:'70%'}} page={this.state.currentPage} onChange={this.handlePageChange}
                                        showFirstButton showLastButton />
                        </Grid>
                    </div>

                </Dialog>
            </div>
        );
    }
}

export default (CreatePostDialog);

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import CardActionArea from "@material-ui/core/CardActionArea/CardActionArea";
import Card from "@material-ui/core/Card/Card";
import Avatar from "@material-ui/core/Avatar/Avatar";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import moment from 'moment';
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import IconButton from "@material-ui/core/IconButton/IconButton";
import CloseIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Box from "@material-ui/core/Box/Box";
import axios from "axios";
import Grid from "@material-ui/core/Grid/Grid";
import CommentList from "./reply_list";
import Pagination from "@material-ui/lab/Pagination/Pagination";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import ReactQuill from "react-quill";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// export default function CreatePostDialog() {
class PostDetailDialog extends React.Component {
    constructor(props){
    super(props);
    this.state = {
        open_01: false,
        currentPost: [],
        replyList: [],
        currentPage: 1,
        count: 0,
        open_02: false,
        content: '',
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


    this.handleClickOpen_01 = this.handleClickOpen_01.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);

    this.handleClickOpen_02 = this.handleClickOpen_02.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    // this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount () {
        axios.get("http://127.0.0.1:8000/reply/", {
            params:{
                post: 1,
                page: this.state.currentPage,
            }
        }).then(res => {
            this.setState({
                replyList: res.data,
                count: res.data[0].count,
            });

        }).catch(err => {
            console.log(err);
        })
    }

    handlePageChange(event, value) {
        this.setState({
            currentPage: value,
        },()=> {
                this.componentDidMount();
            });
    }


    handleClickOpen_01 (id) {
        this.setState({
            open_01: true,
        });
        axios.get("http://127.0.0.1:8000/forum/"+id+"/").then(res => {
            this.setState({
                currentPost: res.data,
            });
        }).catch(err => {
            console.log(err);
        })
    };

    handleClose_01 = () => {
        this.setState({
            open_01: false
        })
    };


    handleClickOpen_02 () {
        this.setState({
            open_02: true
        });
    };

    handleClose_02 = () => {
        this.setState({
            open_02: false
        })
    };

    handleContentChange (value){
        this.setState({
            content: value
        })
    };

    handleSubmit = () => {
        axios.post("http://127.0.0.1:8000/reply/", {
            content: this.state.content,
            poster: 1,
            post: 1,
        }).then(res => {
            console.log(res);
            // window.location.pathname = "/home/forums/";
            alert('post successfully');
            this.setState({
                open_02: false,
            })
            this.componentDidMount();
        }).catch(err => {
            console.log(err);
            alert('error!!!')
        });
    }

    render() {
        //generate the post list in the forum home page
        const post_list = this.props.data.map(post =>
            <CardActionArea key={post.id} component="a" onClick={()=>this.handleClickOpen_01(post.id) }>
                <Card style={{display: 'flex',}} variant="outlined">
                    <div style={{flex: 1}} >
                        <Avatar style={{ color: "orange", marginLeft:20, marginTop:10}}></Avatar>
                        <Typography variant="h8" component="h3" style={{marginLeft:20, marginTop:5}}>
                            {post.title}
                        </Typography>
                        <Typography variant="subtitle1" paragraph component="h7" >
                            <div style={{marginLeft:20}} dangerouslySetInnerHTML={{__html:post.content.length>180 ? post.content.substr(0, 180) + "..." : post.content}}></div>
                        </Typography>

                        <Typography variant="subtitle1" color="textSecondary" style={{position: 'relative',
                            left: '80%',}} component="h5">
                            {moment(post.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                        </Typography>
                    </div>
                </Card>
            </CardActionArea>
        );

        return (
            <div>
                <div>
                    {post_list}
                </div>

                <Dialog fullScreen open={this.state.open_01} onClose={this.handleClose_01} TransitionComponent={Transition}>
                    <AppBar style={{position: 'relative'}}>
                        <Toolbar>
                            <IconButton edge="start" color="inherit" onClick={this.handleClose_01} aria-label="close">
                                {"Close"}<CloseIcon/>
                            </IconButton>
                            <Box mx="auto" p={1}>
                                <Typography variant="h4">
                                    {this.state.currentPost.title}
                                </Typography>
                            </Box>
                        </Toolbar>
                    </AppBar>

                    <div className="archive-list-area" style={{marginTop: 30, marginRight:50, marginLeft:50}}>
                        <div className="archive-list">
                            <div className="article-time">
                                <br/>
                                {this.state.currentPost.poster}
                                {moment(this.state.currentPost.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                            </div>
                            <div className="article-detail" >
                                <div dangerouslySetInnerHTML={{__html:this.state.currentPost.content}}></div>
                            </div>
                        </div>
                    </div>


                    <div style={{marginLeft: 80, marginTop:20}}>
                        <Button variant="outlined" color="primary" onClick={this.handleClickOpen_02}>
                        Comment
                        </Button>
                        <Dialog open={this.state.open_02} onClose={this.handleClose_02} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">Write Your Comment</DialogTitle>
                            <DialogContent style={{width: 650, height: 380}}>
                            <ReactQuill
                                theme="snow"
                                modules={this.modules}
                                formats={this.formats}
                                style={{height: 300, width: 500}}
                                value={this.state.content}
                                onChange={this.handleContentChange}>
                            </ReactQuill>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleClose_02} color="primary">
                                Cancel
                                </Button>
                                <Button onClick={this.handleSubmit} color="primary">
                                Submit
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    <br/>

                    <Grid style={{marginLeft:60, marginRight:60, marginTop:5}}>
                    <CommentList data={this.state.replyList}/>
                    <br/>
                    <Pagination count={this.state.count} color="primary" style={{position: 'relative',
                                left: '65%',}} page={this.state.currentPage} onChange={this.handlePageChange}

                                showFirstButton showLastButton />
                    <br/>
                    </Grid>

                </Dialog>
            </div>
        );
    }
}

export default (PostDetailDialog);

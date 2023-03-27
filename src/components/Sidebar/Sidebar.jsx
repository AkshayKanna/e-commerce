import React, { useState, useEffect } from 'react';
import {
    Stack, AppBar, Box, CssBaseline, Divider, IconButton, Drawer, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Avatar, InputBase, Card,
    CardActions, CardContent, CardMedia, styled, Grid, TablePagination, Grow, Rating, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Alert, DialogContentText
} from '@mui/material';

// import { Carousel } from 'react-responsive-carousel';
// import "react-responsive-carousel/lib/styles/carousel.min.css";

import DashboardIcon from '@mui/icons-material/Dashboard';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import SellIcon from '@mui/icons-material/Sell';
import TvIcon from '@mui/icons-material/Tv';
import KitchenIcon from '@mui/icons-material/Kitchen';
import BookIcon from '@mui/icons-material/Book';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import LogoutIcon from '@mui/icons-material/Logout';
import LightModeIcon from '@mui/icons-material/LightMode';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { ThemeProvider } from '@mui/material/styles';
import listItemTheme from '../Sidebar/ListItemTheme';
import "./Sidebar.css";
import { makeStyles } from '@mui/styles';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import Logo from "../../assets/logo.jpg";
import ImagePlaceholder from "../../assets/imageplaceholder.jpg";
import { numberWithCommas } from "../../validator";

import { connect } from 'react-redux';
import { delete_product_data, get_product_data, post_product_data, update_product_data } from '../../redux/action';
import GlobalError from '../GlobalError/GlobalError';
import SimpleBackdrop from '../BackDrop/BackDrop';

const drawerWidth = 275;

/**
 * Custom styled component for Search bar
 */
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: 8,
    transition: "0.5s",
    backgroundColor: '#1A2536',
    '&:hover': {
        backgroundColor: '#1A2536',
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}));
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        fontSize: 16,
        // fontWeight: 600,
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
        [theme.breakpoints.up('lg')]: {
            width: '50ch',
        },
    },
}));

/**
 * Custom styled component to display all cards
 */
const StyledCard = styled(Card)(({ theme }) => ({
    borderRadius: "11px",
    boxShadow: 'none',
    backgroundColor: '#394B61',
    padding: "10px",
}));
const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
    height: 195,
    minHeight: 195,
    borderRadius: "0.5rem",
    cursor: "pointer"
}));
const StyledCardContent = styled(CardContent)(({ theme }) => ({
    padding: "10px 0px 0px 2px"
}));
const StyledCardActions = styled(CardActions)(({ theme }) => ({
    color: 'white',
    padding: 0
}));
const StyledCardIconButtons = styled(CardActions)(({ theme }) => ({
    padding: "5px"
}));

/**
 * Custom styled component to display a single card
 */
const StyledFullDetailViewCard = styled(Card)(({ theme }) => ({
    borderRadius: "11px",
    boxShadow: 'none',
    backgroundColor: '#394B61',
    // height: 350,
    // [theme.breakpoints.only("sm")]: {
    //     width: 300
    // },
    [theme.breakpoints.down("md")]: {
        minHeight: 350
    },
    [theme.breakpoints.up("md")]: {
        minHeight: 350
    },
}));
const StyledFullDetailViewCardMedia = styled(CardMedia)(({ theme }) => ({
    // height: 350,
    minHeight: 350,
    borderRadius: "0.5rem",
    [theme.breakpoints.only("sm")]: {
        display: "none"
    },
    [theme.breakpoints.down("md")]: {
        display: "none"
    },
    [theme.breakpoints.up("md")]: {
        // width: 350,
        minWidth: 350,
    },
    [theme.breakpoints.up("lg")]: {
        // width: 350,
        minWidth: 350,
    },
}));
const StyledFullDetailViewCardContent = styled(CardContent)(({ theme }) => ({
    margin: "0px",
}));

const useStyles = makeStyles({
    tablePaginationCaption: {
        color: 'white !important'
    },
    tablePaginationSelectIcon: {
        color: 'white !important',
    },
    tablePaginationSelect: {
        color: 'white'
    },
    tablePaginationActions: {
        color: 'white'
    },
    tablePaginationDisplay: {
        color: 'white'
    }
});

var filterSingleData = [];

const Sidebar = ({
    getProductData,
    allProductsData,
    postProductData,
    createdProductData,
    loader,
    error,
    updateProductData,
    updatedProductData,
    deleteProductData,
    deletedProductData
}) => {
    const classes = useStyles();
    const [currentPage, setCurrentPage] = useState(0);
    const [rowPerPage, setRowPerPage] = useState(6);
    const [singleProductData, setSingleProductData] = useState([]);
    const [fadeTimeout, setFadeTimeout] = useState(0);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [allPrdtData, setAllPrdtData] = useState([]);
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const [requiredFlag, setRequiredFlag] = React.useState(false);
    const [fields, setFields] = React.useState({
        title: "",
        brand: "",
        price: "",
        discountPercentage: "",
        rating: "",
        stock: "",
        description: ""
    });
    const [openError, setOpenError] = React.useState(false);
    const [isUpdate, setIsUpdate] = React.useState(false);
    const [productId, setProductId] = React.useState("");
    const [openVerificationDialog, setOpenVerificaitonDialog] = React.useState(false);

    useEffect(() => {
        error ? setOpenError(true) : setOpenError(false);
        if (error && error.indexOf('deleted') >= 0) {
            handleCloseVerification();
        }
    }, [error]);

    /**
     * Dynamic onChange function for the textfields
     */
    const handleChange = (e) => {
        if (e.type === "change") {
            setFields({
                ...fields,
                [e.target.id]: e.target.value,
            });
        }
    };

    /**
     * Function to create and update product detail pop up dialog
     */
    const handleClickOpen = () => {
        setOpen(true);
        setIsUpdate(false);
    };
    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpen(false);
        setIsUpdate(false);
    };

    /**
     * Function to open verification pop up dialog
     */
    const handleClickOpenVerification = () => {
        setOpenVerificaitonDialog(true);
    };
    const handleCloseVerification = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setOpenVerificaitonDialog(false);
    }

    /**
     * Function to call the get rain data from the server
     */
    useEffect(() => {
        getProductData();
    }, [getProductData]);

    useEffect(() => {
        if (createdProductData.length) {
            let data = allPrdtData.concat(createdProductData);
            setAllPrdtData(data);
        }
    }, [createdProductData]);

    useEffect(() => {
        if (Object.entries(updatedProductData).length > 0) {
            let modifiedData = allPrdtData.map(item => {
                if (item.id === updatedProductData.id) {
                    return {
                        ...item,
                        ...updatedProductData
                    }
                }
                return item;
            });
            setAllPrdtData(modifiedData);
        }
    }, [updatedProductData]);

    useEffect(() => {
        if (Object.entries(deletedProductData).length > 0) {
            const filteredRemProduct = allPrdtData.filter((item) => item.id !== deletedProductData.id);
            setAllPrdtData(filteredRemProduct);
        }
    }, [deletedProductData]);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    /**
     * Handle change function for the toggle button of the navigation menu 
     */
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    /**
     * Handle change function for the search 
     */
    const handleSearch = (event) => {
        setSearchValue(event.target.value);
    }

    useEffect(() => {
        if (searchValue !== '') {
            let arr = (allProductsData || []).filter(u =>
                u.title.toString().trim().toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
                u.category.toString().trim().toLowerCase().indexOf(searchValue.toLowerCase()) > -1 ||
                u.brand.toString().trim().toLowerCase().indexOf(searchValue.toLowerCase()) > -1
            );
            setAllPrdtData(arr);
        } else if (searchValue === "" || searchValue === null || searchValue === undefined) {
            setAllPrdtData(allProductsData);
        }
    }, [searchValue, allProductsData]);

    const filterParticularProductData = (title) => {
        setFadeTimeout(2000);
        filterSingleData = allPrdtData.filter(item => item.title === title);
        setSingleProductData([...filterSingleData]);
    };

    /**
     * Function to render the component of the side bar
     */
    const drawer = (
        <div>
            <Stack
                sx={{ width: "100%" }}
                direction="row"
                justifyContent="center"
                alignItems="center"
                style={{
                    margin: "1rem 0rem 1rem"
                }}
            >
                <Avatar
                    alt="Remy Sharp"
                    src={Logo}
                    sx={{ width: 100, height: 100 }}
                    style={{ cursor: "pointer" }}
                    onClick={() => setSingleProductData([])}
                />
            </Stack>
            <Stack
                sx={{ width: "100%" }}
                direction="row"
                justifyContent="center"
            >
                <Typography variant="h6" gutterBottom style={{
                    color: "white"
                }}>
                    E Commerce
                </Typography>
            </Stack>
            <Divider style={{ borderColor: "#394B61" }} />
            <ThemeProvider theme={listItemTheme}>
                <List>
                    {['Dashboard', 'Best Sellers', 'New Releases'].map((text, index) => (
                        <ListItem key={text} disablePadding>
                            <ListItemButton
                                selected={selectedIndex === index}
                                onClick={(event) => handleListItemClick(event, index)}>
                                <ListItemIcon style={{
                                    color: selectedIndex === index ? '#00E0FF' : "white"
                                }}>
                                    {
                                        text === "Dashboard" ? (
                                            <DashboardIcon />
                                        ) : text === "New Releases" ? (
                                            <NewReleasesIcon />
                                        ) : text === "Best Sellers" ? (
                                            <SellIcon />
                                        ) : null
                                    }
                                </ListItemIcon>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </ThemeProvider>
            <Divider style={{ borderColor: "#394B61" }} />
            <List>
                {['Electronics', 'Home, Kitchen', 'Books'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {
                                    text === "Electronics" ? <TvIcon /> :
                                        text === "Books" ? <BookIcon /> :
                                            <KitchenIcon />
                                }
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Divider style={{ borderColor: "#394B61" }} />
            <List>
                {['Your Account', 'Customer Service', 'Sign Out'].map((text, index) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                {
                                    text === "Your Account" ? <AccountCircleIcon />
                                        : text === "Customer Service" ? <SupportAgentIcon />
                                            : <LogoutIcon />
                                }
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    /**
     * Function to create the product
     */
    const createProductData = () => {
        let titleFlag = false;
        let brandFlag = false;
        let priceFlag = false;
        let ratingFlag = false;
        let quantityFlag = false;
        let discountFlag = false;

        if (fields.title === undefined || fields.title === null || fields.title === "") {
            titleFlag = true;
            setRequiredFlag(true);
            setTimeout(() => {
                setRequiredFlag(false);
            }, 2000);
        }
        if (fields.brand === undefined || fields.brand === null || fields.brand === "") {
            brandFlag = true;
            setRequiredFlag(true);
            setTimeout(() => {
                setRequiredFlag(false);
            }, 2000);
        }
        if (fields.price === undefined || fields.price === null || fields.price === "") {
            priceFlag = true;
            setRequiredFlag(true);
            setTimeout(() => {
                setRequiredFlag(false);
            }, 2000);
        }
        if (fields.rating === undefined || fields.rating === null || fields.rating === "") {
            ratingFlag = true;
            setRequiredFlag(true);
            setTimeout(() => {
                setRequiredFlag(false);
            }, 2000);
        }
        if (fields.stock === undefined || fields.stock === null || fields.stock === "") {
            quantityFlag = true;
            setRequiredFlag(true);
            setTimeout(() => {
                setRequiredFlag(false);
            }, 2000);
        }
        if (fields.discountPercentage === undefined || fields.discountPercentage === null || fields.discountPercentage === "") {
            discountFlag = true;
            setRequiredFlag(true);
            setTimeout(() => {
                setRequiredFlag(false);
            }, 2000);
        }

        if (!titleFlag && !brandFlag && !priceFlag && !ratingFlag && !quantityFlag && !discountFlag) {
            postProductData(fields);
            handleClose();
        }
    };

    /**
     * Function to update the product
     */
    const updateProductCall = () => {
        let titleFlag = false;
        let brandFlag = false;
        let priceFlag = false;
        let ratingFlag = false;
        let quantityFlag = false;
        let discountFlag = false;

        if (fields.title === undefined || fields.title === null || fields.title === "") {
            titleFlag = true;
            setRequiredFlag(true);
            setTimeout(() => {
                setRequiredFlag(false);
            }, 2000);
        }
        if (fields.brand === undefined || fields.brand === null || fields.brand === "") {
            brandFlag = true;
            setRequiredFlag(true);
            setTimeout(() => {
                setRequiredFlag(false);
            }, 2000);
        }
        if (fields.price === undefined || fields.price === null || fields.price === "") {
            priceFlag = true;
            setRequiredFlag(true);
            setTimeout(() => {
                setRequiredFlag(false);
            }, 2000);
        }
        if (fields.rating === undefined || fields.rating === null || fields.rating === "") {
            ratingFlag = true;
            setRequiredFlag(true);
            setTimeout(() => {
                setRequiredFlag(false);
            }, 2000);
        }
        if (fields.stock === undefined || fields.stock === null || fields.stock === "") {
            quantityFlag = true;
            setRequiredFlag(true);
            setTimeout(() => {
                setRequiredFlag(false);
            }, 2000);
        }
        if (fields.discountPercentage === undefined || fields.discountPercentage === null || fields.discountPercentage === "") {
            discountFlag = true;
            setRequiredFlag(true);
            setTimeout(() => {
                setRequiredFlag(false);
            }, 2000);
        }

        if (!titleFlag && !brandFlag && !priceFlag && !ratingFlag && !quantityFlag && !discountFlag) {
            updateProductData(fields, productId);
            handleClose();
        }
    };

    /**
     * Function to delete the product
     */
    const deleteProductCall = () => {
        deleteProductData(productId);
    };

    /**
     * Toast Message Component
     */
    const SnackBar = (message, type) => (
        <Alert severity={type} style={{ fontWeight: 600 }}>{message}</Alert>
    );

    return (
        <>
            <SimpleBackdrop
                open={(loader && loader.value)}
                value={(loader && loader.message)}
            />
            <GlobalError error={error} open={openError} />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                    position="fixed"
                    sx={{
                        width: { sm: `calc(100% - ${drawerWidth}px)` },
                        ml: { sm: `${drawerWidth}px` },
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2, display: { sm: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Search>
                            <SearchIconWrapper>
                                <SearchIcon style={{
                                    width: 23, height: 23
                                }} />
                            </SearchIconWrapper>
                            <StyledInputBase
                                placeholder="Search"
                                inputProps={{ 'aria-label': 'search' }}
                                onChange={handleSearch}
                                value={searchValue}
                            />
                        </Search>

                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton size="large" color="inherit">
                            <LightModeIcon />
                        </IconButton>
                        <Tooltip title="Create Product">
                            <IconButton
                                size="large"
                                color="inherit"
                            >
                                <AddIcon onClick={() => {
                                    handleClickOpen();
                                    setFields({
                                        title: "",
                                        brand: "",
                                        price: "",
                                        discountPercentage: "",
                                        rating: "",
                                        stock: "",
                                        description: ""
                                    });
                                    setProductId("");
                                }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="My Account">
                            <IconButton
                                size="large"
                                color="inherit"
                            >
                                <AccountCircleIcon />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>

                <Box
                    component="nav"
                    sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                    aria-label="mailbox folders"
                >
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'none' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                    >
                        {drawer}
                    </Drawer>
                    <Drawer
                        variant="permanent"
                        sx={{
                            display: { xs: 'none', sm: 'block' },
                            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                </Box>

                <Box
                    component="main"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >
                    <div style={{
                        margin: "2rem 0rem",
                    }}>
                        <Typography component="div" variant="h5" style={{
                            fontWeight: 600,
                            marginBottom: "8px"
                        }}>
                            Hot New Releases
                        </Typography>

                        {
                            singleProductData.length ? (
                                (singleProductData || []).map((data, i) => {
                                    return (
                                        <>
                                            <Grow
                                                in
                                                timeout={fadeTimeout}
                                            >
                                                <Grid key="singlePrdt" container style={{
                                                    margin: "1rem 0rem"
                                                }}>
                                                    <Grid key={i} item xs={12} sm={12} md={12} lg={12}>
                                                        <StyledFullDetailViewCard sx={{ display: 'flex' }}>
                                                            <StyledFullDetailViewCardMedia
                                                                component="img"
                                                                sx={{ width: 151 }}
                                                                image={data.thumbnail === '' || data.thumbnail === null || data.thumbnail === undefined ? ImagePlaceholder : data.thumbnail}
                                                                alt={data.title}
                                                            />
                                                            <Box sx={{ display: 'flex', flexDirection: 'column', width: "100%" }}>
                                                                <StyledFullDetailViewCardContent sx={{ flex: '1 0 auto' }}>
                                                                    <Typography component="div" variant="h4" style={{
                                                                        fontWeight: 700,
                                                                        marginBottom: "8px"
                                                                    }}>
                                                                        {data.title}
                                                                    </Typography>

                                                                    <Rating name="read-only" value={parseInt(data.rating)} readOnly />

                                                                    <Grid container spacing={2}>
                                                                        <Grid item xs={3} lg={2} md={3} sm={12}>
                                                                            <Typography gutterBottom component="div" style={{
                                                                                fontSize: 20,
                                                                                fontWeight: 600,
                                                                                color: '#00E0FF'
                                                                            }}>
                                                                                {data.hasOwnProperty("discountPercentage") ? `${-parseInt(data.discountPercentage)}%` : '0%'}
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid item xs={6} lg={10} md={6} sm={12} style={{ padding: 12 }}>
                                                                            <Typography gutterBottom component="div" style={{
                                                                                fontSize: 25,
                                                                                fontWeight: 600,
                                                                                color: 'white'
                                                                            }}>
                                                                                ₹ {numberWithCommas(data.price)}
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>

                                                                    <Grid container spacing={2}>
                                                                        <Grid style={{ paddingTop: 5 }} item xs={6} lg={3} md={3} sm={12}>
                                                                            <Typography style={{ fontSize: 14, fontWeight: 700 }}>
                                                                                Brand
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid style={{ paddingTop: 5 }} item xs={6} lg={9} md={6} sm={12}>
                                                                            <Typography style={{ fontSize: 14 }}>
                                                                                {data.brand ? data.brand : '-'}
                                                                            </Typography>
                                                                        </Grid>

                                                                        <Grid style={{ paddingTop: 5 }} item xs={6} lg={3} md={6} sm={12}>
                                                                            <Typography style={{ fontSize: 14, fontWeight: 700 }}>
                                                                                Category
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid style={{ paddingTop: 5 }} item xs={6} lg={9} md={6} sm={12}>
                                                                            <Typography style={{ fontSize: 14 }}>
                                                                                {data.category ? data.category : '-'}
                                                                            </Typography>
                                                                        </Grid>

                                                                        <Grid style={{ paddingTop: 5 }} item xs={6} lg={3} md={6} sm={12}>
                                                                            <Typography style={{ fontSize: 14, fontWeight: 700 }}>
                                                                                Rating
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid style={{ paddingTop: 5 }} item xs={6} lg={9} md={6} sm={12}>
                                                                            <Typography style={{ fontSize: 14 }}>
                                                                                {data.rating ? parseInt(data.rating) : '-'}
                                                                            </Typography>
                                                                        </Grid>

                                                                        <Grid style={{ paddingTop: 5 }} item xs={6} lg={3} md={6} sm={12}>
                                                                            <Typography style={{ fontSize: 14, fontWeight: 700 }}>
                                                                                Quantity Available
                                                                            </Typography>
                                                                        </Grid>
                                                                        <Grid style={{ paddingTop: 5 }} item xs={6} lg={9} md={6} sm={12}>
                                                                            <Typography style={{ fontSize: 14 }}>
                                                                                {data.stock ? data.stock : '-'}
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>

                                                                    <Typography component="div" variant="h6" style={{
                                                                        fontWeight: 600,
                                                                        color: "#00E0FF",
                                                                        margin: "10px 0px 0px"
                                                                    }}>
                                                                        {data.stock === 0 || data.stock === "0" ? "No Stock" : "In Stock"}
                                                                    </Typography>

                                                                    <Grid container spacing={2}>
                                                                        <Grid style={{ paddingTop: 25 }} item xs={12} lg={12} md={12} sm={12}>
                                                                            <Typography style={{ fontSize: 14, fontWeight: 700 }}>
                                                                                About this item
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>

                                                                    <Grid container spacing={2}>
                                                                        <Grid item xs={12} lg={12} md={12} sm={12}>
                                                                            <Typography style={{ fontSize: 14 }}>
                                                                                {data.description ? data.description : "No Description"}
                                                                            </Typography>
                                                                        </Grid>
                                                                    </Grid>
                                                                </StyledFullDetailViewCardContent>
                                                            </Box>
                                                        </StyledFullDetailViewCard>
                                                    </Grid>
                                                </Grid>
                                            </Grow>
                                        </>
                                    )
                                })
                            ) : null
                        }

                        <Grid container spacing={2} key='all_prodcuts'>
                            {
                                (allPrdtData || []).slice(currentPage * rowPerPage, (currentPage + 1) * rowPerPage).map((item, i) => {
                                    return (
                                        <Grid key={i} item xs={12} sm={12} md={4} lg={2}>
                                            <StyledCard>
                                                <StyledCardMedia
                                                    sx={{ height: 150 }}
                                                    image={item.thumbnail === '' || item.thumbnail === null || item.thumbnail === undefined ? ImagePlaceholder : item.thumbnail}
                                                    title={item.title}
                                                    onClick={() => { filterParticularProductData(item.title) }}
                                                />
                                                <StyledCardContent>
                                                    <Typography gutterBottom component="div" style={{
                                                        fontSize: 15,
                                                        fontWeight: 600
                                                    }}>
                                                        {item.title.slice(0, 16)}
                                                        {item.title.length > 16 && (<span> ... </span>)}
                                                    </Typography>
                                                    <Rating name="read-only" value={item.rating} readOnly />
                                                    <Typography gutterBottom component="div" style={{
                                                        fontSize: 15,
                                                        fontWeight: 600,
                                                        color: '#00E0FF'
                                                    }}>
                                                        ₹ {numberWithCommas(item.price)}
                                                    </Typography>
                                                </StyledCardContent>
                                                <StyledCardActions>
                                                    <StyledCardIconButtons size="large" aria-label="search" color="inherit">
                                                        <FavoriteBorderOutlinedIcon />
                                                    </StyledCardIconButtons>
                                                    <StyledCardIconButtons size="large" aria-label="search" color="inherit">
                                                        <EditIcon onClick={() => {
                                                            handleClickOpen();
                                                            setIsUpdate(true);
                                                            setFields({
                                                                title: item.title || "",
                                                                brand: item.brand || "",
                                                                price: item.price || "",
                                                                discountPercentage: item.discountPercentage || "",
                                                                rating: item.rating || "",
                                                                stock: item.stock || "",
                                                                description: item.description || "",
                                                            })
                                                            setProductId(item.id);
                                                        }} style={{ cursor: "pointer" }} />
                                                    </StyledCardIconButtons>
                                                    <StyledCardIconButtons size="large" aria-label="search" color="inherit">
                                                        <DeleteIcon onClick={() => {
                                                            handleClickOpenVerification();
                                                            setProductId(item.id);
                                                        }} style={{ cursor: "pointer" }} />
                                                    </StyledCardIconButtons>
                                                </StyledCardActions>
                                            </StyledCard>
                                        </Grid>
                                    )
                                })
                            }
                        </Grid>

                        {
                            allPrdtData && allPrdtData.length ? (
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    style={{
                                        marginTop: 10
                                    }}
                                >
                                    <TablePagination
                                        component="div"
                                        count={(allPrdtData || []).length}
                                        page={currentPage}
                                        onPageChange={(e, newPage) => { setCurrentPage(newPage); }}
                                        rowsPerPageOptions={[6, 12, 18, 24, 30]}
                                        rowsPerPage={rowPerPage}
                                        labelRowsPerPage={'Product Per Page'}
                                        onRowsPerPageChange={(e) => {
                                            setRowPerPage(parseInt(e.target.value));
                                            setCurrentPage(0);
                                        }}
                                        classes={{
                                            select: classes.tablePaginationCaption,
                                            selectIcon: classes.tablePaginationSelectIcon,
                                            displayedRows: classes.tablePaginationDisplay,
                                            selectLabel: classes.tablePaginationSelect,
                                            actions: classes.tablePaginationActions,
                                        }}
                                    />
                                </Grid>
                            ) : null
                        }
                    </div>
                </Box>
            </Box>

            {/* Component to render the textfields */}
            <Dialog
                fullScreen={fullScreen}
                fullWidth={true}
                maxWidth='sm'
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" style={{
                    color: "black"
                }}>
                    {isUpdate ? "Edit Product" : "Add Product"}
                </DialogTitle>

                {
                    requiredFlag && (
                        SnackBar(`Please fill the required fields`, 'error')
                    )
                }

                <DialogContent>
                    <TextField
                        required
                        margin="dense"
                        id="title"
                        label="Title"
                        fullWidth
                        variant="outlined"
                        value={fields.title}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="brand"
                        label="Brand"
                        fullWidth
                        variant="outlined"
                        value={fields.brand}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="price"
                        label="Price"
                        fullWidth
                        variant="outlined"
                        value={fields.price}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="rating"
                        label="Rating"
                        fullWidth
                        variant="outlined"
                        value={fields.rating}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="discountPercentage"
                        label="Discount Percentage"
                        fullWidth
                        variant="outlined"
                        value={fields.discountPercentage}
                        onChange={handleChange}
                    />
                    <TextField
                        required
                        margin="dense"
                        id="stock"
                        label="Quantity Available"
                        fullWidth
                        value={fields.stock}
                        variant="outlined"
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        id="description"
                        label="Description"
                        fullWidth
                        variant="outlined"
                        value={fields.description}
                        onChange={handleChange}
                        multiline
                        rows={4}
                    />
                </DialogContent>

                <DialogActions>
                    <Button variant="contained" onClick={isUpdate ? updateProductCall : createProductData}>
                        {isUpdate ? "Update" : "Submit"}
                    </Button>
                    <Button variant='outlined' onClick={handleClose}>
                        CANCEL
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Component to render the verification popup */}
            <Dialog
                fullScreen={fullScreen}
                fullWidth={true}
                maxWidth='xs'
                open={openVerificationDialog}
                onClose={handleCloseVerification}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title" style={{
                    color: "black"
                }}>
                    Confirmation
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this product?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={deleteProductCall}>
                        Yes
                    </Button>
                    <Button variant='outlined' onClick={handleCloseVerification}>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        allProductsData: state.productData.productData,
        createdProductData: state.productData.product_created_data,
        loader: state.productData.loader,
        error: state.productData.error,
        updatedProductData: state.productData.product_updated_data,
        deletedProductData: state.productData.product_deleted_data
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getProductData: () => {
            dispatch(get_product_data());
        },
        postProductData: payload => {
            dispatch(post_product_data(payload));
        },
        updateProductData: (data, productId) => {
            dispatch(update_product_data(data, productId));
        },
        deleteProductData: (productId) => {
            dispatch(delete_product_data(productId));
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
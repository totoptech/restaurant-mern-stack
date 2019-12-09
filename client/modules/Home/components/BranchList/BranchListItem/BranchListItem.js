import React from "react";
import PropTypes from "prop-types";
import { Card, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { next } from "../../../../../components/icons/icons";

const useStyles = makeStyles(theme => ({
  card: {
    padding: "22px",
    borderRadius: "12px",
    margin: "24px 0px",
    cursor: "pointer",
    "&:hover $next": {
      transform: "translate(10px, 0px)",
    },
    [theme.breakpoints.down('sm')]: {
      padding: "16px",
      margin: "12px 0px",
    },
  },
  cardContent: {
    display: "flex",
    alignItems: "center",
    padding: "0px !important",
  },
  image: {
    width: "100px",
    height: "100px",
    minWidth: "100px",
    minHeight: "100px",
    maxWidth: "100px",
    maxHeight: "100px",
    borderRadius: "4px",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center center",
    backgroundSize: "cover",
    boxShadow: "1px 1px 2px 1px rgba(0, 0, 0, 0.2)",
    [theme.breakpoints.down('sm')]: {
      width: "80px",
      height: "80px",
      minWidth: "80px",
      minHeight: "80px",
      maxWidth: "80px",
      maxHeight: "80px",
    },
  },
  info: {
    flexGrow: 1,
    paddingLeft: "37px"
  },
  title: {
    fontSize: "22px",
    margin: '8px 0px',
    lineHeight: "24px",
    color: "black",
    [theme.breakpoints.down('sm')]: {
      fontSize: "18px",
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: "16px",
    },
  },
  state: {
    color: "black",
    margin: '8px 0px',
    opacity: 0.7,
    display: "flex",
    flexWrap: "wrap",
    fontSize: "14px",
    "div" : {
      whiteSpace: "nowrap",
    }
  },
  next: {
    transition: "transform 0.5s",
    color : "#20B1A4",
  },
}));

function BranchListItem(props) {
  const classes = useStyles();
  const { branch } = props;

  // branch.openingHours
  // away time

  return (
    <Card className={classes.card} onClick={props.onNext}>
      <CardContent className={classes.cardContent}>
        <div
          className={classes.image}
          style={{ backgroundImage: "url(" + branch.photoUrl + ")" }}
        />
        <div className={classes.info}>
          <div className={classes.title}>{branch.name}</div>
          <div className={classes.state}>
            <strong>Open</strong>
            <div> ∙ {branch.address},{" "}</div>
            <div>450min away</div>
          </div>
        </div>
        <div className={classes.next}>
          {next()}
        </div>
      </CardContent>
    </Card>
  );
}

BranchListItem.propTypes = {
  branch: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    longitude: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    openingHours: PropTypes.array.isRequired,
    phone: PropTypes.string,
    photoUrl: PropTypes.string.isRequired,
    orderProviderId: PropTypes.object,
    canAcceptOrders: PropTypes.bool,
  }).isRequired,
  onNext: PropTypes.func.isRequired
};

export default BranchListItem;

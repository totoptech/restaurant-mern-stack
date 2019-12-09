import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";

// Import Components
import BranchListItem from "./BranchListItem/BranchListItem";

const useStyles = makeStyles(theme => ({
  listView: {
    maxWidth: "752px",
    margin: "0 auto",
    width: "100%"
  }
}));

function BranchList(props) {
  const classes = useStyles();

  return (
      <div className={classes.listView}>
        {props.branches.map((branch, index) => (
          <BranchListItem
            branch={branch}
            key={index}
            onNext={() => props.handleNext(branch)}
          />
        ))}
      </div>
  );
}

BranchList.propTypes = {
  branches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  ).isRequired,
  handleNext: PropTypes.func.isRequired
};

export default BranchList;

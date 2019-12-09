import React from 'react';
import Switch from "react-switch";

//import Styles
import styles from "./SettingsForm.css";

class SettingsForm extends React.Component{
    constructor(props){
        super(props);
    }
    
    render(){
        const { id, name, desc, onSwitch, check, ...other } = this.props;

        return(
            <div className={styles["settings-form"]} {...other}>
                <p className={styles["settings-name"]}>{name}</p>
                <div className="d-flex">
                    <p className={styles["settings-desc"]}>{desc}</p>
                    <Switch
                        onChange={(c) => onSwitch(id, c)}
                        checked={check}
                        className={styles["react-switch"]}
                        onColor="#20B1A4"
                        height={24}
                        width={50}
                    />
                </div>
            </div>
        )
    }
}

export default SettingsForm;
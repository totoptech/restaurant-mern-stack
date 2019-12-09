import React from 'react';
import { Modal } from "@material-ui/core";
import DefaultButton from '../DefaultButton';

import styles from './TimeModal.css';
import { close_dlg } from "../icons/icons";
import clsx from 'clsx';

class TimeModal extends React.Component{
    
    constructor(props){
        super(props)
        this.state={
            ar_time: [],
        }
    }
    componentDidMount(){
        var i, j;
        var ar_time = [];
        const {type, time, date} = this.props;
        console.log(type, time, date);

        for( i = 0; i < 24; i ++)
        {
            for( j = 0 ; j < 60; j +=10)
            {
                let min = j, hr = i;
                if(i > 0 && i < 10)
                    hr = '0' + i;
                if(j === 0)
                    min = j + '0';
                ar_time[i * 6 + j / 10] =  hr + ':' + min;
            }
        }
        console.log(this.props);
        this.setState({ type, time, date, ar_time });

    }
    handleSubmit = (event) => {
        event.preventDefault();
        const {type, date, time} = this.state;
        this.props.handleSubmit(type, date, time);
    }
    handleTimeType = (value) => {
        this.setState({ type : value});
    }
    selectTime = (value) => {
        console.log("I am time", value);
        this.setState({ time : value})
    }
    selectDate = (value) => {
        this.setState( { date: value});
    }
    render(){
        const {openTime, handleClose} = this.props;
        const {type, ar_time, time, date} = this.state;
        
        return(
            <Modal open={openTime} onClose={handleClose}>
                <div className={styles['modal-container']}>
                    <div onClick={handleClose} className={styles["btn-close"]}>
                        {close_dlg()}
                    </div>
                    <form className={styles['child-container']} onSubmit={this.handleSubmit}>
                        <p>Select Delivery Time</p>
                        <p>Select the desired delivery time<br></br>for your order.</p>
                        
                        <div className={styles["delivery-switch"]}>
                            <button
                                onClick={() => this.handleTimeType('ASAP')}
                                className={clsx(styles["switch-item"], (type === 'ASAP' && styles["active"]))}
                                type='button'
                            >
                                ASAP
                            </button>
                            <button
                                onClick={() => this.handleTimeType('LATER')}
                                className={clsx(styles["switch-item"], (type === 'LATER' && styles["active"]))}
                                type='button'
                            >
                                LATER
                            </button>
                        </div>
                        {type === 'LATER' &&
                            <div>
                                <input
                                    className={styles['form-control']}
                                    type='date'
                                    required
                                    value={date}
                                    onChange={e => this.selectDate(e.target.value)}/>
                                <select
                                    className={styles["form-control"]}
                                    onChange={e => this.selectTime(e.target.value)}
                                    required
                                    value={time}
                                    >
                                    {ar_time.map((time, id) => (
                                        <option key={id} value={`${time}`}>
                                        {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        }
                        <DefaultButton className={styles['btn-save']} type='submit'>Save</DefaultButton>
                    </form>
                </div>
            </Modal>
        )
    }
}

export default TimeModal;
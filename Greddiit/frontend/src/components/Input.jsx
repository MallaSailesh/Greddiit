import React from "react";

function Input(props){
    return (
        <div className="col-auto col-md-12">
            <input
                className="form-control" 
                type={props.type}
                name={props.placeholder}
                placeholder={props.placeholder}
                onChange={props.onChange}
                value={props.rvalue}
                autoComplete='off'
            />
        </div>
    );
}

export default Input;

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';

function EditForm(props) {

    const navigate = useNavigate();

    return (
        <form className='row g-3'>
            <div className="col-md-6">
                <label>FirstName</label>
                <input className="form-control" type="text" value={props.userDetails.FirstName || ""} onChange={props.modify} name="FirstName"  autoComplete='off' />
            </div>
            <div className="col-md-6">
                <label>LastName</label>
                <input className="form-control" type="text" value={props.userDetails.LastName || ""} onChange={props.modify} name="LastName" autoComplete='off' />
            </div>
            <div>
                <label>UserName</label>
                <input className="form-control" type="text" value={props.userDetails.UserName} onChange={props.modify} name="UserName" autoComplete='off' />
            </div>
            <div className="col-md-4">
                <label>Age</label>
                <input className="form-control" type="number" value={props.userDetails.Age || ""} onChange={props.modify} name="Age" autoComplete='off' />
            </div>
            <div className="col-md-8">
                <label>PhoneNumber</label>
                <input className="form-control" type="tel" value={props.userDetails.PhoneNumber || ""} onChange={props.modify} name="PhoneNumber" autoComplete='off' />
            </div>
            <div>
                <label>Email</label>
                <input className="form-control" type="email" value={props.userDetails.Email} onChange={props.modify} name="Email" autoComplete='off' />
            </div>
            <div className='padding-btn'>
                <button className="btn btn-lg btn-outline-success btn-opacity edit-btn" onClick={props.Edit} disabled={props.button}>Save</button>
                <button className="btn btn-lg btn-outline-success btn-opacity edit-btn" onClick={props.Cancel}>Cancel</button>
            </div>
        </form>
    );
}

export default EditForm;

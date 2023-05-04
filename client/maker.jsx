const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

const handleDomo = (e) => {
    e.preventDefault();
    helper.hideError();

    const nameField = e.target.querySelector('#domoName');
    const ageField = e.target.querySelector('#domoAge');
    const genderField = e.target.querySelector('#domoGender');

    if (!nameField.value || !ageField.value) {
        helper.handleError('Name and age are required!');
        return false;
    }

    if (genderField.value) {
        helper.sendPost(e.target.action, { name: nameField.value, age: ageField.value, gender: genderField.value }, loadDomosFromServer);
    }
    else {
        helper.sendPost(e.target.action, { name: nameField.value, age: ageField.value }, loadDomosFromServer);
    }
    nameField.value = "";
    ageField.value = "";
    genderField.value = "";
    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={handleDomo}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" /> <br/>
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" /><br/>
            <label htmlFor="gender">Gender: </label>
            <input id="domoGender" type="text" name="gender" placeholder="Domo Gender" /><br/>
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = (props) => {
    if (props.domos.length === 0) {
        return (
            <div className="domosList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = props.domos.map(domo => {
        console.log(domo.gender);
        return (
            <div key={domo._id} className="domo">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge"> Age: {domo.age}</h3>
                <h3 className="domoAge"> Gender: {domo.gender || ' - '}</h3>
            </div>
        );
    });

    return (
        <div className="DomoList">
            {domoNodes}
        </div>
    );
};

const loadDomosFromServer = async () => {
    const response = await fetch('/getDomos');
    const data = await response.json();
    ReactDOM.render(
        <DomoList domos={data.domos} />,
        document.getElementById('domos')
    );
};

const init = () => {
    ReactDOM.render(
        <DomoForm />,
        document.getElementById('makeDomo')
    );

    ReactDOM.render(
        <DomoList domos={[]} />,
        document.getElementById('domos')
    );

    loadDomosFromServer();
};

window.onload = init;
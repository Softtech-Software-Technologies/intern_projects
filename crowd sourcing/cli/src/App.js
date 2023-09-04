import React, { useState, useEffect, useRef } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { InputSwitch } from "primereact/inputswitch";
import { Menubar } from 'primereact/menubar';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { RadioButton } from "primereact/radiobutton";
import { Sidebar } from "primereact/sidebar";
import "./App.css";
import axios from "axios";
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';

function App() {
    const [context, setContext] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [editedContext, setEditedContext] = useState("");
    const [editedQuestion, setEditedQuestion] = useState("");
    const [editedAnswer, setEditedAnswer] = useState("");
    const [contextID, setContextID] = useState('');
    const [isVerified, setIsVerified] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [editDate, setEditDate] = useState('');
    const [verifyDate, setVerifyDate] = useState('');
    const [checkedContext, setCheckedContext] = useState(false);
    const [checkedQuestion, setCheckedQuestion] = useState(false);
    const [checkedAnswer, setCheckedAnswer] = useState(false);
    const [editedBy, setEditedBy] = useState('');
    const [verifiedBy, setVerifiedBy] = useState('');
    const [visibleLogin, setVisibleLogin] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [visibleSignUp, setVisibleSignUp] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [typeUser, setTypeUser] = useState('');
    const [afterLogin, setAfterLogin] = useState(false);
    const [email, setEmail] = useState("");
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const [isInvalid, setIsInvalid] = useState(false);
    const toast = useRef(null);
    const date = new Date(createdDate);
    const editedDate = new Date().toLocaleString("tr-TR");
    const verifiedDate = new Date().toLocaleString("tr-TR");


    const showSuccess = (message, summary) => {
        toast.current.show({ severity: 'success', summary: summary, detail: message, life: 3000 });
    };

    const showError = (message, summary) => {
        toast.current.show({ severity: 'error', summary: summary, detail: message, life: 3000 });
    };

    const isLoggedIn = () => {
        if (localStorage.getItem("username") !== null && localStorage.getItem("password") !== null) {
            setUsername(localStorage.getItem("username"));
            setPassword(localStorage.getItem("password"));
            setTypeUser(localStorage.getItem("typeUser"));
            setContext(localStorage.getItem("context"));
            setQuestion(localStorage.getItem("question"));
            setAnswer(localStorage.getItem("answer"));
            setContextID(localStorage.getItem("_id"));
            setCreatedDate(localStorage.getItem("createdDate"));
            setIsVerified(localStorage.getItem("isVerified"));
            setEditedBy(localStorage.getItem("editedBy"));
            setEditDate(localStorage.getItem("editDate"));
            setVerifyDate(localStorage.getItem("verifiedDate"));
            setVerifiedBy(localStorage.getItem("verifiedBy"));
            setAfterLogin(true);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);

    const login = async () => {
        try {
            const response = await axios.post('http://localhost:5000/login', {
                username: username,
                password: password,
            });
            if (response.status === 200) {
                setVisibleLogin(false)
                setAfterLogin(true);
                showSuccess("Successfully Logged In!", username);
                const response = await axios.get("http://localhost:5000/questions/random");
                setContext(response.data.context);
                setQuestion(response.data.question);
                setAnswer(response.data.answer);
                setContextID(response.data._id);
                setCreatedDate(response.data.createdDate);
                setIsVerified(response.data.isVerified);
                setEditedBy(response.data.editedBy);
                setVerifyDate(response.data.verifiedDate);
                setVerifiedBy(response.data.verifiedBy);
                if ((username !== '' || null || undefined) && (password !== '' || null || undefined)) {
                    localStorage.setItem("username", username);
                    localStorage.setItem("password", password);
                    localStorage.setItem("typeUser", typeUser);
                    localStorage.setItem("context", response.data.context);
                    localStorage.setItem("question", response.data.question);
                    localStorage.setItem("answer", response.data.answer);
                    localStorage.setItem("_id", response.data._id);
                    localStorage.setItem("createdDate", response.data.createdDate);
                    localStorage.setItem("isVerified", response.data.isVerified);
                    localStorage.setItem("editedBy", response.data.editedBy);
                    localStorage.setItem("editDate", response.data.editDate);
                    localStorage.setItem("verifiedDate", response.data.verifiedDate);
                    localStorage.setItem("verifiedBy", response.data.verifiedBy);
                }
            }
        } catch (error) {
            if (error.response.status === 401) {
                console.log(error.response.data);
                showError(error.response.data,);
            } else {
                showError(error);
            }
        }
    };

    const signUp = async () => {
        try {
            await axios.post('http://localhost:5000/signup', {
                email: email,
                password: newPassword,
                username: newUsername
            });
            showSuccess("Successfully User Created!");
        } catch (error) {
            if (error.response.status === 400) {
                showError(error.response.data);
            } else {
                console.log(error);
            }
        }
    };

    const signOut = () => {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("typeUser");
        localStorage.removeItem("context");
        localStorage.removeItem("question");
        localStorage.removeItem("answer");
        localStorage.removeItem("_id");
        localStorage.removeItem("createdDate");
        localStorage.removeItem("isVerified");
        localStorage.removeItem("editedBy");
        localStorage.removeItem("editDate");
        localStorage.removeItem("verifiedDate");
        localStorage.removeItem("verifiedBy");
        showSuccess("Successfully Logged Out!", username);
        setInterval(function () {
            window.location.reload();
        }, 500);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/questions/${contextID}`, {
                editedContext: editedContext,
                editedQuestion: editedQuestion,
                editedAnswer: editedAnswer,
                editedBy: username,
                isVerified: false,
                editDate: editedDate,
                verifiedDate: "",
                assigned: false
            });
            console.log(response.data);
            setCheckedContext(false);
            setCheckedQuestion(false);
            setCheckedAnswer(false);
        } catch (err) {
            console.log(err);
        }
    }

    const randomQuestion = async () => {
        try {
            if (typeUser === 'validator') {
                const response = await axios.get("http://localhost:5000/questions/random");
                if (response.status === 204) {
                    console.log("no data");
                } else {
                    await axios.put(`http://localhost:5000/questions/${response.data._id}`, {
                        assigned: true
                    });
                    setContext(response.data.context);
                    setQuestion(response.data.question);
                    setAnswer(response.data.answer);
                    setContextID(response.data._id);
                    setCreatedDate(response.data.createdDate);
                    setIsVerified(response.data.isVerified);
                    setEditedContext(response.data.editedContext);
                    setEditedAnswer(response.data.editedAnswer);
                    setCheckedQuestion(response.data.editedQuestion);
                    setEditedBy(response.data.editedBy);
                    setEditDate(response.data.editDate);
                    setVerifyDate(response.data.verifiedDate);
                    setVerifiedBy(response.data.verifiedBy);
                    setCheckedContext(false);
                    setCheckedQuestion(false);
                    setCheckedAnswer(false);
                    localStorage.setItem("editedContext", response.data.editedContext);
                    localStorage.setItem("editedQuestion", response.data.editedAnswer);
                    localStorage.setItem("editedAnswer", response.data.editedAnswer);
                    localStorage.setItem("context", response.data.context);
                    localStorage.setItem("question", response.data.question);
                    localStorage.setItem("answer", response.data.answer);
                    localStorage.setItem("_id", response.data._id);
                    localStorage.setItem("createdDate", response.data.createdDate);
                    localStorage.setItem("isVerified", response.data.isVerified);
                    localStorage.setItem("editedBy", response.data.editedBy);
                    localStorage.setItem("editDate", response.data.editDate);
                    localStorage.setItem("verifiedDate", response.data.verifyDate);
                    localStorage.setItem("verifiedBy", response.data.verifiedBy);
                }
            } else {
                const response = await axios.get("http://localhost:5000/questions/verifier");
                if (response.status === 204) {
                    console.log("no data");
                    showSuccess("If you keep getting this message, there are no unverified questions", "All questions confirmed!");
                } else {
                    await axios.put(`http://localhost:5000/questions/${response.data._id}`, {
                        assigned: true
                    });
                    setContext(response.data.context);
                    setQuestion(response.data.question);
                    setAnswer(response.data.answer);
                    setContextID(response.data._id);
                    setCreatedDate(response.data.createdDate);
                    setIsVerified(response.data.isVerified);
                    setEditedContext(response.data.editedContext);
                    setEditedAnswer(response.data.editedAnswer);
                    setCheckedQuestion(response.data.editedQuestion);
                    setEditedBy(response.data.editedBy);
                    setEditDate(response.data.editDate);
                    setVerifyDate(response.data.verifiedDate);
                    setVerifiedBy(response.data.verifiedBy);
                    setCheckedContext(false);
                    setCheckedQuestion(false);
                    setCheckedAnswer(false);
                    localStorage.setItem("editedContext", response.data.editedContext);
                    localStorage.setItem("editedQuestion", response.data.editedAnswer);
                    localStorage.setItem("editedAnswer", response.data.editedAnswer);
                    localStorage.setItem("context", response.data.context);
                    localStorage.setItem("question", response.data.question);
                    localStorage.setItem("answer", response.data.answer);
                    localStorage.setItem("_id", response.data._id);
                    localStorage.setItem("createdDate", response.data.createdDate);
                    localStorage.setItem("isVerified", response.data.isVerified);
                    localStorage.setItem("editedBy", response.data.editedBy);
                    localStorage.setItem("editDate", response.data.editDate);
                    localStorage.setItem("verifiedDate", response.data.verifyDate);
                    localStorage.setItem("verifiedBy", response.data.verifiedBy);
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    const unAssigned = async () => {
        await axios.put(`http://localhost:5000/questions/${contextID}`, {
            assigned: false
        });
    }

    const verifyTrue = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/questions/${contextID}`, {
                isVerified: true,
                verifiedDate: verifiedDate,
                verifiedBy: username
            });
            showSuccess("Successfully Updated!")
            setIsVerified(response.data.isVerified);
            setVerifyDate(response.data.verifiedDate);
            setVerifiedBy(response.data.verifiedBy);
            localStorage.setItem("isVerified", response.data.isVerified);
            localStorage.setItem("verifiedDate", response.data.verifiedDate);
            localStorage.setItem("verifiedBy", response.data.verifiedBy);
        } catch (err) {
            console.log(err);
        }
    }

    const verifyFalse = async () => {
        try {
            const response = await axios.put(`http://localhost:5000/questions/${contextID}`, {
                isVerified: false,
                verifiedDate: verifiedDate,
                verifiedBy: username
            });
            showSuccess("Successfully Updated!")
            setIsVerified(response.data.isVerified);
            setVerifyDate(response.data.verifiedDate);
            setVerifiedBy(response.data.verifiedBy);
            localStorage.setItem("isVerified", response.data.isVerified);
            localStorage.setItem("verifiedDate", response.data.verifiedDate);
            localStorage.setItem("verifiedBy", response.data.verifiedBy);
        } catch (err) {
            console.log(err);
        }
    }

    const start =
        <>
            <Button label="Login" icon="pi pi-user" style={{ margin: '5px' }} onClick={() => setVisibleLogin(true)} disabled={afterLogin} visible={!afterLogin}></Button>
            <h2 hidden={!afterLogin}>
                <i className="pi pi-user" style={{ margin: '5px', fontSize: '25px' }}></i>
                {username}
            </h2>
            <div hidden={!afterLogin}>
                <Button label={typeUser.toLocaleUpperCase()} style={{ marginRight: '20px' }} disabled={true} />
                <Button label={contextID} disabled={true} style={{ marginRight: '20px' }} severity="success" />
                <Button label={"Created Date: " + date.toLocaleString('tr-TR')} style={{ marginRight: '20px' }} disabled={true} severity="help" />
                <Button label={"Verified: " + isVerified.toString().toLocaleUpperCase()} style={{ marginRight: '20px' }} disabled={true} severity={isVerified === true ? "success" : "danger"} />
                <Button label={"Verified By: " + verifiedBy} style={{ marginRight: '20px' }} disabled={true} visible={!((verifiedBy === '') || (verifiedBy === undefined))} />
                <Button label={"Verify Date: " + verifyDate} disabled={true} style={{ marginRight: '20px' }} severity="success" visible={!((verifyDate === '') || (verifyDate === undefined))} />
                <Button label={"Edited By: " + editedBy} disabled={true} style={{ marginRight: '20px' }} visible={!((editedBy === '') || (editedBy === undefined))} />
                <Button label={"Edit Date: " + editDate} disabled={true} style={{ marginTop: '20px' }} severity="warning" visible={!((editDate === '') || (editDate === undefined))} />
            </div>
            <Sidebar visible={visibleLogin} onHide={() => setVisibleLogin(false)} className="w-full md:w-20rem lg:w-30rem">
                <div className="login">
                    <div className="w-full md:w-5 flex flex-column align-items-s justify-content-center gap-3 py-5">
                        <div className="flex flex-wrap justify-content-center align-items-center gap-2">
                            <InputText value={username} onChange={e => setUsername((e.target.value))} placeholder="Username" style={{ fontSize: '15px', paddingRight: '70px', minHeight: '50px' }} />
                            <Password value={password} onChange={(e) => setPassword(e.target.value)} toggleMask placeholder="Password" feedback={false} style={{ minHeight: '5px' }} />
                        </div>
                        <Button label="Login" className="w-10rem mx-auto" disabled={((typeUser === '') || (username === '') || (password === ''))} onClick={() => { login(); }}></Button>
                        <div className="card flex justify-content-center">
                            <div className="flex flex-wrap gap-3">
                                <div className="flex align-items-center">
                                    <RadioButton inputId="type1" name="validator" value="validator" onChange={(e) => setTypeUser(e.value)} checked={typeUser === 'validator'} />
                                    <label htmlFor="type1" className="ml-2">Validator</label>
                                </div>
                                <div className="flex align-items-center">
                                    <RadioButton inputId="type2" name="verifier" value="verifier" onChange={(e) => setTypeUser(e.value)} checked={typeUser === 'verifier'} />
                                    <label htmlFor="type2" className="ml-2">Verifier</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Sidebar>
            <Button label="Sign Up" icon="pi pi-user-plus" className="p-button-success" onClick={() => setVisibleSignUp(true)} style={{ margin: '5px' }} disabled={afterLogin} visible={!afterLogin}></Button>
            <Sidebar visible={visibleSignUp} onHide={() => setVisibleSignUp(false)} className="w-full md:w-20rem lg:w-30rem">
                <h2>Sign Up</h2>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-at" ></i>
                    </span>
                    <InputText value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => setIsInvalid(!emailRegex.test(email))} placeholder="Email" className={isInvalid ? 'p-invalid' : ''} />
                </div>
                <div className="p-inputgroup">
                    <span className="p-inputgroup-addon">
                        <i className="pi pi-key"></i>
                    </span>
                    <Password value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='Password' toggleMask />
                    <Button label="Sign Up" severity="success" disabled={email === '' || !emailRegex.test(email) || newPassword === ''} onClick={() => { setNewUsername(email.split("@")[0]); signUp(); }} />
                </div>
                <p hidden={newUsername === ''}>Username:<b>{newUsername}</b></p>
            </Sidebar>
        </>;

    const end =
        <Button severity="danger" style={{ margin: '5px' }} disabled={!afterLogin} visible={afterLogin} onClick={() => { unAssigned(); signOut(); }}>Logout</Button>;

    return (
        <div>
            <Toast ref={toast} />

            <div className="card">
                <Menubar start={start} end={end} />
            </div>

            <div className="card" hidden={afterLogin}>
                <div className="flex flex-wrap justify-content-center"  >
                    <div className="w-full md:w-6 p-3">
                        <Skeleton className="mb-2" borderRadius="16px"></Skeleton>
                        <Skeleton width="10rem" className="mb-2" borderRadius="16px"></Skeleton>
                        <Skeleton width="5rem" borderRadius="16px" className="mb-2"></Skeleton>
                        <Skeleton height="2rem" className="mb-2" borderRadius="16px"></Skeleton>
                        <Skeleton height="2rem" className="mb-2" borderRadius="16px"></Skeleton>
                        <Skeleton height="2rem" className="mb-2" borderRadius="16px"></Skeleton>
                        <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
                        <br></br>
                        <Skeleton className="mb-2" borderRadius="16px"></Skeleton>
                        <Skeleton width="10rem" className="mb-2" borderRadius="16px"></Skeleton>
                        <Skeleton width="5rem" borderRadius="16px" className="mb-2"></Skeleton>
                        <Skeleton height="2rem" className="mb-2" borderRadius="16px"></Skeleton>
                        <Skeleton height="2rem" className="mb-2" borderRadius="16px"></Skeleton>
                        <Skeleton height="2rem" className="mb-2" borderRadius="16px"></Skeleton>
                        <Skeleton width="10rem" height="4rem" borderRadius="16px"></Skeleton>
                    </div>
                </div>
            </div>

            <span hidden={!afterLogin}>
                <Button icon={"pi pi-arrow-right"} onClick={() => { unAssigned(); randomQuestion(); }} style={{ float: 'right', marginTop: '5px', marginRight: '50px' }} />
            </span>

            <div hidden={!afterLogin}>
                <div className="switchButtons">
                    <span>
                        <div className="card flex justify-content-center" >
                            <h4 style={{ margin: '2px', marginRight: '5px', marginBottom: '20px', display: (typeUser === 'verifier' ? 'none' : null) }}>Edit Context</h4>
                            <InputSwitch checked={checkedContext} onChange={(e) => setCheckedContext(e.value)} style={{ margin: '1px', marginLeft: '20px', display: (typeUser === 'verifier' ? 'none' : null) }} />
                        </div>
                    </span>
                    <span>
                        <div className="card flex justify-content-center">
                            <h4 style={{ margin: '2px', marginRight: '5px', marginBottom: '20px', display: (typeUser === 'verifier' ? 'none' : null) }}>Edit Question</h4>
                            <InputSwitch checked={checkedQuestion} onChange={(e) => setCheckedQuestion(e.value)} style={{ margin: '1px', marginLeft: '20px', display: (typeUser === 'verifier' ? 'none' : null) }} />
                        </div>
                    </span>
                    <span>
                        <div className="card flex justify-content-center">
                            <h4 style={{ margin: '2px', marginRight: '5px', marginBottom: '20px', display: (typeUser === 'verifier' ? 'none' : null) }}>Edit Answer</h4>
                            <InputSwitch checked={checkedAnswer} onChange={(e) => setCheckedAnswer(e.value)} style={{ margin: '1px', marginLeft: '20px', display: (typeUser === 'verifier' ? 'none' : null) }} />
                        </div>
                    </span>
                </div>
                <div className="container">
                    <div className="card flex justify-content-center">
                        <span className="p-float-label">
                            <InputTextarea id="context" value={context} onChange={(e) => setContext(e.target.value)} rows={5} cols={30} autoResize disabled={true} />
                            <label htmlFor="description">Context</label>
                        </span>
                    </div>
                    <div className="card flex justify-content-center">
                        <span className="p-float-label">
                            <InputTextarea id="question" value={question} onChange={(e) => setQuestion(e.target.value)} rows={5} cols={30} autoResize disabled={true} />
                            <label htmlFor="description">Question</label>
                        </span>
                    </div>
                    <div className="card flex justify-content-center">
                        <span className="p-float-label">
                            <InputTextarea id="Answer" value={answer} onChange={(e) => setAnswer(e.target.value)} rows={5} cols={30} autoResize disabled={true} />
                            <label htmlFor="description">Answer</label>
                        </span>
                    </div>
                </div>
                <div className="container">
                    <div className="card flex justify-content-center">
                        <span className="p-float-label">
                            <InputTextarea id="editedContext" value={editedContext} onChange={(e) => setEditedContext(e.target.value)} rows={5} cols={30} autoResize disabled={!checkedContext} />
                            <label htmlFor="description">Edited Context</label>
                        </span>
                    </div>
                    <div className="card flex justify-content-center">
                        <span className="p-float-label">
                            <InputTextarea id="editedQuestion" value={editedQuestion} onChange={(e) => setEditedQuestion(e.target.value)} rows={5} cols={30} autoResize disabled={!checkedQuestion} />
                            <label htmlFor="description">Edited Question</label>
                        </span>
                    </div>
                    <div className="card flex justify-content-center">
                        <span className="p-float-label">
                            <InputTextarea id="editedAnswer" value={editedAnswer} onChange={(e) => setEditedAnswer(e.target.value)} rows={5} cols={30} autoResize disabled={!checkedAnswer} />
                            <label htmlFor="description">Edited Answer</label>
                        </span>
                    </div>
                </div>
                <div>
                    <Button label="Submit" onClick={() => { unAssigned(); handleSubmit(); randomQuestion(); }} disabled={!((editedContext !== '') || (editedQuestion !== '') || (editedAnswer !== ''))} style={{ margin: '10px', float: 'right', marginRight: '12%', display: (typeUser === 'verifier' ? 'none' : null) }} />
                    <Button icon={'pi pi-check'} severity="success" onClick={() => { unAssigned(); verifyTrue(); }} style={{ margin: '10px', float: 'right', marginRight: '41%', width: '150px', height: '50px', display: (typeUser === 'validator' ? 'none' : null) }} />
                    <Button icon={'pi pi-times'} severity="danger" onClick={() => { unAssigned(); verifyFalse(); }} style={{ margin: '10px', float: 'right', width: '150px', height: '50px', display: (typeUser === 'validator' ? 'none' : null) }} />
                </div>
            </div>
        </div>
    );
}

export default App;

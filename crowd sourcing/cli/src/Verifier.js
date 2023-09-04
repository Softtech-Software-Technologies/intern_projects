import React, { useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import "./Validator.css";

function Verifier() {
    const [context, setContext] = useState("");
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [unlabeledData, setUnlabeledData] = useState("");
    const [editedContext, setEditedContext] = useState("");
    const [editedQuestion, setEditedQuestion] = useState("");
    const [editedAnswer, setEditedAnswer] = useState("");
    const [editedUnlabeledData, setEditedUnlabeledData] = useState("");


    const handleSubmit = () => {
        
    };

    return (
        <div style={{ marginTop: '5%' }}>
            <h1 style={{ textAlign: 'center' }}>Verifier</h1>
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
                        <InputTextarea id="editedContext" value={editedContext} onChange={(e) => setEditedContext(e.target.value)} rows={5} cols={30} autoResize disabled={true} />
                        <label htmlFor="description">Edited Context</label>
                    </span>
                </div>
                <div className="card flex justify-content-center">
                    <span className="p-float-label">
                        <InputTextarea id="editedQuestion" value={editedQuestion} onChange={(e) => setEditedQuestion(e.target.value)} rows={5} cols={30} autoResize disabled={true} />
                        <label htmlFor="description">Edited Question</label>
                    </span>
                </div>
                <div className="card flex justify-content-center">
                    <span className="p-float-label">
                        <InputTextarea id="editedAnswer" value={editedAnswer} onChange={(e) => setEditedAnswer(e.target.value)} rows={5} cols={30} autoResize disabled={true} />
                        <label htmlFor="description">Edited Answer</label>
                    </span>
                </div>
            </div>

            <div style={{ float: 'right', marginRight: '25%', marginTop: '8%', padding: '20px' }}>
                <Button icon="pi pi-times" severity='danger' onClick={handleSubmit} style={{ margin: '5px', fontSize: '50px', width: '200px' }} />
                <Button icon="pi pi-check" severity="success" onClick={handleSubmit} style={{ margin: '5px', fontSize: '50px', width: '200px' }} />
            </div>

            <div style={{ marginTop: '80px', float: 'left', marginLeft: '16%' }}>
                <div>
                    <div className="card flex justify-content-center">
                        <span className="p-float-label">
                            <InputTextarea id="unlabeledData" value={unlabeledData} onChange={(e) => setUnlabeledData(e.target.value)} rows={5} cols={30} autoResize disabled={true} style={{ marginBottom: '25px' }} />
                            <label htmlFor="description">Unlabeled Data</label>
                        </span>
                    </div>
                    <div className="card flex justify-content-center">
                        <span className="p-float-label">
                            <InputTextarea id="editedUnlabeledData" value={editedUnlabeledData} onChange={(e) => setEditedUnlabeledData(e.target.value)} rows={5} cols={30} autoResize disabled={true} />
                            <label htmlFor="description">Edited Unlabeled Data</label>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Verifier;

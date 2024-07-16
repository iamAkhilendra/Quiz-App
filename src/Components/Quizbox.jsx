
import React, { useState , useEffect } from 'react';
import './Quizbox.css';
import { useNavigate } from 'react-router-dom';

export default function Quizbox() {

    const [currentQuestionIndex, setCurrentQuestion] = useState(-1);

    const [questionsList, setQuestionsList] = useState([]);

    const [choosenOptionsList, setChoosenOptionsList] = useState([]);

    const [isSolved, setIsSolved] = useState([]);

    const [score, setScore] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    const [errorOccured, setErrorOccured] = useState(false);

    // To handle HTML entities in the question and its options.
    const parseEntities = (str) => {
        return { __html: str };
    };

    // Swaps two element in an array
    const swap = (array, index1, index2) => {
        [array[index1], array[index2]] = [array[index2], array[index1]];
    }

    // Shuffles the four options of the question
    const shuffler = (list) => {
        var shuffleCount = 50;
        var randomIndex;
        for(let i = 0; i < shuffleCount; i++) {
            randomIndex = Math.floor(Math.random() * 2.99999);
            swap(list, randomIndex, 3);
        }
    }

    // Cheaks whether choosen option is correct or not and reveals the correct answer;
    const checkAndSubmitAnswer = () => {
        if(choosenOptionsList[currentQuestionIndex] == -1) {
            alert("Please select an option first!!");
            return;
        }
        var newIsSolved = [...isSolved];
        newIsSolved[currentQuestionIndex] = true;
        var currentQuestion = questionsList[currentQuestionIndex];
        if(currentQuestion.correct_answer == currentQuestion.incorrect_answers[choosenOptionsList[currentQuestionIndex]]) setScore(score => score + 1);
        setIsSolved(newIsSolved);
    }

    // Selects and deselects the options
    const selectOption = (optionNumber) => {
        if(isSolved[currentQuestionIndex] == true) return;

        var newChoosenOptionsList = [...choosenOptionsList];
        if(newChoosenOptionsList[currentQuestionIndex] == optionNumber) {
            newChoosenOptionsList[currentQuestionIndex] = -1;
        }
        else newChoosenOptionsList[currentQuestionIndex] = optionNumber;
        setChoosenOptionsList(newChoosenOptionsList);
    }

    // Following function makes the program shift to next question.
    const goToNextQuestion = () => {
        setCurrentQuestion(currentQuestionIndex => currentQuestionIndex + 1);
    }

    // Shifts to previous question.
    const goToPreviousQuestion = () => { 
        setCurrentQuestion(currentQuestionIndex => currentQuestionIndex - 1);
    }

    // Color of options of a question may vary in different states.
    // If question is attempted, then the option could be either correct answer or selected but incorrect option or an option that has not been selected by user. 
    // According to those different situations following function returns corresponding colors.
    const findOutColor = (optionNumber) => {
        var redColor = "rgb(255, 179, 179)";
        var greenColor = "rgb(179, 255, 179)";
        var blueColor = "rgb(163, 191, 255)";
        var grayColor = "rgb(224, 224, 224)";

        var currentQuestion = questionsList[currentQuestionIndex];

        if(isSolved[currentQuestionIndex] == true) {
            if(currentQuestion.incorrect_answers[optionNumber] == currentQuestion.correct_answer) return greenColor;
            else if(optionNumber == choosenOptionsList[currentQuestionIndex]) return redColor;
            else return grayColor;
        }
        else {
            if(optionNumber == choosenOptionsList[currentQuestionIndex]) return blueColor;
            else return grayColor;
        }

    }

    // Following function iterates through list of questions obtained by API and adds it to the list of questions after shuffling of options and converting questions and options in correct format. 
    const handleQuestions = (newcomingQuestionsList) => {
        var newQuestionsList = [...questionsList];
        var newChoosenOptionsList = [...choosenOptionsList];
        var newIsSolved = [...isSolved];

        var questionObject;
        for(let i = 0; i < newcomingQuestionsList.length; i++) {
            questionObject = newcomingQuestionsList[i];

            questionObject.incorrect_answers.push(questionObject.correct_answer);
            shuffler(questionObject.incorrect_answers);
            newQuestionsList.push(questionObject);
            newChoosenOptionsList.push(-1);
            isSolved.push(false);
        }
        setQuestionsList(newQuestionsList);
        setCurrentQuestion(currentQuestionIndex => currentQuestionIndex + 1);
        setChoosenOptionsList(newChoosenOptionsList);
        setIsSolved(newIsSolved);
        setIsLoading(false);
    }
    
    // Fetches questions from API.
    const fetchMoreQuestions = async () => {
        try {
            setIsLoading(true);
            var url = 'https://opentdb.com/api.php?amount=10&type=multiple';

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();

            var newcomingQuestionsList =  data.results;

            handleQuestions(newcomingQuestionsList);
        }
        catch {
            setIsLoading(false);
            setErrorOccured(true);
        }
    }

    // To go back from the "Error Occured" message to questions.
    const cancelFromErrorOccured = () => {
        setErrorOccured(false);
    }

    // To try again fetching the questions.
    const tryAgain = () => {
        setIsLoading(true);
        setErrorOccured(false);
        fetchMoreQuestions();
    }

    // To automatically fetching questions upon initial render of component.
    useEffect(() => {
        fetchMoreQuestions();
    }, []);

    return (
        <div id='quizbox-main-div'>
            <span id='question-number-mark' style={{display: (!isLoading && !errorOccured) ? "block" : "none"}}>Question Number : {currentQuestionIndex >= 0 ? currentQuestionIndex + 1: '__'} / {questionsList.length}</span>
            
            <div id="quizbox-top-section">
                <button className='buttons' id="previous-question-button" style={{display: (currentQuestionIndex > 0 && (!isLoading && !errorOccured)) ? "block" : "none"}} onClick={goToPreviousQuestion}>Previous</button>
                <button className='buttons' id="next-question-button" style={{display: (currentQuestionIndex >=0 && (currentQuestionIndex < questionsList.length - 1) && (!isLoading && !errorOccured)) ? "block" : "none"}} onClick={goToNextQuestion}>Next</button>
                <button className="load-more-questions buttons" id="load-more-questions-button" onClick={fetchMoreQuestions} style={{display: (currentQuestionIndex < 0 || (currentQuestionIndex == questionsList.length - 1)) && (!isLoading && !errorOccured) ? "block" : "none"}}>Load more questions</button>
            </div>

            <div id="quizbox-question-section">
                {
                    Array.from({ length : 1 }, (_, index) => {
                        if(errorOccured == true) {
                            return  <div id="error-occured-display-box">
                                        <p>Error occured while fetching questions!!</p>
                                        <div id="error-occured-buttons-section">
                                            <button id="cancel-on-error-occured" className="buttons" onClick={cancelFromErrorOccured}>Cancel</button>
                                            <button id="try-again-on-error-occured" className="buttons" onClick={tryAgain}>Try Again</button>
                                        </div>
                                    </div>
                        }
                        else if(isLoading == true) {
                            return  <div id="loading-box">
                                        <div className="loading-icon-boxes"></div>
                                        <div className="loading-icon-boxes"></div>
                                        <div className="loading-icon-boxes"></div>
                                    </div>
                        }
                        else return <div className='quizbox-question-section-item' id="questions-box">
                                        
                                        <div className="displayed-Question"><b>Question : </b><span dangerouslySetInnerHTML={parseEntities(questionsList[currentQuestionIndex].question)} /></div>
                                        <div className="displayed-questions-options">
                                            <div className="displayed-questions-options-list" id="option-A" onClick={() => {selectOption(0)}} style={{background: findOutColor(0)}}><b>A.</b> <span dangerouslySetInnerHTML={parseEntities(questionsList[currentQuestionIndex].incorrect_answers[0])} /></div>
                                            <div className="displayed-questions-options-list" id="option-B" onClick={() => {selectOption(1)}} style={{background: findOutColor(1)}}><b>B.</b> <span dangerouslySetInnerHTML={parseEntities(questionsList[currentQuestionIndex].incorrect_answers[1])} /></div>
                                            <div className="displayed-questions-options-list" id="option-C" onClick={() => {selectOption(2)}} style={{background: findOutColor(2)}}><b>C.</b> <span dangerouslySetInnerHTML={parseEntities(questionsList[currentQuestionIndex].incorrect_answers[2])} /></div>
                                            <div className="displayed-questions-options-list" id="option-D" onClick={() => {selectOption(3)}} style={{background: findOutColor(3)}}><b>D.</b> <span dangerouslySetInnerHTML={parseEntities(questionsList[currentQuestionIndex].incorrect_answers[3])} /></div>
                                        </div>
                                        <div id="check-answer-button-div">
                                            <button className="buttons" id="check-answer-button" style={{display: (isSolved[currentQuestionIndex]) ? "none" : "block"}} onClick={checkAndSubmitAnswer}>Check Answer</button>
                                        </div>
                                    </div>
                    })
                }
            </div>

            <div id="quizbox-bottom-section">
                <div id="score-display-box" style={{display : (!isLoading && !errorOccured) ? "block" : "none"}}><b>Score :</b> {score} / {questionsList.length}</div>
            </div>

        </div>
    )
}
